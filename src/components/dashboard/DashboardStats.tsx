// components/dashboard/DashboardStats.tsx
import Link from "next/link";
import {
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";

const inProgressStatuses = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
] as const;

export default async function DashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    customers,
    ordersToday,
    deliveredRevenue,
    inProgress,
    unreadMessages,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENT", isActive: true } }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.aggregate({
      where: { status: "DELIVERED" },
      _sum: { totalPrice: true },
    }),
    prisma.order.count({ where: { status: { in: [...inProgressStatuses] } } }),
    prisma.message.count({ where: { isRead: false } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { firstName: true, lastName: true } },
        orderitem: { select: { quantity: true } },
      },
    }),
  ]);
  const stats = [
    {
      label: "Clients actifs",
      value: customers.toLocaleString(),
      detail: "comptes clients actifs",
      icon: "users" as const,
      color: "#5B8DEF",
      bg: "#5B8DEF1A",
    },
    {
      label: "Commandes du jour",
      value: ordersToday.toLocaleString(),
      detail: `${inProgress} commande(s) en cours`,
      icon: "shoppingBag" as const,
      color: "#EA580C",
      bg: "#EA580C1A",
    },
    {
      label: "Chiffre d'affaires",
      value: `${(deliveredRevenue._sum.totalPrice ?? 0).toLocaleString()} FCFA`,
      detail: "commandes livrées",
      icon: "packageCheck" as const,
      color: "#4FA37B",
      bg: "#4FA37B1A",
    },
    {
      label: "Messages non lus",
      value: unreadMessages.toLocaleString(),
      detail: "à traiter par l'équipe",
      icon: "messageCircle" as const,
      color: "#8B6FD9",
      bg: "#8B6FD91A",
    },
  ];

  const STATUS_LABEL: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    PREPARING: "Préparation",
    READY: "Prête",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 xl:grid-cols-2">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} index={i} {...stat} />
        ))}
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-[#161310] dark:text-[#F5F1EA]">
              Activité récente
            </h2>
            <p className="text-xs text-[#807A72]">
              Les cinq dernières commandes reçues.
            </p>
          </div>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-sm font-medium text-[#EA580C] transition-colors hover:text-[#D07F49]"
          >
            Voir tout
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentOrders.length ? (
          <div className="mt-3 divide-y divide-black/[0.05] dark:divide-white/[0.05]">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between gap-4 rounded-lg px-2 py-3.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              >
                <div>
                  <p className="text-sm font-medium text-[#161310] dark:text-[#F5F1EA]">
                    Commande #{order.id} · {order.user.firstName}{" "}
                    {order.user.lastName}
                  </p>
                  <p className="text-xs text-[#807A72]">
                    {order.orderitem.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}{" "}
                    article(s) · {order.createdAt.toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#161310] dark:text-[#F5F1EA]">
                    {order.totalPrice.toLocaleString()} FCFA
                  </p>
                  <p className="text-xs font-medium text-[#EA580C]">
                    {STATUS_LABEL[order.status] ?? order.status}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-[#807A72]">
            Aucune commande enregistrée.
          </p>
        )}
      </div>
    </section>
  );
}
