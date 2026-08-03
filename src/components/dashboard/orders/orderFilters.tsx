"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const filters = [
  { label: "Toutes", value: "" },
  { label: "En attente", value: "PENDING" },
  { label: "Confirmées", value: "CONFIRMED" },
  { label: "Préparation", value: "PREPARING" },
  { label: "Prêtes", value: "READY" },
  { label: "Livrées", value: "DELIVERED" },
  { label: "Annulées", value: "CANCELLED" },
];

export default function OrderFilters() {
  const searchParams = useSearchParams();

  const current = searchParams.get("status") ?? "";

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {filters.map((filter) => (
        <Link
          key={filter.value}
          href={
            filter.value
              ? `/dashboard/orders?status=${filter.value}`
              : "/dashboard/orders"
          }
          className={`rounded-full px-4 py-2 border transition ${
            current === filter.value
              ? "bg-orange-500 text-white border-orange-500"
              : "hover:bg-gray-100"
          }`}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}