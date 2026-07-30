import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const body = await request.json();

    if (!body.name || !body.description || !body.price || !body.categoryId) {
      return NextResponse.json(
        { message: "Données manquantes." },
        { status: 400 }
      );
    }

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

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erreur lors de la création du produit." },
      { status: 500 }
    );
  }
}