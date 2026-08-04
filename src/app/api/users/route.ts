import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";

const registrationSchema = z.object({
  firstName: z.string().trim().min(2).max(30),
  lastName: z.string().trim().min(2).max(30),
  email: z.string().trim().email().max(191),
  phone: z.string().trim().min(6).max(20),
  password: z.string().min(8).max(72),
});

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("ERREUR API USERS :", error);

    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Erreur lors de la récupération des utilisateurs." },
    { status: 500 },
  );
}

export async function POST(request: Request) {
  try {
    const body = registrationSchema.parse(await request.json());
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Les informations d'inscription sont invalides." },
        { status: 400 },
      );
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Email ou téléphone déjà utilisé." },
        { status: 409 },
      );
    }

    console.log(error);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
