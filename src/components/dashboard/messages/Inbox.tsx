"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { MessageCircle, Search } from "lucide-react";
import { ChatWithChef } from "@/features/client-space/components/ChatWithChef";

export type InboxConversation = {
  id: number;
  customer: { firstName: string; lastName: string; email: string; avatar: string | null };
  lastMessage: { content: string; createdAt: Date } | null;
  unreadCount: number;
};

function displayName(customer: InboxConversation["customer"]) {
  return `${customer.firstName} ${customer.lastName}`.trim();
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }).format(new Date(date));
}

export function Inbox({ conversations }: { conversations: InboxConversation[] }) {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", { withCredentials: true });
    socket.on("connect", () => socket.emit("join_admin_inbox"));
    socket.on("inbox_updated", () => router.refresh());
    return () => {
      socket.disconnect();
    };
  }, [router]);
  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? null;
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr");
    if (!query) return conversations;
    return conversations.filter(({ customer }) => `${customer.firstName} ${customer.lastName} ${customer.email}`.toLocaleLowerCase("fr").includes(query));
  }, [conversations, search]);

  return (
    <section className="grid min-h-[650px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="border-b border-gray-200 lg:border-b-0 lg:border-r">
        <div className="border-b border-gray-100 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Messagerie</h1>
              <p className="text-sm text-gray-500">Conversations clients</p>
            </div>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">{conversations.reduce((sum, item) => sum + item.unreadCount, 0)} non lus</span>
          </div>
          <label className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-gray-500">
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un client" className="w-full bg-transparent text-sm outline-none" />
          </label>
        </div>
        <div className="max-h-[520px] overflow-y-auto">
          {filtered.map((conversation) => (
            <button key={conversation.id} onClick={() => setSelectedId(conversation.id)} className={`flex w-full gap-3 border-b border-gray-100 p-4 text-left transition hover:bg-amber-50 ${selectedId === conversation.id ? "bg-amber-50" : ""}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">{conversation.customer.firstName[0]}{conversation.customer.lastName[0]}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2"><strong className="truncate text-sm text-gray-900">{displayName(conversation.customer)}</strong>{conversation.lastMessage && <time className="shrink-0 text-[11px] text-gray-400">{formatTime(conversation.lastMessage.createdAt)}</time>}</div>
                <div className="mt-1 flex items-center gap-2"><p className="truncate text-sm text-gray-500">{conversation.lastMessage?.content ?? "Aucun message"}</p>{conversation.unreadCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">{conversation.unreadCount}</span>}</div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && <p className="p-6 text-center text-sm text-gray-500">Aucune conversation trouvée.</p>}
        </div>
      </aside>
      <div className="min-h-[650px] p-0 sm:p-4">
        {selected ? <ChatWithChef conversationId={selected.id} participantName={displayName(selected.customer)} participantSubtitle={selected.customer.email} /> : <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-gray-500"><MessageCircle size={36} className="text-gray-300" /><p>Aucune conversation client pour le moment.</p></div>}
      </div>
    </section>
  );
}
