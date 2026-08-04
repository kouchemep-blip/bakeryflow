"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { io } from "socket.io-client";

/** Affiche une notification légère quand l'administration écrit hors de la page de discussion. */
export function MessageNotifier() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", { withCredentials: true });
    socket.on("message_notification", ({ content }: { content: string }) => {
      setMessage(content);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  if (!message) return null;
  return <Link href="/customers/chat" onClick={() => setMessage(null)} className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl">Nouveau message de Lino&apos;s Food : <span className="font-medium">{message}</span></Link>;
}
