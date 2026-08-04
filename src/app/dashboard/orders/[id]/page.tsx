import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import OrderCustomerCard from "@/components/dashboard/orders/orderCustomerCard";
import OrderItemsTable from "@/components/dashboard/orders/orderItemsTable";
import OrderSummary from "@/components/dashboard/orders/orderSummary";
import OrderStatusSelect from "@/components/dashboard/orders/orderStatusSelect";
import OrderTimeline from "@/components/dashboard/orders/orderTimeline";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Commande #{order.id}</h1>

      <OrderCustomerCard order={order} />

      <OrderItemsTable items={order.items} />

      <OrderSummary order={order} />

      <OrderStatusSelect order={order} />

      <OrderTimeline status={order.status} />

      <Link
        href={`/dashboard/orders/${order.id}/chat`}
        className="inline-flex rounded-lg bg-black px-4 py-2 text-white"
      >
        Discussion
      </Link>
    </div>
  );
}
