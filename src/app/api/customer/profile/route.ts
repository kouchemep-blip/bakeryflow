import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const profileSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(30),
  password: z.string().min(8).max(100).optional().or(z.literal("")),
  avatar: z.string().url().max(1_000).nullable().optional(),
});

const publicUser = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  avatar: true,
  createdAt: true,
} as const;

export async function GET(request: NextRequest) {
  const user = await requireUser(request);
  if (user instanceof NextResponse) return user;
  return NextResponse.json(await prisma.user.findUnique({ where: { id: user.id }, select: publicUser }));
}

export async function PUT(request: NextRequest) {
  const user = await requireUser(request);
  if (user instanceof NextResponse) return user;

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: "Informations de profil invalides." }, { status: 400 });

  const { password, ...values } = parsed.data;
  try {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { ...values, ...(password ? { password: await bcrypt.hash(password, 12) } : {}) },
      select: publicUser,
    });
    return NextResponse.json(updated);
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ message: "Ce numéro de téléphone est déjà utilisé." }, { status: 409 });
    }
    return NextResponse.json({ message: "Impossible de mettre à jour le profil." }, { status: 500 });
  }
}
