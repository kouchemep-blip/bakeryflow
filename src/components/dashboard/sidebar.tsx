const NAV_LINK = [
  {
    name : "Tableau de bord", href : "/dashboard"
  },
  {
    name : "Produits", href : "/dashboard/products"
  },
  {
    name : "Commandes", href : "/dashboard/orders"
  },
  {
    name : "Messages", href : "/dashboard/messages"
  },
  {
    name : "Clients", href : "/dashboard/customers"
  },
  {
    name : "Avis", href : "/dashboard/reviews"
  },
  {
    name : "Paramètres", href : "/dashboard/settings"
  },
];

import Link from "next/link";

export function DashboardNav() {
  return (
    <nav className="w-full bg-amber-400 p-3 md:min-h-screen md:w-60 md:p-5">
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm md:flex-col md:items-stretch md:gap-3">
          {NAV_LINK.map((item) => (
            <li key={item.href}>
              <Link className="block rounded-lg px-3 py-2 transition-colors hover:bg-white/50" href={item.href}>{item.name}</Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}
