import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/upload";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/schemas/productSchema";

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
        review: {
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
export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;
  try {
    const formData = await request.formData();

    const parsed = productSchema.safeParse({
      name: formData.get("name"), description: formData.get("description"), price: Number(formData.get("price")),
      categoryId: Number(formData.get("categoryId")), status: formData.get("status"),
    });
    if (!parsed.success) return NextResponse.json({ message: "Données produit invalides." }, { status: 400 });
    const { name, description, price, categoryId, status } = parsed.data;

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
