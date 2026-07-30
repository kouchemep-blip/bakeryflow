import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = Promise<{
  id: string;
}>;

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      messge: "Produit supprimé.",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Erreur lors de la suppression",
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

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        categoryId: body.categoryId,
        status: body.status,
      },
    });

    return NextResponse.json(product);
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