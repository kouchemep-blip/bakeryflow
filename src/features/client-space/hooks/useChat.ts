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


  // ─────────────────────────────────────────
  // Charger l'historique des messages
  // ─────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/chat/${conversationId}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setMessages(data.messages ?? []);

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

    loadHistory();


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


    return () => {

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
          content,
        }
      );

    },
    [conversationId]
  );




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
    markRead,
  };
}