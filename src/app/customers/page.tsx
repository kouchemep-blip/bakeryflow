import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Star,
  ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

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

  const stats = [
    {
      label: "Commandes",
      value: totalOrders,
      detail: `${pendingOrders} en cours`,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Livrées",
      value: deliveredOrders,
      detail: "commandes finalisées",
      icon: PackageCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Dépenses",
      value: `${(totalSpent._sum.totalPrice ?? 0).toLocaleString()} FCFA`,
      detail: "sur les commandes livrées",
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Avis publiés",
      value: reviews,
      detail: "retours partagés",
      icon: Star,
      color: "text-[#EA580C]",
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
           {" "}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
               {" "}
        <div>
                   {" "}
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                        Espace client          {" "}
          </p>
                   {" "}
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                        Bonjour {user.firstName}         {" "}
          </h1>
                   {" "}
          <p className="mt-2 text-sm text-slate-500">
                      Voici le bilan de votre activité sur BakeryFlow.        
             {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
               {" "}
        {stats.map(({ icon: Icon, ...stat }) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
          >
                       {" "}
            <div className="flex items-center justify-between">
                           {" "}
              <div>
                               {" "}
                <p className="text-sm font-medium text-slate-500">
                                    {stat.label}               {" "}
                </p>
                               {" "}
                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {stat.value}               {" "}
                </p>
                             {" "}
              </div>
                           {" "}
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bg}`}
              >
                                <Icon className={`h-5 w-5 ${stat.color}`} />   
                         {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <p className="mt-3 text-xs text-slate-400">{stat.detail}</p>       
             {" "}
          </div>
        ))}
             {" "}
      </div>
           {" "}
      <div className="grid gap-6 xl:grid-cols-3">
               {" "}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                   {" "}
          <div className="flex items-center justify-between">
                       {" "}
            <div>
                           {" "}
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                                Activité              {" "}
              </p>
                           {" "}
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                                Commandes récentes              {" "}
              </h2>
                         {" "}
            </div>
                       {" "}
            <Link
              href="/customers/orders"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
            >
                            Tout voir              {" "}
              <ChevronRight className="h-4 w-4" />           {" "}
            </Link>
                     {" "}
          </div>
                   {" "}
          {recentOrders.length ? (
            <div className="mt-5 divide-y divide-slate-100">
                           {" "}
              {recentOrders.map((order) => (
                <Link
                  href={`/customers/orders/${order.id}`}
                  key={order.id}
                  className="group flex items-center justify-between py-4 transition hover:bg-orange-50/50"
                >
                                   {" "}
                  <div>
                                       {" "}
                    <p className="font-semibold text-slate-900">
                                            Commande #{order.id}               
                         {" "}
                    </p>
                                       {" "}
                    <p className="text-sm text-slate-500">
                                           {" "}
                      {order.createdAt.toLocaleDateString("fr-FR")}             
                           {" "}
                    </p>
                                     {" "}
                  </div>
                                   {" "}
                  <div className="text-right">
                                       {" "}
                    <p className="font-semibold text-slate-900">
                                            {order.totalPrice.toLocaleString()}{" "}
                      FCFA                    {" "}
                    </p>
                                       {" "}
                    <p className="text-xs font-medium text-orange-600">
                                            {order.status}                 
                       {" "}
                    </p>
                                     {" "}
                  </div>
                                 {" "}
                </Link>
              ))}
                         {" "}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
                            Aucune commande pour le moment.            {" "}
            </p>
          )}
                 {" "}
        </section>
               {" "}
        <aside className="rounded-3xl bg-gradient-to-b from-orange-500 to-orange-600 p-6 text-white shadow-lg">
                   {" "}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
                        <MessageCircle className="h-5 w-5" />         {" "}
          </div>
                   {" "}
          <h2 className="mt-4 text-xl font-bold">Besoin d&apos;aide ?</h2>     
             {" "}
          <p className="mt-2 text-sm text-orange-100">
                       {" "}
            {unreadMessages
              ? `${unreadMessages} nouveau(x) message(s) vous attend(ent).`
              : "Notre équipe est disponible pour vous répondre."}
                     {" "}
          </p>
                   {" "}
          <div className="mt-5 space-y-3">
                       {" "}
            <Link
              href="/customers/chat"
              className="inline-block rounded-xl bg-white px-4 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
            >
                            Ouvrir la discussion            {" "}
            </Link>
                       {" "}
            <Link
              href="/customers/reviews"
              className="block text-sm font-medium text-orange-100 underline transition hover:text-white"
            >
              Donner mon avis{" "}
            </Link>
          </div>
        </aside>
             {" "}
      </div>
         {" "}
    </section>
  );
}
