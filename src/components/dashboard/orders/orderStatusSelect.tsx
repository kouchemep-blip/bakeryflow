"use client";

import { allowedTransitions } from "@/lib/orderStatus";
import { useRouter } from "next/navigation";

type Props = {
  order: any;
};

export default function OrderStatusSelect({ order }: Props) {
  const router = useRouter();

  // ✅ Cette ligne doit être ici
  const options = [
    order.status,
    ...allowedTransitions[order.status],
  ];

  async function changeStatus(status: string) {
    console.log("Nouveau statut :", status);
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    console.log("Status HTTP :", response.status);
    const result = await response.json();
    console.log(result)

    if (!response.ok) {
      alert(result.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="rounded-xl border p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Statut
      </h2>

      <select
        defaultValue={order.status}
        disabled={
          allowedTransitions[order.status].length === 0
        }
        onChange={(e) => changeStatus(e.target.value)}
        className="rounded-lg border p-3"
      >
        {options.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}