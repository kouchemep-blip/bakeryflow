// "use client";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import OrderRow from "./orderRow";
// import type { OrderWithUserAndItems } from "@/types/order";
// import { Search, Filter } from "lucide-react";

// type OrderTableProps = {
//   orders: OrderWithUserAndItems[];
// };

// export default function OrderTable({ orders }: OrderTableProps) {
//   const router = useRouter();
//   const params = useSearchParams();

//   const [value, setValue] = useState(params.get("search") ?? "");

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const url = new URLSearchParams(params.toString());

//       if (value.trim()) {
//         url.set("search", value);
//       } else {
//         url.delete("search");
//       }

//       router.push(`/dashboard/orders?${url.toString()}`);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [value, params, router]);

//   return (
//     <div className="space-y-4 rounded-3xl border border-slate-200 bg-white shadow-sm">
//       <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-xl font-semibold text-slate-900">Commandes</h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Suivi des commandes, statuts et montants.
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="hidden items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-500 sm:flex">
//             <Search className="h-4 w-4" />
//             <input
//               value={value}
//               onChange={(e) => setValue(e.target.value)}
//               placeholder="Rechercher une commande..."
//               className="border-none focus:outline-none"
//             />
//           </div>

//           <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
//             <Filter className="h-4 w-4" />
//             Filtrer
//           </button>
//         </div>
//       </div>

//       <div className="w-full overflow-x-auto">
//         <table className="min-w-[1000px] w-full border-collapse">
//           <thead className="bg-slate-50">
//             <tr className="text-left text-sm text-slate-500">
//               <th className="px-6 py-4 font-medium">Commande</th>
//               <th className="px-6 py-4 font-medium">Client</th>
//               <th className="px-6 py-4 text-center font-medium">Articles</th>
//               <th className="px-6 py-4 font-medium">Montant</th>
//               <th className="px-6 py-4 font-medium">Statut</th>
//               <th className="px-6 py-4 font-medium">Date</th>
//               <th className="px-6 py-4 text-center font-medium">Action</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-slate-100">
//             {orders.map((order) => (
//               <OrderRow key={order.id} order={order} />
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderRow from "./orderRow";
import type { OrderWithUserAndItems } from "@/types/order";
import { Search, Filter } from "lucide-react";

type OrderTableProps = {
  orders: OrderWithUserAndItems[];
};

export default function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }

      router.replace(`/dashboard/orders?${params.toString()}`, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [value, router, searchParams]);

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Commandes</h2>
          <p className="mt-1 text-sm text-slate-500">
            Suivi des commandes, statuts et montants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-500 sm:flex">
            <Search className="h-4 w-4" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Rechercher une commande..."
              className="border-none bg-transparent outline-none"
            />
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <Filter className="h-4 w-4" />
            Filtrer
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#C3B9B1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:backdrop-blur-[150px]">
        <table className="min-w-[1000px] w-full border-collapse">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-500">
              <th className="px-6 py-4 font-medium">Commande</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 text-center font-medium">Articles</th>
              <th className="px-6 py-4 font-medium">Montant</th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 text-center font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}