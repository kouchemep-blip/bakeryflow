"use client";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../hooks/useChat";

type ChatMessageProps = {
  message: ChatMessageType;
  // true = message envoyé par l'utilisateur courant
  isMine: boolean;
  onEdit: (message: ChatMessageType) => void;
  onDelete: (messageId: number) => void;
};

// Formate HH:MM depuis une date ISO
function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour:   "2-digit",
    minute: "2-digit",
  });
}

export function ChatMessageBubble({ message, isMine, onEdit, onDelete }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1    }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={[
        "flex flex-col max-w-[75%]",
        isMine ? "self-end items-end" : "self-start items-start",
      ].join(" ")}
    >
      {/* Bulle */}
      <div
        className={[
          "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
          isMine
            ? "bg-gray-900 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm",
        ].join(" ")}
      >
        {message.content}
      </div>

      {/* Heure + statut lu */}
      <div className="flex items-center gap-1 mt-1 px-1">
        <span className="text-[10px] text-gray-400">
          {formatTime(message.createdAt)}
        </span>
        {isMine && (
          <span className={[
            "text-[10px] font-medium",
            message.isRead ? "text-amber-500" : "text-gray-300",
          ].join(" ")}>
            {message.isRead ? "Lu" : "Envoyé"}
          </span>
        )}
        {isMine && (
          <span className="ml-1 flex gap-1">
            <button aria-label="Modifier le message" onClick={() => onEdit(message)} className="text-gray-400 hover:text-amber-600"><Pencil size={12} /></button>
            <button aria-label="Supprimer le message" onClick={() => onDelete(message.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={12} /></button>
          </span>
        )}
      </div>
    </motion.div>
  );
}
