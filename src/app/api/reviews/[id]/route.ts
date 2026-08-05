import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type RouteProps = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: RouteProps) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ message: "Identifiant d'avis invalide." }, { status: 400 });
  }

  try {
    // La suppression reste exclusivement côté administration : un client peut publier plusieurs avis,
    // mais ne dispose pas d'un endpoint permettant de supprimer ceux des autres utilisateurs.
    await prisma.review.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if ((error as { code?: string }).code === "P2025") {
      return NextResponse.json({ message: "Avis introuvable." }, { status: 404 });
    }
    return NextResponse.json({ message: "Impossible de supprimer cet avis." }, { status: 500 });
  }
}
