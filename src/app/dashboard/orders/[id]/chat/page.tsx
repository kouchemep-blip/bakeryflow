import { ChatWithChef } from "@/features/client-space/components/ChatWithChef";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderChatPage({ params }: Props) {
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
      message: true,
      user: true,
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId: order.userId,
      },
      include: {
        message: true,
        user: true,
      },
    });
  }

  return (
    <div>
      <>
        <h1>Commande #{order.id}</h1>

        <div className="h-[600px]">
          <ChatWithChef conversationId={conversation.id} />
        </div>
      </>
    </div>
  );
}
