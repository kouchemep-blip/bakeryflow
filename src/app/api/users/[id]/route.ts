import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({ isActive: z.boolean() });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: "Statut invalide." }, { status: 400 });
  const { id } = await params;
  const user = await prisma.user.update({ where: { id: Number(id) }, data: parsed.data, select: { id: true, isActive: true } });
  return NextResponse.json(user);
}
