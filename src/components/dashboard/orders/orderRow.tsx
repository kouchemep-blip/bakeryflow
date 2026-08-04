import Link from "next/link";
import OrderStatus from "./orderStatus";

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

export default function OrderRow({
  order,
}: OrderRowProps) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4 font-semibold">
        #{order.id}
      </td>

      <td className="p-4">
        {order.user.firstName} {order.user.lastName}
      </td>

      <td className="p-4 text-center">
        {order.orderitem.length}
      </td>

      <td className="p-4">
        {order.totalPrice.toLocaleString()} FCFA
      </td>

      <td className="p-4">
        <OrderStatus status={order.status} />
      </td>

      <td className="p-4">
        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
      </td>

      <td className="p-4">
        <Link
          href={`/dashboard/orders/${order.id}`}
          className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          Voir
        </Link>
      </td>
    </tr>
  );
}
