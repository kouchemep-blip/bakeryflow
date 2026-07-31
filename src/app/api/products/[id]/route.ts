import { prisma } from "@/lib/prisma";
import { deleteImage, uploadImage } from "@/lib/upload";
import { NextResponse } from "next/server";

type Params = Promise<{
  id: string;
}>;

export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Produit introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    if (product.imagePublicId) {
      await deleteImage(product.imagePublicId);
    }

    await prisma.product.delete({
      where: {
        id: product.id,
      },
    });

    return NextResponse.json({
      message: "Produit supprimé.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Erreur lors de la suppression.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const categoryId = Number(formData.get("categoryId"));
    const status = formData.get("status") as
      | "AVAILABLE"
      | "UNAVAILABLE";

    const image = formData.get("image") as File | null;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Produit introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    let imageUrl = product.image;
    let imagePublicId = product.imagePublicId;

    if (image && image.size > 0) {
      if (product.imagePublicId) {
        await deleteImage(product.imagePublicId);
      }

      const bytes = await image.arrayBuffer();

      const buffer = Buffer.from(bytes);

      const uploaded = await uploadImage(buffer);

      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        name,
        description,
        price,
        categoryId,
        status,
        image: imageUrl,
        imagePublicId,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Erreur lors de la modification.",
      },
      {
        status: 500,
      }
    );
  }
}