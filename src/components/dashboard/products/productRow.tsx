"use client";

import Link from "next/link";
import DeleteProductButton from "./deleteProductsButton";
import ProductStatus from "./productStatus";
import { ProductWithCategory } from "@/types/products";
import { FaEye, FaPen } from "react-icons/fa";
import Image from "next/image";

type ProductRowProps = {
  products: ProductWithCategory;
};

export default function ProductRow({ products }: ProductRowProps) {
  return (
    <tr className="hover:bg-slate-50/80">
      <td className="px-5 py-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {products.image && (
            <Image
              src={products.image}
              alt={products.name}
              fill
              className="object-cover"
            />
          )}
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="font-medium text-slate-900">{products.name}</div>
      </td>

      <td className="px-5 py-4 text-slate-600">{products.category.name}</td>

      <td className="px-5 py-4 font-medium text-slate-900">
        {products.price} FCFA
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <span className="font-medium">
            {products.averageRating ? products.averageRating.toFixed(1) : "0.0"}
          </span>
          <span className="text-amber-400">★</span>
          <span className="text-slate-400">({products.reviewsCount ?? 0})</span>
        </div>
      </td>

      <td className="px-5 py-4">
        <ProductStatus status={products.status} />
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/products/${products.id}`}
            aria-label={`Voir ${products.name}`}
            title="Voir le produit"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
          >
            <FaEye className="h-4 w-4" />
          </Link>

          <Link
            href={`/dashboard/products/${products.id}/edit`}
            aria-label={`Modifier ${products.name}`}
            title="Modifier le produit"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
          >
            <FaPen className="h-4 w-4" />
          </Link>

          <DeleteProductButton productId={products.id} />
        </div>
      </td>
    </tr>
  );
}
