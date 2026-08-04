import { prisma } from "@/lib/prisma";
import StatCard from "./statcard";

export default async function DashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [products, ordersToday, unreadMessages, reviews] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.message.count({ where: { isRead: false } }),
    prisma.review.count(),
  ]);
  const stats = [
    { title: "Produits", value: products, description: "Produits enregistrés" },
    { title: "Commandes", value: ordersToday, description: "Commandes aujourd'hui" },
    { title: "Messages", value: unreadMessages, description: "Messages non lus" },
    { title: "Avis", value: reviews, description: "Avis publiés" },
  ];

  return <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.title} {...stat} />)}</section>;
}
