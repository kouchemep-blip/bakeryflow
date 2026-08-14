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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Product</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-semibold text-slate-900">
                {products.length}
              </h3>
              <p className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                +12 product
              </p>
            </div>
            <div className="h-10 w-16 rounded bg-slate-100" />
          </div>
          <p className="mt-3 text-sm text-slate-500">Compared to last week</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Product Revenue</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-semibold text-slate-900">$20,432</h3>
              <p className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                +5%
              </p>
            </div>
            <div className="h-10 w-16 rounded bg-slate-100" />
          </div>
          <p className="mt-3 text-sm text-slate-500">Compared to last week</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Product Sold</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-semibold text-slate-900">3,899</h3>
              <p className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                +2%
              </p>
            </div>
            <div className="h-10 w-16 rounded bg-slate-100" />
          </div>
          <p className="mt-3 text-sm text-slate-500">Compared to last week</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Products</h2>
            <p className="text-sm text-slate-500">
              Showing {products.length} products
            </p>
          </div>

          <Link href="/dashboard/categories">
            <DiscoverButton icon={FaPlus} label="Categories" />
          </Link>
          <Link href="/dashboard/products/new">
            <DiscoverButton icon={FaPlus} label="Produits" />
          </Link>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm text-slate-500">
                <th className="px-5 py-4 font-medium">Image</th>
                <th className="px-5 py-4 font-medium">Nom</th>
                <th className="px-5 py-4 font-medium">Catégorie</th>
                <th className="px-5 py-4 font-medium">Prix</th>
                <th className="px-5 py-4 font-medium">Avis</th>
                <th className="px-5 py-4 font-medium">Statut</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <ProductRow key={product.id} products={product} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}