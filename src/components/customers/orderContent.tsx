"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";

type OrderItem = { id: number; name: string; quantity: number };
type Order = {
  id: number;
  status: string;
  totalPrice: number;
  date: string;
  items: OrderItem[];
};
type Filter = { key: string; label: string };

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "bg-slate-100 text-slate-600" },
  CONFIRMED: { label: "Confirmée", className: "bg-blue-50 text-blue-600" },
  PREPARING: { label: "En préparation", className: "bg-orange-50 text-orange-600" },
  READY: { label: "Prête", className: "bg-amber-50 text-amber-600" },
  DELIVERED: { label: "Livrée", className: "bg-emerald-50 text-emerald-600" },
  CANCELLED: { label: "Annulée", className: "bg-red-50 text-red-500" },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
};

export function OrdersContent({
  orders,
  filters,
  activeFilterKey,
}: {
  orders: Order[];
  filters: Filter[];
  activeFilterKey: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mes commandes</h1>
        <p className="mt-1 text-sm text-slate-500">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Onglets de filtre */}
      <div className="flex w-fit gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
        {filters.map((filter) => {
          const isActive = filter.key === activeFilterKey;
          const href =
            filter.key === "all" ? "/customers/orders" : `/customers/orders?status=${filter.key}`;

          return (
            <Link key={filter.key} href={href} className="relative">
              {isActive && (
                <motion.div
                  layoutId="orders-filter-pill"
                  className="absolute inset-0 rounded-full bg-orange-600"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {filter.label}
              </span>
            </Link>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {orders.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
              <ShoppingBag className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-slate-600">
              {activeFilterKey === "all"
                ? "Vous n'avez encore passé aucune commande."
                : "Aucune commande dans cette catégorie."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeFilterKey}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {orders.map((order) => {
              const status = STATUS_STYLES[order.status] ?? {
                label: order.status,
                className: "bg-slate-100 text-slate-600",
              };
              const visibleItems = order.items.slice(0, 3);
              const extraCount = order.items.length - visibleItems.length;

              return (
                <motion.div
                  key={order.id}
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-slate-300"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Commande #{order.id}
                      </h2>
                      <p className="text-sm text-slate-500">{order.date}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {order.items.length > 0 && (
                    <ul className="mt-4 flex flex-col gap-2">
                      {visibleItems.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                            <Package className="h-3.5 w-3.5 text-orange-500" />
                          </span>
                          <span>
                            {item.quantity}× {item.name}
                          </span>
                        </li>
                      ))}
                      {extraCount > 0 && (
                        <li className="pl-9 text-sm text-slate-400">
                          + {extraCount} autre{extraCount > 1 ? "s" : ""} produit
                          {extraCount > 1 ? "s" : ""}
                        </li>
                      )}
                    </ul>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="font-semibold text-slate-900">
                      {order.totalPrice.toLocaleString()} FCFA
                    </p>
                    <Link
                      href={`/customers/orders/${order.id}`}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
                    >
                      Voir le détail
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}