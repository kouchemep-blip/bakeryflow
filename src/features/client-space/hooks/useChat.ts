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
  sendMessage: (content: string) => void;
  editMessage: (messageId: number, content: string) => void;
  deleteMessage: (messageId: number) => void;
  markRead: () => void;
};

type UseChatProps = {
  conversationId: number;
};


export function useChat({
  conversationId,
}: UseChatProps): UseChatReturn {

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const activeConversationIdRef = useRef(conversationId);


  // ─────────────────────────────────────────
  // Charger l'historique des messages
  // ─────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    const requestedConversationId = conversationId;
    try {
      const res = await fetch(
        `/api/chat/${conversationId}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      if (activeConversationIdRef.current !== requestedConversationId) return;

      // L'API Prisma expose la relation sous le nom `message` (au singulier).
      // Fusionner évite qu'un événement Socket reçu pendant la requête disparaisse.
      setMessages((current) => {
        const byId = new Map(current.map((message) => [message.id, message]));
        for (const message of data.message ?? []) byId.set(message.id, message);
        return [...byId.values()].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });

    } catch (error) {
      console.error(
        "loadHistory error:",
        error
      );

    } finally {
      setIsLoading(false);
    }

  }, [conversationId]);



  // ─────────────────────────────────────────
  // Connexion Socket.IO
  // ─────────────────────────────────────────
  useEffect(() => {

    activeConversationIdRef.current = conversationId;
    setMessages([]);
    setIsLoading(true);

    const historyTimer = window.setTimeout(loadHistory, 0);


    const socket = io(
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000",
      {
        withCredentials: true,
      }
    );


    socketRef.current = socket;


    socket.on("connect", () => {

      setIsConnected(true);

      socket.emit(
        "join_conversation",
        conversationId
      );

    });


    socket.on("disconnect", () => {
      setIsConnected(false);
    });



    // Nouveau message reçu
    socket.on(
      "new_message",
      (message: ChatMessage) => {

        if (message.conversationId !== activeConversationIdRef.current) return;

        setMessages((prev) => {

          const exists = prev.some(
            (m) => m.id === message.id
          );

          if (exists) return prev;

          return [
            ...prev,
            message
          ];
        });

      }
    );

    // Met à jour le statut "Lu" chez l'expéditeur dès que le destinataire ouvre le fil.
    socket.on("messages_read", () => {
      void loadHistory();
    });

    socket.on("message_updated", (message: ChatMessage) => {
      if (message.conversationId !== activeConversationIdRef.current) return;
      setMessages((current) => current.map((item) => item.id === message.id ? message : item));
    });

    socket.on("message_deleted", ({ messageId }: { messageId: number }) => {
      setMessages((current) => current.filter((message) => message.id !== messageId));
    });


    return () => {

      window.clearTimeout(historyTimer);
      socket.disconnect();

    };


  }, [
    conversationId,
    loadHistory
  ]);




  // ─────────────────────────────────────────
  // Envoyer un message
  // ─────────────────────────────────────────
  const sendMessage = useCallback(
    (content: string) => {

      if (
        !content.trim() ||
        !socketRef.current
      ) return;


      socketRef.current.emit(
        "send_message",
        {
          conversationId,
          content: content.trim(),
        }
      );

    },
    [conversationId]
  );

  const editMessage = useCallback((messageId: number, content: string) => {
    if (content.trim() && socketRef.current) socketRef.current.emit("edit_message", { messageId, content: content.trim() });
  }, []);

  const deleteMessage = useCallback((messageId: number) => {
    socketRef.current?.emit("delete_message", { messageId });
  }, []);




  // ─────────────────────────────────────────
  // Marquer comme lu
  // ─────────────────────────────────────────
  const markRead = useCallback(() => {

    if (!socketRef.current) return;


    socketRef.current.emit(
      "mark_read",
      conversationId
    );

  }, [conversationId]);



  return {
    messages,
    isConnected,
    isLoading,
    sendMessage,
    editMessage,
    deleteMessage,
    markRead,
  };
}
