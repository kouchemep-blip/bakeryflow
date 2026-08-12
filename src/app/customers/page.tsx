import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { DashboardContent } from "@/components/customers/dashboardContent";

export default async function ClientDashboard() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");

  let userId: number;
  try {
    userId = (verifyToken(token) as { id: number }).id;
  } catch {
    redirect("/login");
  }

  const [
    user,
    totalOrders,
    deliveredOrders,
    pendingOrders,
    totalSpent,
    reviews,
    unreadMessages,
    recentOrders,
  ] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { firstName: true },
    }),
    prisma.order.count({ where: { userId } }),
    prisma.order.count({ where: { userId, status: "DELIVERED" } }),
    prisma.order.count({
      where: {
        userId,
        status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] },
      },
    }),
    prisma.order.aggregate({
      where: { userId, status: "DELIVERED" },
      _sum: { totalPrice: true },
    }),
    prisma.review.count({ where: { userId } }),
    prisma.message.count({
      where: {
        conversation: { userId },
        senderId: { not: userId },
        isRead: false,
      },
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, status: true, totalPrice: true, createdAt: true },
    }),
  ]);

  // On sérialise tout ce qui part vers le client : pas d'icônes, pas de Date brute.
  const stats = [
    {
      key: "orders" as const,
      label: "Commandes",
      value: totalOrders,
      detail: `${pendingOrders} en cours`,
    },
    {
      key: "delivered" as const,
      label: "Livrées",
      value: deliveredOrders,
      detail: "commandes finalisées",
    },
    {
      key: "spent" as const,
      label: "Dépenses",
      value: `${(totalSpent._sum.totalPrice ?? 0).toLocaleString()} FCFA`,
      detail: "sur les commandes livrées",
    },
    {
      key: "reviews" as const,
      label: "Avis publiés",
      value: reviews,
      detail: "retours partagés",
    },
  ];

  const orders = recentOrders.map((order) => ({
    id: order.id,
    status: order.status,
    totalPrice: order.totalPrice,
    date: order.createdAt.toLocaleDateString("fr-FR"),
  }));

  return (
    <DashboardContent
      firstName={user.firstName}
      stats={stats}
      orders={orders}
      unreadMessages={unreadMessages}
    />
  );
}