import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";

// ── GET : historique des messages d'une conversation ──────────────────────────
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
  }
  if (isAdmin(user.role)) {
    return NextResponse.json({ message: "Utilisez la conversation d'un client." }, { status: 400 });
  }

  const hasOrder = await prisma.order.count({ where: { userId: user.id } });
  if (hasOrder === 0) {
    return NextResponse.json({ message: "Le chat est disponible après votre première commande." }, { status: 403 });
  }

  try {
    // Trouve ou crée la conversation du client
    let conversation = await prisma.conversation.findUnique({
      where: { userId: user.id },
      include: {
        message: {
          orderBy: { createdAt: "asc" },
          take: 50, // 50 derniers messages
        },
      },
    });

    // Crée la conversation si elle n'existe pas encore
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { userId: user.id },
        include: { message: true },
      });
    }

    return NextResponse.json(conversation, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération de la conversation." },
      { status: 500 }
    );
  }
}
