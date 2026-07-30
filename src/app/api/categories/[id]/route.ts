import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{
  id: number;
}>;

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    await prisma.category.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Catégory spprimée",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error lors de la suppression",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Erreur lors de la modification.",
      },
      {
        status: 500,
      },
    );
  }
}