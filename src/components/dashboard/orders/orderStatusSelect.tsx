"use client";

import { allowedTransitions } from "@/lib/orderStatus";
import { useRouter } from "next/navigation";
import type { OrderWithUserAndItems } from "@/types/order";
import { BadgeCheck, ChevronDown } from "lucide-react";

type Props = {
  order: OrderWithUserAndItems;
};

export default function OrderStatusSelect({ order }: Props) {
  const router = useRouter();

  const options = [order.status, ...allowedTransitions[order.status]];

  async function changeStatus(status: string) {
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message);
      return;
    }

    router.refresh();
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Statut
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            Gestion de la commande
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
          <BadgeCheck className="h-3.5 w-3.5" />
          {order.status}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <label
          htmlFor="status"
          className="mb-2 block text-sm font-medium text-slate-600"
        >
          Changer le statut
        </label>

        <div className="relative">
          <select
            id="status"
            defaultValue={order.status}
            disabled={allowedTransitions[order.status].length === 0}
            onChange={(e) => changeStatus(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {options.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        {allowedTransitions[order.status].length === 0 && (
          <p className="mt-2 text-xs text-slate-500">
            Cette commande ne peut plus changer de statut.
          </p>
        )}
      </div>
    </section>
  );
}