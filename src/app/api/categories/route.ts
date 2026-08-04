import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/schemas/categorySchema";

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
  } catch {
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
