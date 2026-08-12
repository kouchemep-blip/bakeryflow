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
    // Sur mobile : plein écran, hauteur = viewport moins la barre de navigation basse (68px).
    // Sur desktop : carte centrée classique, comme les autres pages de l'espace client.
    <main className="flex h-[calc(100dvh-68px)] flex-col md:mx-auto md:h-[calc(100vh-3rem)] md:max-w-3xl md:px-6 md:py-8">
      <h1 className="hidden shrink-0 text-2xl font-bold text-gray-900 md:mb-6 md:block">
        Discussion avec Lino&apos;s Food
      </h1>

      <div className="min-h-0 flex-1">
        <ChatWithChef
          conversationId={conversation.id}
          participantSubtitle="Réponse sous 24h en général"
        />
      </div>
    </main>
  );
}