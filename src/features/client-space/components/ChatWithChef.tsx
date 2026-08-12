// "use client";

// import { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChefHat, Send } from "lucide-react";

// import { useChat } from "../hooks/useChat";
// import { ChatMessageBubble } from "./ChatMessage";
// import { ChatPresence } from "./ChatPresence";

// type ChatWithChefProps = {
//   conversationId: number;
//   participantName?: string;
//   participantSubtitle?: string;
// };

// export function ChatWithChef({
//   conversationId,
//   participantName = "Lino's Food",
//   participantSubtitle,
// }: ChatWithChefProps) {
//   const [currentUserId, setCurrentUserId] = useState<number | null>(null);

//   const {
//     messages,
//     isConnected,
//     isLoading,
//     sendMessage,
//     editMessage,
//     deleteMessage,
//     markRead,
//   } = useChat({
//     conversationId,
//   });

//   const [input, setInput] = useState("");

//   const bottomRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Récupère l'utilisateur connecté
//   useEffect(() => {
//     async function loadCurrentUser() {
//       const res = await fetch("/api/auth/me", {
//         credentials: "include",
//       });

//       if (!res.ok) return;

//       const user = await res.json();
//       setCurrentUserId(user.id);
//     }

//     loadCurrentUser();
//   }, []);

//   // Scroll automatique
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages]);

//   // Marquer les messages lus
//   useEffect(() => {
//     markRead();
//   }, [messages.length, markRead]);

//   function handleSend() {
//     if (!input.trim()) return;

//     sendMessage(input.trim());

//     setInput("");
//     inputRef.current?.focus();
//   }

//   function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   }

//   function handleEdit(message: (typeof messages)[number]) {
//     const content = window.prompt("Modifier le message", message.content);
//     if (
//       content !== null &&
//       content.trim() &&
//       content.trim() !== message.content
//     )
//       editMessage(message.id, content);
//   }

//   function handleDelete(messageId: number) {
//     if (window.confirm("Supprimer définitivement ce message ?"))
//       deleteMessage(messageId);
//   }

//   return (
//     <div className="flex flex-col h-full max-h-[600px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
//         <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
//           <ChefHat size={20} className="text-amber-600" />
//         </div>

//         <div>
//           <h2 className="font-semibold text-gray-900">{participantName}</h2>

//           {participantSubtitle && (
//             <p className="text-xs text-gray-500">{participantSubtitle}</p>
//           )}
//           <ChatPresence isConnected={isConnected} />
//         </div>
//       </div>

//       {/* Messages */}
//       <div
//         className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#C3B9B1] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:backdrop-blur-[150px]"
//         aria-live="polite"
//       >
//         {isLoading && (
//           <div className="flex flex-col gap-3 animate-pulse">
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className={`h-10 rounded-2xl bg-gray-100 max-w-[60%] ${
//                   i % 2 ? "self-start" : "self-end"
//                 }`}
//               />
//             ))}
//           </div>
//         )}

//         {!isLoading && messages.length === 0 && (
//           <div className="flex flex-col flex-1 items-center justify-center gap-3 text-center">
//             <ChefHat size={36} className="text-gray-200" />

//             <p className="text-sm text-gray-400">
//               Pas encore de message. Commencez la discussion avec notre équipe.
//             </p>
//           </div>
//         )}

//         <AnimatePresence initial={false}>
//           {messages.map((message) => (
//             <ChatMessageBubble
//               key={message.id}
//               message={message}
//               isMine={message.senderId === currentUserId}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           ))}
//         </AnimatePresence>

//         <div ref={bottomRef} />
//       </div>

//       {/* Input */}
//       <div className="border-t border-gray-100 p-4 flex items-center gap-3">
//         <input
//           ref={inputRef}
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Écrivez un message..."
//           className="flex-1 rounded-full border border-transparent bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-amber-300 focus:bg-white"
//         />

//         <motion.button
//           whileTap={{ scale: 0.9 }}
//           disabled={!input.trim()}
//           onClick={handleSend}
//           className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
//             input.trim()
//               ? "bg-gray-900 text-white hover:bg-[#EA580C]"
//               : "bg-gray-100 text-gray-300 cursor-not-allowed"
//           }`}
//         >
//           <Send size={16} />
//         </motion.button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChefHat, Send } from "lucide-react";

import { useChat } from "../hooks/useChat";
import { ChatMessageBubble } from "./ChatMessage";
import { ChatPresence } from "./ChatPresence";

type ChatWithChefProps = {
  conversationId: number;
  participantName?: string;
  participantSubtitle?: string;
};

export function ChatWithChef({
  conversationId,
  participantName = "Lino's Food",
  participantSubtitle,
}: ChatWithChefProps) {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const {
    messages,
    isConnected,
    isLoading,
    sendMessage,
    editMessage,
    deleteMessage,
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

  function handleEdit(message: (typeof messages)[number]) {
    const content = window.prompt("Modifier le message", message.content);
    if (
      content !== null &&
      content.trim() &&
      content.trim() !== message.content
    )
      editMessage(message.id, content);
  }

  function handleDelete(messageId: number) {
    if (window.confirm("Supprimer définitivement ce message ?"))
      deleteMessage(messageId);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 px-4 py-3 md:px-5 md:py-4">
        {/* Retour — utile uniquement sur mobile, où il n'y a pas de fil d'Ariane visible */}
        <Link
          href="/customers"
          aria-label="Retour"
          className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 md:hidden"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EA580C]/10">
          <ChefHat size={20} className="text-[#EA580C]" />
        </div>

        <div className="min-w-0">
          <h2 className="truncate font-semibold text-gray-900">{participantName}</h2>

          {participantSubtitle && (
            <p className="truncate text-xs text-gray-500">{participantSubtitle}</p>
          )}
          <ChatPresence isConnected={isConnected} />
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-3 py-4 md:px-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#C3B9B1] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:backdrop-blur-[150px]"
        aria-live="polite"
      >
        {isLoading && (
          <div className="flex animate-pulse flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-10 max-w-[75%] rounded-2xl bg-gray-100 md:max-w-[60%] ${
                  i % 2 ? "self-start" : "self-end"
                }`}
              />
            ))}
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ChefHat size={36} className="text-gray-200" />

            <p className="text-sm text-gray-400">
              Pas encore de message. Commencez la discussion avec notre équipe.
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

      {/* Input */}
      <div className="flex shrink-0 items-center gap-2 border-t border-gray-100 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:gap-3 md:p-4">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez un message..."
          // text-base (16px) sur mobile : en dessous, iOS Safari zoome automatiquement le champ au focus.
          className="flex-1 rounded-full border border-transparent bg-gray-50 px-4 py-2.5 text-base outline-none transition focus:border-[#EA580C]/40 focus:bg-white md:text-sm"
        />

        <motion.button
          whileTap={{ scale: 0.9 }}
          disabled={!input.trim()}
          onClick={handleSend}
          aria-label="Envoyer"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${
            input.trim()
              ? "bg-gray-900 text-white hover:bg-[#EA580C]"
              : "bg-gray-100 text-gray-300"
          }`}
        >
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
}