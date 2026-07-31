"use client";
import { motion, AnimatePresence } from "framer-motion";

type ChatPresenceProps = {
  isConnected: boolean;
};

export function ChatPresence({ isConnected }: ChatPresenceProps) {
  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={isConnected ? "online" : "offline"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1   }}
          exit={{ opacity: 0, scale: 0.8    }}
          transition={{ duration: 0.2 }}
          className={[
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-400" : "bg-gray-300",
          ].join(" ")}
        />
      </AnimatePresence>
      <span className="text-xs text-gray-500">
        {isConnected
          ? "En ligne — répond généralement en quelques minutes"
          : "Absent pour l'instant"}
      </span>
    </div>
  );
}