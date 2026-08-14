// "use client";

// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { Package, ArrowRight, ShoppingBag } from "lucide-react";

// type OrderItem = { id: number; name: string; quantity: number };
// type Order = {
//   id: number;
//   status: string;
//   totalPrice: number;
//   date: string;
//   items: OrderItem[];
// };
// type Filter = { key: string; label: string };

// const STATUS_STYLES: Record<string, { label: string; className: string }> = {
//   PENDING: { label: "En attente", className: "bg-slate-100 text-slate-600" },
//   CONFIRMED: { label: "Confirmée", className: "bg-blue-50 text-blue-600" },
//   PREPARING: { label: "En préparation", className: "bg-orange-50 text-orange-600" },
//   READY: { label: "Prête", className: "bg-amber-50 text-amber-600" },
//   DELIVERED: { label: "Livrée", className: "bg-emerald-50 text-emerald-600" },
//   CANCELLED: { label: "Annulée", className: "bg-red-50 text-red-500" },
// };

// const containerVariants = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.07 } },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 16 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
// };

// export function OrdersContent({
//   orders,
//   filters,
//   activeFilterKey,
// }: {
//   orders: Order[];
//   filters: Filter[];
//   activeFilterKey: string;
// }) {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-slate-900">Mes commandes</h1>
//         <p className="mt-1 text-sm text-slate-500">
//           {orders.length} commande{orders.length > 1 ? "s" : ""}
//         </p>
//       </div>

//       {/* Onglets de filtre */}
//       <div className="flex w-fit gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
//         {filters.map((filter) => {
//           const isActive = filter.key === activeFilterKey;
//           const href =
//             filter.key === "all" ? "/customers/orders" : `/customers/orders?status=${filter.key}`;

//           return (
//             <Link key={filter.key} href={href} className="relative">
//               {isActive && (
//                 <motion.div
//                   layoutId="orders-filter-pill"
//                   className="absolute inset-0 rounded-full bg-orange-600"
//                   transition={{ type: "spring", stiffness: 400, damping: 32 }}
//                 />
//               )}
//               <span
//                 className={`relative z-10 block whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
//                   isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
//                 }`}
//               >
//                 {filter.label}
//               </span>
//             </Link>
//           );
//         })}
//       </div>

//       <AnimatePresence mode="wait">
//         {orders.length === 0 ? (
//           <motion.div
//             key="empty"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.25 }}
//             className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"
//           >
//             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
//               <ShoppingBag className="h-6 w-6 text-orange-500" />
//             </div>
//             <p className="text-slate-600">
//               {activeFilterKey === "all"
//                 ? "Vous n'avez encore passé aucune commande."
//                 : "Aucune commande dans cette catégorie."}
//             </p>
//           </motion.div>
//         ) : (
//           <motion.div
//             key={activeFilterKey}
//             variants={containerVariants}
//             initial="hidden"
//             animate="show"
//             className="space-y-4"
//           >
//             {orders.map((order) => {
//               const status = STATUS_STYLES[order.status] ?? {
//                 label: order.status,
//                 className: "bg-slate-100 text-slate-600",
//               };
//               const visibleItems = order.items.slice(0, 3);
//               const extraCount = order.items.length - visibleItems.length;

//               return (
//                 <motion.div
//                   key={order.id}
//                   variants={itemVariants}
//                   whileHover={{ y: -3 }}
//                   transition={{ type: "spring", stiffness: 300, damping: 24 }}
//                   className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-slate-300"
//                 >
//                   <div className="flex flex-wrap items-start justify-between gap-3">
//                     <div>
//                       <h2 className="font-semibold text-slate-900">
//                         Commande #{order.id}
//                       </h2>
//                       <p className="text-sm text-slate-500">{order.date}</p>
//                     </div>
//                     <span
//                       className={`rounded-full px-3 py-1 text-sm font-medium ${status.className}`}
//                     >
//                       {status.label}
//                     </span>
//                   </div>

//                   {order.items.length > 0 && (
//                     <ul className="mt-4 flex flex-col gap-2">
//                       {visibleItems.map((item) => (
//                         <li
//                           key={item.id}
//                           className="flex items-center gap-2 text-sm text-slate-600"
//                         >
//                           <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50">
//                             <Package className="h-3.5 w-3.5 text-orange-500" />
//                           </span>
//                           <span>
//                             {item.quantity}× {item.name}
//                           </span>
//                         </li>
//                       ))}
//                       {extraCount > 0 && (
//                         <li className="pl-9 text-sm text-slate-400">
//                           + {extraCount} autre{extraCount > 1 ? "s" : ""} produit
//                           {extraCount > 1 ? "s" : ""}
//                         </li>
//                       )}
//                     </ul>
//                   )}

//                   <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
//                     <p className="font-semibold text-slate-900">
//                       {order.totalPrice.toLocaleString()} FCFA
//                     </p>
//                     <Link
//                       href={`/customers/orders/${order.id}`}
//                       className="group inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
//                     >
//                       Voir le détail
//                       <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                     </Link>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ArrowUpRight, ShoppingBag, Eye, Phone } from "lucide-react";

type OrderItem = { id: number; name: string; quantity: number; image: string | null };
type Order = {
  id: number;
  status: string;
  totalPrice: number;
  date: string;
  items: OrderItem[];
};
type Filter = { key: string; label: string };

const STATUS_META: Record<
  string,
  { label: string; percent: number; barColor: string; textColor: string }
> = {
  PENDING: { label: "En attente", percent: 15, barColor: "bg-slate-400", textColor: "text-slate-500" },
  CONFIRMED: { label: "Confirmée", percent: 35, barColor: "bg-blue-500", textColor: "text-blue-600" },
  PREPARING: { label: "En préparation", percent: 60, barColor: "bg-orange-500", textColor: "text-orange-600" },
  READY: { label: "Prête", percent: 85, barColor: "bg-amber-500", textColor: "text-amber-600" },
  DELIVERED: { label: "Livrée", percent: 100, barColor: "bg-emerald-500", textColor: "text-emerald-600" },
  CANCELLED: { label: "Annulée", percent: 100, barColor: "bg-red-400", textColor: "text-red-500" },
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
            className="flex flex-col items-center gap-3 rounded-[28px] border border-dashed border-slate-300 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-12 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
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
              const status = STATUS_META[order.status] ?? {
                label: order.status,
                percent: 0,
                barColor: "bg-slate-300",
                textColor: "text-slate-500",
              };
              const firstItem = order.items[0];
              const itemsLabel =
                order.items.length > 1
                  ? `${order.items.length} produits`
                  : firstItem?.name ?? "Produit";

              return (
                <motion.div
                  key={order.id}
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="relative overflow-hidden rounded-[28px] border border-slate-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-orange-100 ring-4 ring-white shadow-sm">
                        {firstItem?.image ? (
                          <Image
                            src={firstItem.image}
                            alt={firstItem.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Package className="h-5 w-5 text-orange-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate font-semibold text-slate-900">
                          Commande #{order.id}
                        </h2>
                        <p className="truncate text-sm text-slate-500">
                          {itemsLabel} · {order.date}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/customers/orders/${order.id}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-orange-600"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className={status.textColor}>{status.label}</span>
                      <span className="text-slate-400">
                        {order.totalPrice.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white">
                      <motion.div
                        className={`h-full rounded-full ${status.barColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${status.percent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Link
                      href={`/customers/orders/${order.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-orange-600"
                      aria-label="Voir le détail"
                      title="Voir le détail"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <a
                      href="tel:"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-orange-600"
                      aria-label="Contacter le support"
                      title="Contacter le support"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
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