"use client";

import Link from "next/link";
import { Home, ShoppingBag, MessageCircle, User } from "lucide-react";

const links = [
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
    label: "Mon profil",
    href: "/customers/profile",
    icon: User,
  },
];

export default function ClientSidebar() {
  return (
    <aside className="w-64 border-r bg-white p-6">
      <h1 className="mb-8 text-2xl font-bold">BakeryFlow</h1>

      <nav className="space-y-3">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="
                flex items-center gap-3
                rounded-lg
                px-4 py-3
                hover:bg-orange-100
              "
            >
              <Icon size={20} />

              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
