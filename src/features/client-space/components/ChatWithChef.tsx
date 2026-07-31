"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChefHat } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { ChatMessageBubble } from "./ChatMessage";
import { ChatPresence } from "./ChatPresence";

type ChatWithChefProps = {
  // Token JWT et userId fournis par la page /client (depuis /api/auth/me)
  token: string;
  userId: number;
};

export function ChatWithChef({ token, userId }: ChatWithChefProps) {
  const { messages, isConnected, isLoading, sendMessage, markRead } = useChat({
    token,
    userId,
  });

  const [input, setInput]   = useState("");
  const bottomRef           = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);

  // Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Marque les messages comme lus à l'ouverture et à chaque nouveau message
  useEffect(() => {
    markRead();
  }, [messages.length, markRead]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Envoi sur Entrée (sans Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        {/* Avatar cheffe */}
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <ChefHat size={20} className="text-amber-600" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900">La Cheffe</span>
          <ChatPresence isConnected={isConnected} />
        </div>
      </div>

      {/* ── Messages ──────────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        aria-live="polite"
        aria-label="Messages"
      >
        {/* Skeleton chargement */}
        {isLoading && (
          <div className="flex flex-col gap-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={[
                  "h-10 rounded-2xl bg-gray-100 max-w-[60%]",
                  i % 2 === 0 ? "self-start" : "self-end",
                ].join(" ")}
              />
            ))}
          </div>
        )}

        {/* Aucun message */}
        {!isLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center py-12">
            <ChefHat size={36} className="text-gray-200" />
            <p className="text-sm text-gray-400">
              Pas encore de message. Dis bonjour à la cheffe !
            </p>
          </div>
        )}

        {/* Liste messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              isMine={msg.senderId === userId}
            />
          ))}
        </AnimatePresence>

        {/* Ancre scroll bas */}
        <div ref={bottomRef} />
      </div>

      {/* ── Input envoi ───────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écris un message..."
          aria-label="Message à envoyer"
          className={[
            "flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm",
            "outline-none border border-transparent",
            "focus:border-amber-300 focus:bg-white transition-colors duration-150",
            "placeholder:text-gray-400",
          ].join(" ")}
        />
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Envoyer le message"
          className={[
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            "transition-colors duration-150",
            input.trim()
              ? "bg-gray-900 text-white hover:bg-amber-500"
              : "bg-gray-100 text-gray-300 cursor-not-allowed",
          ].join(" ")}
        >
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
}