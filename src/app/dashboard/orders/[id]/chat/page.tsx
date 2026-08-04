import { ChatWithChef } from "@/features/client-space/components/ChatWithChef";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderChatPage({ params }: Props) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value ?? "";
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!order) {
    notFound();
  }

  let conversation = await prisma.conversation.findUnique({
    where: {
      userId: order.userId,
    },
    include: {
      messages: true,
      user: true,
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId: order.userId,
      },
      include: {
        messages: true,
        user: true,
      },
    });
  }

  return (
    <div>
      <>
        <h1>Commande #{order.id}</h1>

        <ChatWithChef token={token} />
      </>
    </div>
  );
}
