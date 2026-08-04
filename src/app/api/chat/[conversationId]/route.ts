import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const user = await getCurrentUser(request);

  if (!user) {
    return NextResponse.json(
      {
        message: "Non authentifié",
      },
      {
        status: 401,
      },
    );
  }

  const { conversationId } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: Number(conversationId),
    },

    include: {
      message: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      {
        message: "Conversation introuvable",
      },
      {
        status: 404,
      },
    );
  }

  // Sécurité : vérifier que la conversation appartient au client
  if (!isAdmin(user.role) && conversation.userId !== user.id) {
    return NextResponse.json(
      {
        message: "Accès interdit",
      },
      {
        status: 403,
      },
    );
  }

  return NextResponse.json(conversation);
}
