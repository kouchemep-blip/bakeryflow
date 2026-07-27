import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        image: body.image,
        categoryId: body.categoryId,
        status: body.status,
      },
    });

    if (
        !body.name ||
        !body.description ||
        !body.price ||
        !body.categoryId
    ) {
        return NextResponse.json (
            {
                message: "Données manquantes."
            },
            {
                status: 400,
            }
        )
    }

    return NextResponse.json(product, {
        status: 201,
    })
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Erreur lors de la création du produit.",
      },
      {
        status: 500,
      },
    );
  }
}
