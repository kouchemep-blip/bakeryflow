import { prisma } from "@/lib/prisma";
import DashboardStats from "@/components/dashboard/DashboardStats";
import {
  SalesEvolutionChart,
  OrderStatusChart,
  TopProductsChart,
  MonthlyRevenueChart,
} from "@/components/dashboard/dashboard-charts";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED",
] as const;

async function getChartData() {
  const since14d = new Date();
  since14d.setDate(since14d.getDate() - 13);
  since14d.setHours(0, 0, 0, 0);

  const since6m = new Date();
  since6m.setMonth(since6m.getMonth() - 5);
  since6m.setDate(1);
  since6m.setHours(0, 0, 0, 0);

  const [ordersLast14d, statusCounts, topProductsRaw, deliveredLast6m] =
    await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: since14d } },
        select: { createdAt: true, totalPrice: true },
      }),
      Promise.all(
        ORDER_STATUSES.map((status) =>
          prisma.order
            .count({ where: { status } })
            .then((count) => ({ status, count })),
        ),
      ),
      prisma.orderitem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.order.findMany({
        where: { status: "DELIVERED", createdAt: { gte: since6m } },
        select: { createdAt: true, totalPrice: true },
      }),
    ]);

  // Ventes par jour (14 derniers jours)
  const salesMap = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(since14d);
    d.setDate(d.getDate() + i);
    salesMap.set(
      d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      0,
    );
  }
  ordersLast14d.forEach((o) => {
    const key = o.createdAt.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
    salesMap.set(key, (salesMap.get(key) ?? 0) + o.totalPrice);
  });
  const salesData = Array.from(salesMap, ([date, total]) => ({ date, total }));

  // Top produits
  const productIds = topProductsRaw.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const topProducts = topProductsRaw.map((p) => ({
    name: products.find((prod) => prod.id === p.productId)?.name ?? "Produit",
    sold: p._sum.quantity ?? 0,
  }));

  // Revenu mensuel (6 derniers mois)
  const revenueMap = new Map<string, number>();
  for (let i = 0; i < 6; i++) {
    const d = new Date(since6m);
    d.setMonth(d.getMonth() + i);
    revenueMap.set(d.toLocaleDateString("fr-FR", { month: "short" }), 0);
  }
  deliveredLast6m.forEach((o) => {
    const key = o.createdAt.toLocaleDateString("fr-FR", { month: "short" });
    revenueMap.set(key, (revenueMap.get(key) ?? 0) + o.totalPrice);
  });
  const monthlyRevenue = Array.from(revenueMap, ([month, revenue]) => ({
    month,
    revenue,
  }));

  return { salesData, statusCounts, topProducts, monthlyRevenue };
}

export default async function DashboardPage() {
  const { salesData, statusCounts, topProducts, monthlyRevenue } =
    await getChartData();
  return (
    <div className="space-y-6 bg-[#FBFAF8] p-4 dark:bg-[#161310] sm:p-6 mt-[26vh] lg:mt-[12vh]">
      {/* Graphiques */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesEvolutionChart data={salesData} />
        </div>
        <OrderStatusChart data={statusCounts} />
      </div>

      {/* Statistiques + activité récente */}
      <DashboardStats />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <TopProductsChart data={topProducts} />
        <MonthlyRevenueChart data={monthlyRevenue} />
      </div>
    </div>
  );
}
