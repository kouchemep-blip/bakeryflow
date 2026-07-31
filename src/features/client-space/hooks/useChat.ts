"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export type ChatMessage = {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
};

type UseChatReturn = {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  conversationId: number | null;
  sendMessage: (content: string) => void;
  markRead: () => void;
};

type UseChatProps = {
  // Token JWT récupéré côté client depuis /api/auth/me ou passé en prop
  token: string;
  userId: number;
};

export function useChat({ token, userId }: UseChatProps): UseChatReturn {
  const [messages,       setMessages]       = useState<ChatMessage[]>([]);
  const [isConnected,    setIsConnected]    = useState(false);
  const [isLoading,      setIsLoading]      = useState(true);
  const [conversationId, setConversationId] = useState<number | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // ── Charge l'historique + initialise la conversation ──────────────────
  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/chat", { credentials: "include" });
      if (!res.ok) return;

      const data = await res.json();
      setConversationId(data.id);
      setMessages(data.messages ?? []);
    } catch (error) {
      console.error("loadHistory error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Connexion Socket.IO ────────────────────────────────────────────────
  useEffect(() => {
    loadHistory();

    // Ouvre la connexion avec le token en handshake
    const socket = io(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", {
      auth: { token },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Reçoit un nouveau message — ajoute à la liste
    socket.on("new_message", (message: ChatMessage) => {
      setMessages((prev) => {
        // Évite les doublons si le serveur renvoie le propre message de l'émetteur
        const exists = prev.some((m) => m.id === message.id);
        return exists ? prev : [...prev, message];
      });
    });

    // Rejoint la room une fois la conversation chargée
    socket.on("connect", () => {
      if (conversationId) {
        socket.emit("join_conversation", conversationId);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Rejoint la room quand conversationId est connu ─────────────────────
  useEffect(() => {
    if (conversationId && socketRef.current?.connected) {
      socketRef.current.emit("join_conversation", conversationId);
    }
  }, [conversationId]);

  // ── Envoie un message ──────────────────────────────────────────────────
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !conversationId || !socketRef.current) return;
      socketRef.current.emit("send_message", { conversationId, content });
    },
    [conversationId]
  );

  // ── Marque les messages comme lus ─────────────────────────────────────
  const markRead = useCallback(() => {
    if (!conversationId || !socketRef.current) return;
    socketRef.current.emit("mark_read", conversationId);
  }, [conversationId]);

  return {
    messages,
    isConnected,
    isLoading,
    conversationId,
    sendMessage,
    markRead,
  };
}