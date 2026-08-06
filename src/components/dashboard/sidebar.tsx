// components/dashboard/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Croissant,
  ClipboardList,
  MessageSquare,
  Users,
  Star,
  Settings,
  Wheat,
  Home,
} from "lucide-react";

const NAV_LINKS = [
  { name: "Accueil du site", href: "/", icon: Home },
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutGrid },
  { name: "Produits", href: "/dashboard/products", icon: Croissant },
  { name: "Commandes", href: "/dashboard/orders", icon: ClipboardList },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Clients", href: "/dashboard/customers", icon: Users },
  { name: "Avis", href: "/dashboard/reviews", icon: Star },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[72px] w-full items-center border-t border-white/[0.08] bg-[#161310]/95 px-2 backdrop-blur md:sticky md:top-0 md:h-screen md:min-h-screen md:w-64 md:flex-col md:items-stretch md:border-r md:border-t-0 md:p-5">
      <div className="mb-8 hidden items-center gap-2 px-2 md:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C2703D]">
          <Wheat className="h-5 w-5 text-[#161310]" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-[#F5F1EA]">
          BakeryFlow
        </span>
      </div>

      <ul className="flex w-full flex-1 items-center justify-around gap-1 md:flex-col md:items-stretch md:justify-start">
        {NAV_LINKS.map((item) => {
          const active =
            item.href === "/" || item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={item.name}
                title={item.name}
                className={`group flex h-12 flex-1 items-center justify-center rounded-lg px-2 text-[13.5px] font-medium transition-all duration-200 md:h-auto md:w-full md:justify-start md:gap-3 md:px-3 md:py-2.5 ${
                  active
                    ? "bg-[#C2703D]/15 text-[#F5F1EA]"
                    : "text-[#A8A29B] hover:bg-white/[0.06] hover:text-[#F5F1EA]"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                    active ? "text-[#C2703D]" : "text-[#807A72] group-hover:text-[#C2703D]"
                  }`}
                  strokeWidth={2}
                />
                <span className="sr-only md:not-sr-only">{item.name}</span>
                {active && (
                  <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-[#C2703D] md:block" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 md:block">
        <p className="text-[13px] font-medium text-[#F5F1EA]">Passer en Premium</p>
        <p className="mt-1 text-[12px] leading-snug text-[#807A72]">
          Débloque analytics avancés et rapports détaillés.
        </p>
        <Link href="/dashboard/premium" className="mt-3 block w-full rounded-lg bg-[#C2703D] py-2 text-center text-[13px] font-medium text-[#161310] transition-colors hover:bg-[#D07F49]">
          Découvrir
        </Link>
      </div>
    </nav>
  );
}
