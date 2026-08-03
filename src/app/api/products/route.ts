import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/upload";

// ─── GET — liste des produits (landing page client) ───────────────────────────
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Filtre optionnel par catégorie : /api/product?categoryId=2
    const categoryId = searchParams.get("categoryId");

    const products = await prisma.product.findMany({
      where: {
        // Affiche uniquement les produits disponibles côté client
        status: "AVAILABLE",
        // Filtre catégorie si fourni
        ...(categoryId ? { categoryId: Number(categoryId) } : {}),
      },
      include: {
        category: true,
        // Moyenne des avis pour affichage note sur la carte produit
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des produits." },
      { status: 500 }
    );
  }
}

// ─── POST — création produit (dashboard admin) — inchangé ─────────────────────
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const categoryId = Number(formData.get("categoryId"));
    const status = formData.get("status") as
      | "AVAILABLE"
      | "UNAVAILABLE";

    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json(
        {
          message: "Veuillez sélectionner une image.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await image.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const uploaded = await uploadImage(buffer);

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        status,
        image: uploaded.secure_url,
        imagePublicId : uploaded.public_id
      },
    });

    return NextResponse.json(product, {
      status: 201,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Erreur lors de la création du produit.",
      },
      {
        status: 500,
      }
    );
  }
}