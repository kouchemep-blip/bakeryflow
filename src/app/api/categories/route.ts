import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const category = await prisma.category.create({
      data: {
        name: body.name,
      },
    });
    return NextResponse.json(category, {
      status: 201,
    });
  } catch (error) {
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
