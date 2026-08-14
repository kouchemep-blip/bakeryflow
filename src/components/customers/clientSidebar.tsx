"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ShoppingBag,
  MessageCircle,
  Star,
  User,
  Wheat,
  ArrowLeft,
  Search,
  ChevronDown,
} from "lucide-react";

// Nombre de messages non lus — à remplacer par la vraie donnée (context, hook, props…)
const UNREAD_MESSAGES = 2;

type SimpleLink = {
  type: "link";
  label: string;
  href: string;
  icon: typeof Home;
  badge?: number;
};

type GroupLink = {
  type: "group";
  label: string;
  href: string; // route "parente", utilisée pour l'état actif de base
  icon: typeof Home;
  children: { label: string; href: string; dot?: string }[];
};

const NAV: (SimpleLink | GroupLink)[] = [
  { type: "link", label: "Accueil", href: "/customers", icon: Home },
  {
    type: "group",
    label: "Mes commandes",
    href: "/customers/orders",
    icon: ShoppingBag,
    children: [
      { label: "Toutes", href: "/customers/orders" },
      {
        label: "En préparation",
        href: "/customers/orders?status=preparing",
        dot: "#EA580C",
      },
      {
        label: "Livrées",
        href: "/customers/orders?status=delivered",
        dot: "#22C55E",
      },
      {
        label: "Annulées",
        href: "/customers/orders?status=cancelled",
        dot: "#807A72",
      },
    ],
  },
  {
    type: "link",
    label: "Discussion",
    href: "/customers/chat",
    icon: MessageCircle,
    badge: UNREAD_MESSAGES,
  },
  { type: "link", label: "Mes avis", href: "/customers/reviews", icon: Star },
];

const ACCOUNT_LINKS: SimpleLink[] = [
  { type: "link", label: "Mon profil", href: "/customers/profile", icon: User },
];

const MOBILE_LINKS: SimpleLink[] = [
  { type: "link", label: "Accueil", href: "/customers", icon: Home },
  {
    type: "link",
    label: "Commandes",
    href: "/customers/orders",
    icon: ShoppingBag,
  },
  {
    type: "link",
    label: "Discussion",
    href: "/customers/chat",
    icon: MessageCircle,
    badge: UNREAD_MESSAGES,
  },
  { type: "link", label: "Avis", href: "/customers/reviews", icon: Star },
  { type: "link", label: "Profil", href: "/customers/profile", icon: User },
];

function isActive(pathname: string, href: string) {
  const base = href.split("?")[0];
  if (base === "/customers") return pathname === base;
  return pathname === base || pathname.startsWith(base + "/");
}

export default function ClientSidebar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [openGroup, setOpenGroup] = useState<string | null>(
    NAV.find((item) => item.type === "group" && pathname.startsWith(item.href))
      ?.href ?? null,
  );

  const filteredNav = useMemo(() => {
    if (!query.trim()) return NAV;
    const q = query.trim().toLowerCase();
    return NAV.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      {/* ── Sidebar desktop ── */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col items-stretch border-r border-b border-black/8 bg-[#F5EFE6]/90 backdrop-blur-md p-5 md:flex">
        {/* Logo + retour au site */}
        <div className="mb-5 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EA580C]">
            <Wheat className="h-5 w-5 text-[#161310]" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-black">
            BakeryFlow
          </span>
        </div>

        <Link
          href="/"
          className="mb-5 flex items-center gap-1.5 px-2 text-[12px] font-medium text-black transition-colors hover:text-black"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          Retour au site
        </Link>

        {/* Recherche */}
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 transition-colors focus-within:border-[#EA580C]/50">
          <Search className="h-4 w-4 shrink-0 text-black" strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher"
            className="w-full bg-transparent text-[13px] text-black placeholder:text-[#807A72] focus:outline-none"
          />
        </div>

        <nav className="flex flex-1 flex-col items-stretch justify-start gap-1 overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#C3B9B1] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:backdrop-blur-[150px]">
          <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#66605A]">
            Principal
          </p>

          {filteredNav.map((item) => {
            const Icon = item.icon;

            if (item.type === "link") {
              const active = isActive(pathname, item.href);
              return (
                <div key={item.href} className="relative">
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-[#EA580C]/15"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 34,
                      }}
                    />
                  )}
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={`group relative z-10 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-200 ${
                      active
                        ? "text-black"
                        : "text-[#A8A29B] hover:bg-white/[0.06] hover:text-black"
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
                    <span className="flex-1">{item.label}</span>
                    {!!item.badge && (
                      <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#EA580C] px-1 text-[10px] font-semibold text-[#161310]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </div>
              );
            }

            // Groupe dépliable (ex: Mes commandes)
            const groupActive = pathname.startsWith(item.href);
            const isOpen = openGroup === item.href;

            return (
              <div key={item.href}>
                <button
                  onClick={() => setOpenGroup(isOpen ? null : item.href)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-200 ${
                    groupActive
                      ? "text-black"
                      : "text-[#A8A29B] hover:bg-white/[0.06] hover:text-black"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                      groupActive
                        ? "text-[#EA580C]"
                        : "text-[#807A72] group-hover:text-[#EA580C]"
                    }`}
                    strokeWidth={2}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-[#807A72] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="ml-[22px] flex flex-col gap-0.5 border-l border-white/[0.08] pb-1 pl-4 pt-1">
                        {item.children.map((child) => {
                          const childActive =
                            pathname +
                              (typeof window !== "undefined"
                                ? window.location.search
                                : "") ===
                            child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-[13px] transition-colors duration-200 ${
                                childActive
                                  ? "bg-[#EA580C]/15 font-medium text-black"
                                  : "text-[#A8A29B] hover:text-black"
                              }`}
                            >
                              {child.dot && (
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ backgroundColor: child.dot }}
                                />
                              )}
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <p className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#66605A]">
            Compte
          </p>

          {ACCOUNT_LINKS.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <div key={item.href} className="relative">
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-[#EA580C]/15"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className={`group relative z-10 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-200 ${
                    active
                      ? "text-black"
                      : "text-[#A8A29B] hover:bg-white/[0.06] hover:text-black"
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
                  <span className="flex-1">{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-[13px] font-medium text-black">
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

      {/* ── Barre de navigation mobile ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-[68px] items-center justify-around border-t border-white/[0.08] bg-[#161310]/95 px-1 backdrop-blur md:hidden">
        {MOBILE_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10.5px] font-medium"
            >
              {active && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute inset-x-3 top-0.5 h-[34px] rounded-xl bg-[#EA580C]/15"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              <span className="relative z-10">
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    active ? "text-[#EA580C]" : "text-[#807A72]"
                  }`}
                  strokeWidth={2}
                />
                {!!link.badge && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[#EA580C] px-0.5 text-[9px] font-bold text-[#161310]">
                    {link.badge}
                  </span>
                )}
              </span>
              <span
                className={`relative z-10 transition-colors ${
                  active ? "text-[#EA580C]" : "text-[#807A72]"
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
