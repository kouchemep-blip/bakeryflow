import type { OrderWithUserAndItems } from "@/types/order";

type Props = { order: OrderWithUserAndItems };

export default function OrderSummary({ order }: Props) {
  return (
    <section className="rounded-3xl flex justify-between border border-slate-200 bg-white p-6 shadow-sm">
        <span className="text-xl font-semibold text-slate-700">Total</span>
        <span className="text-2xl font-bold text-orange-500">
          {order.totalPrice.toLocaleString()} FCFA
        </span>
    </section>
  );
}
