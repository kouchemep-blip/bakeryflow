import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const reviewSchema = z.object({
  productId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(1_000),
});

export async function POST(request: NextRequest) {
  const user = await requireUser(request);
  if (user instanceof NextResponse) return user;
  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: "Avis invalide." }, { status: 400 });

  const deliveredPurchase = await prisma.orderitem.findFirst({
    where: { productId: parsed.data.productId, order: { userId: user.id, status: "DELIVERED" } },
    select: { id: true },
  });
  if (!deliveredPurchase) {
    return NextResponse.json({ message: "Vous pourrez évaluer ce produit après la livraison d'une commande qui le contient." }, { status: 403 });
  }

  const review = await prisma.review.create({ data: { userId: user.id, ...parsed.data } });
  return NextResponse.json(review, { status: 201 });
}
