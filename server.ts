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

    console.log(`Socket connecté — userId: ${userId}, role: ${role}`);

    // ── Rejoindre la room de conversation ───────────────────────────────
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
      if (role === "CLIENT" && conv.userId !== userId) {
        socket.emit("error", "Accès refusé.");
        return;
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
        if (!content?.trim()) return;

        try {
          const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
          if (!conv || (role === "CLIENT" && conv.userId !== userId)) {
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
        if (!conv || (role === "CLIENT" && conv.userId !== userId)) return;
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
      } catch (error) {
        console.error("mark_read error:", error);
      }
    });

    // ── Présence : notifie la room à la déconnexion ──────────────────────
    socket.on("disconnect", () => {
      console.log(`Socket déconnecté — userId: ${userId}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> BakeryFlow prêt sur http://localhost:${port}`);
  });
});
