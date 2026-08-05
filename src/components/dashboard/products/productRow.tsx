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
    <tr className="border-b">
      <td className="p-3">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
          {products.image && 
            (<Image
            src={products.image}
            alt={products.name}
            fill
            className="object-cover"
          />)
          } 
        </div>
      </td>

      <td className="p-3">{products.name}</td>

      <td className="p-3">{products.category.name}</td>

      <td className="p-3">{products.price} FCFA</td>

      <td className="p-3">
        <ProductStatus status={products.status} />
      </td>

      <td className="p-3">
        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard/products/${products.id}`}
            aria-label={`Voir ${products.name}`}
            title="Voir le produit"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#625C55] transition-colors hover:bg-[#C2703D]/15 hover:text-[#C2703D]"
          >
            <FaEye className="h-4 w-4" />
          </Link>
          <Link
            href={`/dashboard/products/${products.id}/edit`}
            aria-label={`Modifier ${products.name}`}
            title="Modifier le produit"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#625C55] transition-colors hover:bg-[#C2703D]/15 hover:text-[#C2703D]"
          >
            <FaPen className="h-4 w-4" />
          </Link>
        </div>
      </td>
      <DeleteProductButton productId={products.id} />
    </tr>
  );
}
