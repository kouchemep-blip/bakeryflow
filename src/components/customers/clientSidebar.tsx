"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  MessageCircle,
  Star,
  User,
  Wheat,
} from "lucide-react";

const links = [
  {
    label: "Accueil du site",
    href: "/",
    icon: Home,
  },
  {
    label: "Accueil",
    href: "/customers",
    icon: Home,
  },
  {
    label: "Mes commandes",
    href: "/customers/orders",
    icon: ShoppingBag,
  },
  {
    label: "Discussion",
    href: "/customers/chat",
    icon: MessageCircle,
  },
  {
    label: "Mes avis",
    href: "/customers/reviews",
    icon: Star,
  },
  {
    label: "Mon profil",
    href: "/customers/profile",
    icon: User,
  },
];

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 flex h-[72px] w-full items-center border-t border-white/[0.08] bg-[#161310]/95 px-2 backdrop-blur md:sticky md:top-0 md:h-screen md:min-h-screen md:w-64 md:flex-col md:items-stretch md:border-r md:border-t-0 md:p-5">
      <div className="mb-8 hidden items-center gap-2 px-2 md:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EA580C]">
          <Wheat className="h-5 w-5 text-[#161310]" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-[#F5F1EA]">
          BakeryFlow
        </span>
      </div>

      <nav className="flex w-full flex-1 items-center justify-around gap-1 md:flex-col md:items-stretch md:justify-start">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/" || link.href === "/customers"
              ? pathname === link.href
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              title={link.label}
              className={`group flex h-12 flex-1 items-center justify-center rounded-lg px-2 text-[13.5px] font-medium transition-all duration-200 md:h-auto md:w-full md:justify-start md:gap-3 md:px-3 md:py-2.5 ${
                active
                  ? "bg-[#EA580C]/15 text-[#F5F1EA]"
                  : "text-[#A8A29B] hover:bg-white/[0.06] hover:text-[#F5F1EA]"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                  active
                    ? "text-[#EA580C]"
                    : "text-[#807A72] group-hover:text-[#EA580C]"
                }`}
                strokeWidth={2}
              />
              <span className="sr-only md:not-sr-only">{link.label}</span>
              {active && (
                <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-[#EA580C] md:block" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 md:block">
        <p className="text-[13px] font-medium text-[#F5F1EA]">
          Passer en Premium
        </p>
        <p className="mt-1 text-[12px] leading-snug text-[#807A72]">
          Débloque analytics avancés et rapports détaillés.
        </p>
        <Link
          href="/dashboard/premium"
          className="mt-3 block w-full rounded-lg bg-[#EA580C] py-2 text-center text-[13px] font-medium text-[#161310] transition-colors hover:bg-[#D07F49]"
        >
          Découvrir
        </Link>
      </div>
    </aside>
  );
}
