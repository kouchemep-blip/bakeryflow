import Image from "next/image";
import type { OrderItemWithProduct } from "@/types/order";
import { Package } from "lucide-react";

type Props = {
  items: OrderItemWithProduct[];
};

export default function OrderItemsTable({ items }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Produits
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Articles commandés
            </h2>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[800px] w-full border-collapse">
          <thead className="bg-slate-50 text-left text-sm text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Produit</th>
              <th className="px-6 py-4 text-center font-medium">Qté</th>
              <th className="px-6 py-4 font-medium">Prix unitaire</th>
              <th className="px-6 py-4 font-medium">Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {item.product.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {item.product.category?.name ?? "Aucune catégorie"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="inline-flex min-w-10 justify-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {item.quantity}
                  </span>
                </td>

                <td className="px-6 py-4 font-medium text-slate-900">
                  {item.unitPrice.toLocaleString()} FCFA
                </td>

                <td className="px-6 py-4 font-semibold text-slate-900">
                  {(item.quantity * item.unitPrice).toLocaleString()} FCFA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}