// app/dashboard/page.tsx
import {
  Sparkles,
  Zap,
  PackagePlus,
  MessageCirclePlus,
  TicketPercent,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LiveClock } from "@/components/dashboard/live-clock";
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
  const quickActions = [
    {
      label: "Nouveau produit",
      href: "/dashboard/products/new",
      icon: "PackagePlus"
    },
    {
      label: "Nouvelle catégorie",
      href: "/dashboard/categories",
      icon: "TicketPercent",
    },
    {
      label: "Répondre aux messages",
      href: "/dashboard/messages",
      icon: "MessageCirclePlus",
    },
  ];

  return (
    <div className="space-y-6 bg-[#FBFAF8] p-4 dark:bg-[#161310] sm:p-6">
      {/* Carte de bienvenue */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161310] via-[#221C16] to-[#161310] p-6 sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C2703D]/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#C2703D]">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Tableau de bord
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#F5F1EA] sm:text-3xl">
              Bonjour, Chef
            </h1>
            <div className="mt-2">
              <LiveClock />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-[#F5F1EA] backdrop-blur transition-colors hover:bg-white/[0.12]"
              >
                <span className="icon-wrapper">{action.icon}</span>
                <span className="hidden sm:inline">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques + activité récente */}
      <DashboardStats />

      {/* Graphiques */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesEvolutionChart data={salesData} />
        </div>
        <OrderStatusChart data={statusCounts} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <TopProductsChart data={topProducts} />
        <MonthlyRevenueChart data={monthlyRevenue} />
      </div>

      {/* Raccourcis rapides mobile */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:hidden">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-[#F5F1EA] backdrop-blur transition-colors hover:bg-white/[0.12]"
          >
            <span className="icon-wrapper">{action.icon}</span>
            <span className="hidden sm:inline">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
