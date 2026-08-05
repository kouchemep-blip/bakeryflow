"use client";
import { DiscoverButton } from "@/components/ui/DiscoverBtn";
import ProductRow from "./productRow";
import { ProductWithCategory } from "@/types/products";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

type ProductTableProps = {
  products: ProductWithCategory[];
};

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg ">
      <table className="min-w-[680px] w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Catégorie</th>
            <th className="p-3 text-left">Prix</th>
            <th className="p-3 text-left">Statut</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id} products={product} />
          ))}
        </tbody>
      </table>
      <Link href={"/dashboard/products/new/"}>
        <DiscoverButton icon={FaPlus} label="Ajouter"></DiscoverButton>
      </Link>
    </div>
  );
}
