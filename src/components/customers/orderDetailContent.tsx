"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Truck,
  XCircle,
  Package,
  LifeBuoy,
} from "lucide-react";

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string | null;
};

type Order = {
  id: number;
  status: string;
  totalPrice: number;
  date: string;
  items: OrderItem[];
};

const STEPS = [
  { key: "PENDING", label: "Reçue", icon: Clock },
  { key: "CONFIRMED", label: "Confirmée", icon: CheckCircle2 },
  { key: "PREPARING", label: "En préparation", icon: ChefHat },
  { key: "READY", label: "Prête", icon: PackageCheck },
  { key: "DELIVERED", label: "Livrée", icon: Truck },
] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function OrderDetailContent({ order }: { order: Order }) {
  const isCancelled = order.status === "CANCELLED";
  const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);
  const progressPercent = isCancelled
    ? 0
    : (currentStepIndex / (STEPS.length - 1)) * 100;

  return (
    <div className="pb-28 lg:pb-8">
      {/* En-tête */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/customers/orders"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Commande #{order.id}
          </h1>
          <p className="text-sm text-slate-500">{order.date}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="space-y-6 lg:col-span-2">
          {/* Suivi de commande */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {isCancelled ? (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-600">
                <XCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">
                  Cette commande a été annulée.
                </p>
              </div>
            ) : (
              <>
                <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Suivi de commande
                </h2>
                <div className="relative flex items-start justify-between">
                  <div className="absolute left-0 right-0 top-5 h-0.5 bg-slate-100" />
                  <motion.div
                    className="absolute left-0 top-5 h-0.5 bg-gradient-to-r from-orange-400 to-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  {STEPS.map((step, index) => {
                    const isDone = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.key}
                        className="relative z-10 flex w-1/5 flex-col items-center gap-2 text-center"
                      >
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isCurrent ? 1.12 : 1,
                            backgroundColor: isDone ? "#ea580c" : "#f1f5f9",
                          }}
                          transition={{ duration: 0.4 }}
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            isDone ? "text-white" : "text-slate-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </motion.div>
                        <span
                          className={`text-[11px] font-medium leading-tight sm:text-xs ${
                            isDone ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Produits */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Produits
            </h2>
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {order.items.map((item) => (
                <motion.li
                  key={item.id}
                  variants={itemVariants}
                  className="flex items-center gap-4"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-orange-50">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-6 w-6 text-orange-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.quantity} × {item.unitPrice.toLocaleString()} FCFA
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-slate-900">
                    {(item.unitPrice * item.quantity).toLocaleString()} FCFA
                  </p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* Résumé, sticky sur desktop */}
        <div className="lg:col-span-1">
          <div className="hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:block">
            <SummaryContent order={order} />
          </div>
        </div>
      </div>

      {/* Barre fixe mobile */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 p-4 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-lg font-bold text-slate-900">
              {order.totalPrice.toLocaleString()} FCFA
            </p>
          </div>
        <a  
            href="tel:"
            className="flex items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-95"
          >
            <LifeBuoy className="h-4 w-4" />
            Besoin d&apos;aide
          </a>
        </div>
      </div>
    </div>
  );
}

function SummaryContent({ order }: { order: Order }) {
  return (
    <div className="space-y-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Résumé
      </h2>
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-slate-500">Total</span>
        <span className="text-xl font-bold text-slate-900">
          {order.totalPrice.toLocaleString()} FCFA
        </span>
      </div>
      <a
        href="tel:"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
      >
        <LifeBuoy className="h-4 w-4" />
        Contacter le support
      </a>
    </div>
  );
}