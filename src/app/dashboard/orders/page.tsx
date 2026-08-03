import OrderFilters from "@/components/dashboard/orders/orderFilters";
import OrderSearch from "@/components/dashboard/orders/orderSearch";
import OrderStatCard from "@/components/dashboard/orders/orderStatCard";
import OrderTable from "@/components/dashboard/orders/orderTable";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

type Props = {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
};

export default async function OrdersPage({ searchParams }: Props) {
  const { status, search } = await searchParams;
  const where: any = {};

  if (status) {
    where.status = status as OrderStatus;
  }

  if (search) {
    where.OR = [
      {
        user: {
          firstName: {
            contains: search,
          },
        },
      },
      {
        user: {
          lastName: {
            contains: search,
          },
        },
      },
      {
        user: {
          email: {
            contains: search,
          },
        },
      },
      {
        user: {
          phone: {
            contains: search,
          },
        },
      },
    ];

    if (!isNaN(Number(search))) {
      where.OR.push({
        id: Number(search),
      });
    }
  }
  const orders = await prisma.order.findMany({
    where,
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(orders);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "PREPARING",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  ).length;

  const revenue = orders
    .filter((order) => order.status === "DELIVERED")
    .reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        <OrderStatCard title="Total commandes" value={totalOrders} />

        <OrderStatCard title="En attente" value={pendingOrders} />

        <OrderStatCard title="Préparation" value={preparingOrders} />

        <OrderStatCard title="Livrées" value={deliveredOrders} />

        <OrderStatCard
          title="Chiffre d'affaires"
          value={`${revenue.toLocaleString()} FCFA`}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <OrderFilters />
        <OrderSearch />
      </div>
      <OrderTable orders={orders} />
    </div>
  );
}
