import { prisma } from "@/lib/prisma";
import { deleteImage, uploadImage } from "@/lib/upload";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/schemas/productSchema";

type Params = Promise<{
  id: string;
}>;

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;
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
        },
      );
    }

    if (product.imagePublicId) {
      console.log("Public ID :", product.imagePublicId);

      const result = await deleteImage(product.imagePublicId);

      console.log(result);
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
      },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;
  try {
    const { id } = await params;

    const formData = await request.formData();

    const parsed = productSchema.safeParse({ name: formData.get("name"), description: formData.get("description"), price: Number(formData.get("price")), categoryId: Number(formData.get("categoryId")), status: formData.get("status") });
    if (!parsed.success) return NextResponse.json({ message: "Données produit invalides." }, { status: 400 });
    const { name, description, price, categoryId, status } = parsed.data;

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
        },
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
      },
    );
  }
}
