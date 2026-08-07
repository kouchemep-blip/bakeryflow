import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import OrderCustomerCard from "@/components/dashboard/orders/orderCustomerCard";
import OrderItemsTable from "@/components/dashboard/orders/orderItemsTable";
import OrderSummary from "@/components/dashboard/orders/orderSummary";
import OrderStatusSelect from "@/components/dashboard/orders/orderStatusSelect";
import OrderTimeline from "@/components/dashboard/orders/orderTimeline";

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
      orderitem: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 mt-[26vh] lg:mt-[12vh]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Détail de commande
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              Commande #{order.id}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Consulte les informations client, les articles, le statut et
              l’évolution de la commande.
            </p>
          </div>

          <Link
            href={`/dashboard/orders/${order.id}/chat`}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Discussion
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <OrderCustomerCard order={order} />
          <OrderItemsTable items={order.orderitem} />
        </div>

        <div className="space-y-6">
          <OrderSummary order={order} />
          <OrderStatusSelect order={order} />
          <OrderTimeline status={order.status} />
        </div>
      </div>
    </div>
  );
}
