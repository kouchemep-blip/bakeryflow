"use client";

import Link from "next/link";
import OrderStatus from "./orderStatus";
import { Eye } from "lucide-react";

type OrderRowProps = {
  order: {
    id: number;
    totalPrice: number;
    status:
      | "PENDING"
      | "CONFIRMED"
      | "PREPARING"
      | "READY"
      | "DELIVERED"
      | "CANCELLED";
    createdAt: Date;
    user: {
      firstName: string;
      lastName: string;
    };
    orderitem: {
      id: number;
    }[];
  };
};

export default function OrderRow({ order }: OrderRowProps) {
  return (
    <tr className="hover:bg-slate-50/80">
      <td className="px-6 py-5 font-semibold text-slate-900">
        #{order.id}
      </td>

      <td className="px-6 py-3">
        <div className="font-medium text-slate-900">
          {order.user.firstName} {order.user.lastName}
        </div>
      </td>

      <td className="px-6 py-5 text-center text-slate-700">
        <span className="inline-flex min-w-10 justify-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {order.orderitem.length}
        </span>
      </td>

      <td className="px-6 py-5 font-medium text-slate-900">
        {order.totalPrice.toLocaleString()} FCFA
      </td>

      <td className="px-6 py-5">
        <OrderStatus status={order.status} />
      </td>

      <td className="px-6 py-5 text-slate-600">
        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
      </td>

      <td className="px-6 py-5 text-center">
        <Link
          href={`/dashboard/orders/${order.id}`}
          aria-label={`Voir la commande ${order.id}`}
          title="Voir les détails"
          className="inline-flex px-2 py-2.5 bg-[#EA580C]/10 hover:bg-black/5 rounded-l-xl rounded-tr-xl duration-300 ease-in-out"
        >
          <Eye className="text-[#EA580C]" />
        </Link>
      </td>
    </tr>
  );
}