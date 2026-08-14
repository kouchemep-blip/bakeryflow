import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { OrdersContent } from "@/components/customers/orderContent";
import { order_status } from "@prisma/client";

const STATUS_FILTERS: {
  key: string;
  label: string;
  statuses: order_status[] | null;
}[] = [
  { key: "all", label: "Toutes", statuses: null },
  {
    key: "preparing",
    label: "En préparation",
    statuses: ["PENDING", "CONFIRMED", "PREPARING", "READY"],
  },
  { key: "delivered", label: "Livrées", statuses: ["DELIVERED"] },
  { key: "cancelled", label: "Annulées", statuses: ["CANCELLED"] },
];

export default async function ClientOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return <p className="text-sm text-slate-500">Vous devez être connecté.</p>;
  }

  let userId: number;

  try {
    const payload = verifyToken(token.value) as { id: number };
    userId = payload.id;
  } catch {
    return <p className="text-sm text-slate-500">Session invalide.</p>;
  }

  const activeFilter =
    STATUS_FILTERS.find((f) => f.key === statusParam) ?? STATUS_FILTERS[0];

  const orders = await prisma.order.findMany({
    where: {
      userId,
      ...(activeFilter.statuses
        ? { status: { in: activeFilter.statuses } }
        : {}),
    },
    include: {
      orderitem: {
        include: {
          product: {
            select: { name: true, image: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // On sérialise pour le composant client : pas de Date brute, pas d'objets Prisma complets.
  const serializedOrders = orders.map((order) => ({
    id: order.id,
    status: order.status,
    totalPrice: order.totalPrice,
    date: order.createdAt.toLocaleDateString("fr-FR"),
    items: order.orderitem.map((item) => ({
      id: item.id,
      name: item.product?.name ?? "Produit",
      quantity: item.quantity ?? 1,
      image: item.product?.image ?? null,
    })),
  }));

  return (
    <OrdersContent
      orders={serializedOrders}
      filters={STATUS_FILTERS.map((f) => ({ key: f.key, label: f.label }))}
      activeFilterKey={activeFilter.key}
    />
  );
}
