"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Star,
  ChevronRight,
  CreditCard,
  ShoppingCart,
} from "lucide-react";

type StatKey = "orders" | "delivered" | "spent" | "reviews";

type Stat = {
  key: StatKey;
  label: string;
  value: number | string;
  detail: string;
};

type Order = {
  id: number;
  status: string;
  totalPrice: number;
  date: string;
};

const STAT_STYLES: Record<StatKey, { icon: typeof ShoppingBag; color: string; bg: string }> = {
  orders: { icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
  delivered: { icon: PackageCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  spent: { icon: CreditCard, color: "text-orange-600", bg: "bg-orange-50" },
  reviews: { icon: Star, color: "text-[#EA580C]", bg: "bg-amber-50" },
};

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "bg-slate-100 text-slate-600" },
  CONFIRMED: { label: "Confirmée", className: "bg-blue-50 text-blue-600" },
  PREPARING: { label: "En préparation", className: "bg-orange-50 text-orange-600" },
  READY: { label: "Prête", className: "bg-amber-50 text-amber-600" },
  DELIVERED: { label: "Livrée", className: "bg-emerald-50 text-emerald-600" },
  CANCELLED: { label: "Annulée", className: "bg-red-50 text-red-500" },
};

// Fait défiler un nombre entier de 0 à sa valeur finale à l'apparition.
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }
    const duration = 600;
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{display}</>;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function DashboardContent({
  firstName,
  stats,
  orders,
  unreadMessages,
}: {
  firstName: string;
  stats: Stat[];
  orders: Order[];
  unreadMessages: number;
}) {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          Espace client
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Bonjour {firstName}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Voici le bilan de votre activité sur BakeryFlow.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => {
          const { icon: Icon, color, bg } = STAT_STYLES[stat.key];
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {typeof stat.value === "number" ? (
                      <AnimatedNumber value={stat.value} />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">{stat.detail}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.section
          variants={itemVariants}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Activité
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                Commandes récentes
              </h2>
            </div>
            <Link
              href="/customers/orders"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition hover:gap-2.5 hover:text-orange-700"
            >
              Tout voir
              <ChevronRight className="h-4 w-4 transition-transform" />
            </Link>
          </div>

          {orders.length ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="mt-5 divide-y divide-slate-100"
            >
              {orders.map((order) => {
                const status = STATUS_STYLES[order.status] ?? {
                  label: order.status,
                  className: "bg-slate-100 text-slate-600",
                };
                return (
                  <motion.div key={order.id} variants={itemVariants}>
                    <Link
                      href={`/customers/orders/${order.id}`}
                      className="group flex items-center justify-between py-4 transition-colors hover:bg-orange-50/50"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          Commande #{order.id}
                        </p>
                        <p className="text-sm text-slate-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          {order.totalPrice.toLocaleString()} FCFA
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">Aucune commande pour le moment.</p>
          )}
        </motion.section>

        <motion.aside
          variants={itemVariants}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="rounded-3xl bg-gradient-to-b from-orange-500 to-orange-600 p-6 text-white shadow-lg"
        >
          <motion.div
            animate={unreadMessages ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 1.4, repeat: unreadMessages ? Infinity : 0, ease: "easeInOut" }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20"
          >
            <MessageCircle className="h-5 w-5" />
          </motion.div>
          <h2 className="mt-4 text-xl font-bold">Besoin d&apos;aide ?</h2>
          <p className="mt-2 text-sm text-orange-100">
            {unreadMessages
              ? `${unreadMessages} nouveau(x) message(s) vous attend(ent).`
              : "Notre équipe est disponible pour vous répondre."}
          </p>
          <div className="mt-5 space-y-3">
            <Link
              href="/customers/chat"
              className="inline-block rounded-xl bg-white px-4 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Ouvrir la discussion
            </Link>
            <Link
              href="/customers/reviews"
              className="block text-sm font-medium text-orange-100 underline transition hover:text-white"
            >
              Donner mon avis
            </Link>
          </div>
        </motion.aside>
      </div>
    </motion.section>
  );
}