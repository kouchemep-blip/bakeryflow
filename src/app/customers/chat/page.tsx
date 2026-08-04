import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

import { ChatWithChef } from "@/features/client-space/components/ChatWithChef";

export default async function ClientChatPage() {
  // Vérification authentification
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/");
  }

  let userId: number;

  try {
    const payload = verifyToken(token.value) as {
      id: number;
    };

    userId = payload.id;
  } catch {
    redirect("/");
  }

  const hasOrder = await prisma.order.count({ where: { userId } });
  if (hasOrder === 0) redirect("/customers/orders");

  // Cherche la conversation du client
  let conversation = await prisma.conversation.findUnique({
    where: {
      userId,
    },
  });

  // Si elle n'existe pas encore, on la crée
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId,
      },
    });
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Discussion avec Lino&apos;s Food
      </h1>

      <div className="h-[600px]">
        <ChatWithChef conversationId={conversation.id} />
      </div>
    </main>
  );
}
