import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/schemas/categorySchema";
import { Prisma } from "@prisma/client";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;
  try {
    const body = categorySchema.parse(await request.json());

    const category = await prisma.category.create({
      data: {
        name: body.name,
      },
    });
    return NextResponse.json(category, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "Une catégorie avec ce nom existe déjà." },
        { status: 409 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Données de catégorie invalides." }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: "Erreur lors de la création",
      },
      {
        status: 500,
      },
    );
  }
}
