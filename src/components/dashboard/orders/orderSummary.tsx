import type { OrderWithUserAndItems } from "@/types/order";
type Props = { order: OrderWithUserAndItems };

export default function OrderSummary({
  order,
}: Props) {
  return (
    <div className="rounded-xl border p-6">

      <div className="flex justify-between">

        <h2 className="text-xl font-semibold">
          Total
        </h2>

        <span className="text-3xl font-bold text-orange-500">

          {order.totalPrice.toLocaleString()} FCFA

        </span>

      </div>

    </div>
  );
}
