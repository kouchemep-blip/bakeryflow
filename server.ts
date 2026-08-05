// Serveur custom Next.js + Socket.IO
// Lance avec : node server.ts (ou ts-node server.ts)
// Remplace "next start" dans package.json

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { prisma } from "./src/lib/prisma";
import { verifyToken } from "./src/lib/jwt";

const dev  = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);
const app  = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // ── Middleware auth Socket.IO ──────────────────────────────────────────
  // Vérifie le token JWT passé en handshake avant toute connexion
  io.use(async (socket, next) => {
    const cookieToken = socket.handshake.headers.cookie
      ?.split(";")
      .map((part) => part.trim().split("="))
      .find(([key]) => key === "token")?.[1];
    const token = (socket.handshake.auth?.token as string | undefined) ?? cookieToken;

    if (!token) {
      return next(new Error("Non authentifié."));
    }

    try {
      const payload = verifyToken(token) as { id: number; role: string };
      // Attache l'user au socket pour usage dans les events
      socket.data.userId = payload.id;
      socket.data.role   = payload.role;
      next();
    } catch {
      next(new Error("Token invalide."));
    }
  });

  // ── Events Socket.IO ───────────────────────────────────────────────────
  io.on("connection", (socket) => {
    const userId: number = socket.data.userId;
    const role:   string = socket.data.role;

    // Cette room personnelle permet de prévenir un client même lorsqu'il n'est pas sur la page chat.
    socket.join(`user_${userId}`);

    console.log(`Socket connecté — userId: ${userId}, role: ${role}`);

    // ── Rejoindre la room de conversation ───────────────────────────────
    socket.on("join_admin_inbox", () => {
      if (role === "ADMIN" || role === "SUPER_ADMIN") socket.join("admin_inbox");
    });

    socket.on("join_conversation", async (conversationId: number) => {
      // Vérifie que l'user a bien accès à cette conversation
      const conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      // Client : doit être le propriétaire. Admin/cheffe : accès libre.
      if (!conv) {
        socket.emit("error", "Conversation introuvable.");
        return;
      }
      if (role !== "ADMIN" && role !== "SUPER_ADMIN" && conv.userId !== userId) {
        socket.emit("error", "Accès refusé.");
        return;
      }

      for (const room of socket.rooms) {
        if (room.startsWith("conv_")) socket.leave(room);
      }
      socket.join(`conv_${conversationId}`);
      socket.emit("joined", { conversationId });
    });

    // ── Envoyer un message ───────────────────────────────────────────────
    socket.on(
      "send_message",
      async ({
        conversationId,
        content,
      }: {
        conversationId: number;
        content: string;
      }) => {
        if (!content?.trim() || content.trim().length > 2_000) {
          socket.emit("error", "Le message doit contenir entre 1 et 2 000 caractères.");
          return;
        }

        try {
          const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
          if (!conv || ((role !== "ADMIN" && role !== "SUPER_ADMIN") && conv.userId !== userId)) {
            socket.emit("error", "Accès refusé.");
            return;
          }
          // Sauvegarde en base
          const message = await prisma.message.create({
            data: {
              conversationId,
              senderId: userId,
              content:  content.trim(),
            },
          });

          // Broadcast à tous les membres de la room (client + cheffe)
          io.to(`conv_${conversationId}`).emit("new_message", {
            id:             message.id,
            conversationId: message.conversationId,
            senderId:       message.senderId,
            content:        message.content,
            isRead:         message.isRead,
            createdAt:      message.createdAt,
          });
          io.to("admin_inbox").emit("inbox_updated", { conversationId });
          // La notification est réservée au destinataire client : un client ne se notifie pas lui-même.
          if (role === "ADMIN" || role === "SUPER_ADMIN") {
            io.to(`user_${conv.userId}`).emit("message_notification", { conversationId, content: message.content });
          }
        } catch (error) {
          console.error("send_message error:", error);
          socket.emit("error", "Erreur lors de l'envoi du message.");
        }
      }
    );

    // ── Marquer les messages comme lus ───────────────────────────────────
    socket.on("mark_read", async (conversationId: number) => {
      try {
        const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conv || ((role !== "ADMIN" && role !== "SUPER_ADMIN") && conv.userId !== userId)) return;
        await prisma.message.updateMany({
          where: {
            conversationId,
            // Marque comme lus les messages envoyés par l'autre partie
            senderId: { not: userId },
            isRead:   false,
          },
          data: { isRead: true },
        });

        // Notifie la room que les messages ont été lus
        io.to(`conv_${conversationId}`).emit("messages_read", {
          conversationId,
          readBy: userId,
        });
        io.to("admin_inbox").emit("inbox_updated", { conversationId });
      } catch (error) {
        console.error("mark_read error:", error);
      }
    });

    // Un utilisateur peut uniquement modifier ou supprimer ses propres messages.
    socket.on("edit_message", async ({ messageId, content }: { messageId: number; content: string }) => {
      if (!content?.trim() || content.trim().length > 2_000) return;
      const message = await prisma.message.findUnique({ where: { id: messageId } });
      if (!message || message.senderId !== userId) return;
      const updated = await prisma.message.update({ where: { id: messageId }, data: { content: content.trim() } });
      io.to(`conv_${updated.conversationId}`).emit("message_updated", updated);
      io.to("admin_inbox").emit("inbox_updated", { conversationId: updated.conversationId });
    });

    socket.on("delete_message", async ({ messageId }: { messageId: number }) => {
      const message = await prisma.message.findUnique({ where: { id: messageId } });
      if (!message || message.senderId !== userId) return;
      await prisma.message.delete({ where: { id: messageId } });
      io.to(`conv_${message.conversationId}`).emit("message_deleted", { messageId });
      io.to("admin_inbox").emit("inbox_updated", { conversationId: message.conversationId });
    });

    // ── Présence : notifie la room à la déconnexion ──────────────────────
    socket.on("disconnect", () => {
      console.log(`Socket déconnecté — userId: ${userId}`);
    });
  });

  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`> BakeryFlow prêt sur le port ${port}`);
  });
});
