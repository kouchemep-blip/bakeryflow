"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChefHat,
  Send,
  Sparkles,
  MessageCircleMore,
  Clock3,
  BadgeInfo,
  Plus,
  ClipboardList,
} from "lucide-react";

import { useChat } from "../hooks/useChat";
import { ChatMessageBubble } from "./ChatMessage";
import { ChatPresence } from "./ChatPresence";

type ChatWithChefProps = {
  conversationId: number;
  participantName?: string;
  participantSubtitle?: string;
};

type QuickReply = {
  label: string;
  value: string;
};

export function ChatWithChef({
  conversationId,
  participantName = "Bakeryflow",
  participantSubtitle,
}: ChatWithChefProps) {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    messages,
    isConnected,
    isLoading,
    sendMessage,
    editMessage,
    deleteMessage,
    markRead,
  } = useChat({ conversationId });

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    markRead();
  }, [messages.length, markRead]);

  const lastCustomerMessage = useMemo(() => {
    const latest = [...messages]
      .reverse()
      .find((message) => message.senderId === currentUserId);
    return latest?.content ?? "Aucun message récent.";
  }, [messages, currentUserId]);

  const quickReplies: QuickReply[] = [
    {
      label: "Suivi commande",
      value: "Bonjour, pouvez-vous me faire un point sur ma commande ?",
    },
    {
      label: "Heure de retrait",
      value: "Bonjour, quelle est l'heure prévue pour le retrait ?",
    },
    {
      label: "Modifier ma commande",
      value: "Bonjour, je souhaite modifier ma commande.",
    },
    {
      label: "Adresse / livraison",
      value:
        "Bonjour, pouvez-vous me confirmer l'adresse ou les modalités de livraison ?",
    },
  ];

  const summaryCards = [
    {
      title: "Statut",
      value: isConnected ? "Équipe joignable" : "Réponse en attente",
      icon: BadgeInfo,
    },
    {
      title: "Dernier message",
      value: lastCustomerMessage,
      icon: MessageCircleMore,
    },
    {
      title: "Canal",
      value: "Discussion privée",
      icon: ClipboardList,
    },
    {
      title: "Support",
      value: participantSubtitle ?? "Réponse sous 24h en général",
      icon: Clock3,
    },
  ];

  function handleSend(messageOverride?: string) {
    const content = (messageOverride ?? input).trim();
    if (!content) return;

    sendMessage(content);
    setInput("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleEdit(message: (typeof messages)[number]) {
    const content = window.prompt("Modifier le message", message.content);
    if (
      content !== null &&
      content.trim() &&
      content.trim() !== message.content
    ) {
      editMessage(message.id, content);
    }
  }

  function handleDelete(messageId: number) {
    if (window.confirm("Supprimer définitivement ce message ?")) {
      deleteMessage(messageId);
    }
  }

  return (
     <div className="flex h-full min-h-0">
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2rem] border border-white/55 bg-white/45 shadow-[0_24px_110px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/5 px-4 py-4 md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/customers"
              aria-label="Retour"
              className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black/55 transition hover:bg-black/5 hover:text-black md:hidden"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF7F0] text-[#EA580C] shadow-sm">
              <ChefHat size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-black md:text-lg">
                {participantName}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <ChatPresence isConnected={isConnected} />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-xs font-medium text-black/65 transition hover:bg-white lg:hidden"
          >
            <Plus
              className={`h-4 w-4 transition-transform ${sidebarOpen ? "rotate-45" : ""}`}
            />
            Résumé
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/55 px-4 py-2 text-xs font-medium text-black/60 md:flex">
            <Clock3 className="h-4 w-4 text-[#EA580C]" />
            {participantSubtitle}
          </div>
        </div>

        <div className="border-b border-black/5 px-4 py-3 md:px-5">
          <div className="flex items-center gap-2 text-sm text-black/60">
            <Sparkles className="h-4 w-4 text-[#EA580C]" />
            <span>
              Posez une question, demandez un suivi ou réglez un détail en
              quelques secondes.
            </span>
          </div>
        </div>

        <div
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-3 py-4 md:px-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-[#C3B9B1]"
          aria-live="polite"
        >
          {isLoading && (
            <div className="flex animate-pulse flex-col gap-3 px-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-12 max-w-[78%] rounded-3xl bg-black/5 md:max-w-[62%] ${
                    i % 2 ? "self-start" : "self-end"
                  }`}
                />
              ))}
            </div>
          )}

          {!isLoading && messages.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[#FFF7F0] text-[#EA580C] shadow-sm">
                <MessageCircleMore className="h-7 w-7" />
              </div>
              <p className="text-base font-medium text-black">
                Pas encore de message
              </p>
              <p className="mt-2 max-w-sm text-sm leading-7 text-black/55">
                Commencez la discussion avec notre équipe. Vous pouvez poser une
                question, demander un suivi ou clarifier votre commande.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                isMine={message.senderId === currentUserId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        <div className="shrink-0 border-t border-black/5 bg-white/35 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply.label}
                type="button"
                onClick={() => handleSend(reply.value)}
                className="rounded-full border border-[#EA580C]/10 bg-[#FFF7F0] px-3 py-2 text-xs font-medium text-[#A94F10] transition hover:-translate-y-0.5 hover:border-[#EA580C]/20 hover:bg-[#fff0e6]"
              >
                {reply.label}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2 md:gap-3">
            <div className="flex-1 rounded-[1.4rem] border border-transparent bg-white px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition focus-within:border-[#EA580C]/20 focus-within:shadow-[0_10px_36px_rgba(0,0,0,0.06)]">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrivez votre message..."
                className="w-full bg-transparent text-base outline-none placeholder:text-black/35 md:text-sm"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              disabled={!input.trim()}
              onClick={() => handleSend()}
              aria-label="Envoyer"
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition ${
                input.trim()
                  ? "bg-[#111827] text-white hover:bg-[#EA580C]"
                  : "bg-black/5 text-black/25"
              }`}
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
