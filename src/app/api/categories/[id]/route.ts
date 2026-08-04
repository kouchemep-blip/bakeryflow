import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/schemas/categorySchema";

type Params = Promise<{
  id: string;
}>;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params },
) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;
  try {
    const { id } = await params;
    const body = categorySchema.parse(await request.json());

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
  request: NextRequest,
  { params }: { params: Params },
) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;
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
