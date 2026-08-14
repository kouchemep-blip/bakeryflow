import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { ChatWithChef } from "@/features/client-space/components/ChatWithChef";

export default async function ClientChatPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/");
  }

  let userId: number;

  try {
    const payload = verifyToken(token.value) as { id: number };
    userId = payload.id;
  } catch {
    redirect("/");
  }

  const hasOrder = await prisma.order.count({ where: { userId } });
  if (hasOrder === 0) redirect("/customers/orders");

  let conversation = await prisma.conversation.findUnique({
    where: { userId },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId },
    });
  }

  return (
    <main className="relative min-h-[calc(100dvh-68px)] overflow-hidden bg-[#F5EFE6] px-4 py-4 text-black md:mx-auto md:min-h-[calc(100vh-3rem)] md:max-w-5xl md:px-6 md:py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#EA580C]/10 blur-3xl" />
        <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#111827]/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <div className="relative z-10 flex h-full min-h-[calc(100dvh-68px)] flex-col md:min-h-[calc(100vh-3rem)]">
        <div className="mb-4 hidden items-end justify-between md:flex">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-black/40">
              Espace client
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
              Discussion avec BakeryFlow
            </h1>
            <p className="mt-2 text-sm leading-7 text-black/60">
              Un espace simple pour poser vos questions, suivre votre commande et échanger directement.
            </p>
          </div>

          <div className="rounded-full border border-[#EA580C]/10 bg-white/55 px-4 py-2 text-sm font-medium text-black/70 backdrop-blur-md">
            Réponse sous 24h en général
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:hidden">
          <div className="rounded-[1.5rem] border border-white/55 bg-white/50 p-4 shadow-[0_12px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/40">
              Espace client
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-black">
              Discussion avec BakeryFlow
            </h1>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Réponse sous 24h en général.
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <ChatWithChef
            conversationId={conversation.id}
            participantSubtitle="Réponse sous 24h en général"
          />
        </div>
      </div>
    </main>
  );
}