"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Send } from "lucide-react";

import { useChat } from "../hooks/useChat";
import { ChatMessageBubble } from "./ChatMessage";
import { ChatPresence } from "./ChatPresence";

type ChatWithChefProps = {
  conversationId: number;
};

export function ChatWithChef({ conversationId }: ChatWithChefProps) {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const {
    messages,
    isConnected,
    isLoading,
    sendMessage,
    markRead,
  } = useChat({
    conversationId,
  });

  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Récupère l'utilisateur connecté
  useEffect(() => {
    async function loadCurrentUser() {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!res.ok) return;

      const user = await res.json();
      setCurrentUserId(user.id);
    }

    loadCurrentUser();
  }, []);

  // Scroll automatique
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Marquer les messages lus
  useEffect(() => {
    markRead();
  }, [messages.length, markRead]);

  function handleSend() {
    if (!input.trim()) return;

    sendMessage(input.trim());

    setInput("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
          <ChefHat size={20} className="text-amber-600" />
        </div>

        <div>
          <h2 className="font-semibold text-gray-900">
            La Cheffe
          </h2>

          <ChatPresence isConnected={isConnected} />
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        aria-live="polite"
      >
        {isLoading && (
          <div className="flex flex-col gap-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-10 rounded-2xl bg-gray-100 max-w-[60%] ${
                  i % 2 ? "self-start" : "self-end"
                }`}
              />
            ))}
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="flex flex-col flex-1 items-center justify-center gap-3 text-center">
            <ChefHat
              size={36}
              className="text-gray-200"
            />

            <p className="text-sm text-gray-400">
              Pas encore de message. Commencez la discussion avec la cheffe.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <ChatMessageBubble
              key={message.id}
              message={message}
              isMine={message.senderId === currentUserId}
            />
          ))}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-4 flex items-center gap-3">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez un message..."
          className="flex-1 rounded-full border border-transparent bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-amber-300 focus:bg-white"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          disabled={!input.trim()}
          onClick={handleSend}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
            input.trim()
              ? "bg-gray-900 text-white hover:bg-amber-500"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
}