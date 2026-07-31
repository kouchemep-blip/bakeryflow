import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = Promise<{
  id: string;
}>;

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
    console.error(error);

    return NextResponse.json(
      {
        message: "Erreur lors de la modification de la catégorie.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;

    const productsCount = await prisma.product.count({
      where: {
        categoryId: Number(id),
      },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        {
          message:
            "Impossible de supprimer cette catégorie car elle contient encore des produits.",
        },
        {
          status: 409,
        },
      );
    }

    await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Catégorie supprimée avec succès.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Erreur lors de la suppression de la catégorie.",
      },
      {
        status: 500,
      },
    );
  }
}