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
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col items-stretch border-r border-white/[0.08] bg-[#161310]/95 p-5 backdrop-blur md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EA580C]">
            <Wheat className="h-5 w-5 text-[#161310]" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#F5F1EA]">
            BakeryFlow
          </span>
        </div>

        <nav className="flex flex-1 flex-col items-stretch justify-start gap-1">
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
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200 ${
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
                <span className="flex-1">{link.label}</span>
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
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

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-[72px] items-center justify-around border-t border-white/[0.08] bg-[#161310]/95 px-2 backdrop-blur md:hidden">
        {links.slice(1, 6).map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/customers"
              ? pathname === link.href
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              title={link.label}
              className={`flex flex-1 flex-col items-center justify-center gap-1 px-2 py-2 text-[11px] font-medium transition-all duration-200 ${
                active ? "text-[#EA580C]" : "text-[#807A72]"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  active ? "text-[#EA580C]" : "text-[#807A72]"
                }`}
                strokeWidth={2}
              />
              <span className="hidden sm:block">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}