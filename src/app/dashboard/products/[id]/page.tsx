import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import ProductStatus from "@/components/dashboard/products/productStatus";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isSafeInteger(productId) || productId < 1) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { name: true } },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6 mt-[26vh] lg:mt-[12vh]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#807A72] transition-colors hover:text-[#EA580C]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux produits
        </Link>
        <Link
          href={`/dashboard/products/${product.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg bg-[#EA580C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#D07F49]"
        >
          <Pencil className="h-4 w-4" />
          Modifier
        </Link>
      </div>

      <article className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
        <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative aspect-square bg-[#F5F1EA]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-sm font-medium text-[#EA580C]">
              {product.category.name}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#161310]">
              {product.name}
            </h1>
            <p className="mt-4 whitespace-pre-line leading-7 text-[#625C55]">
              {product.description}
            </p>
            <p className="mt-6 text-2xl font-semibold text-[#161310]">
              {product.price.toLocaleString("fr-FR")} FCFA
            </p>
            <div className="mt-5">
              <ProductStatus status={product.status} />
            </div>
          </div>
        </div>
        <footer className="flex flex-wrap gap-x-6 gap-y-1 border-t border-black/[0.06] bg-[#FBFAF8] px-6 py-4 text-xs text-[#807A72] sm:px-8">
          <span>Créé le {product.createdAt.toLocaleDateString("fr-FR")}</span>
          <span>
            Mis à jour le {product.updatedAt.toLocaleDateString("fr-FR")}
          </span>
        </footer>
      </article>
    </section>
  );
}
