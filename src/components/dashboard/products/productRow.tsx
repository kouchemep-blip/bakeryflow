"use client";
import Link from "next/link";
import DeleteProductButton from "./deleteProductsButton";
import ProductStatus from "./productStatus";
import { ProductWithCategory } from "@/types/products";
import { DiscoverButton } from "@/components/ui/DiscoverBtn";
import { FaPen } from "react-icons/fa";

type ProductRowProps = {
  products: ProductWithCategory;
};

export default function ProductRow({ products }: ProductRowProps) {
  return (
    <tr className="border-b">
      <td className="p-3">{products.image}</td>

      <td className="p-3">{products.name}</td>

      <td className="p-3">{products.category.name}</td>

      <td className="p-3">{products.price} FCFA</td>

      <td className="p-3">
        <ProductStatus status={products.status} />
      </td>

      <td className="p-3">
        <Link href={`/dashboard/products/${products.id}/edit`}> <DiscoverButton icon={FaPen} label="Modifier"></DiscoverButton></Link>
      </td>
      <DeleteProductButton productId={products.id} />
    </tr>
  );
}
