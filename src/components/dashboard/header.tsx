// components/dashboard/header.tsx
"use client";

import { useState } from "react";
import { Search, Sun, Moon, Bell, Plus, Download } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [dark, setDark] = useState(false);

  return (
    <header className="flex flex-col gap-3 border-b border-black/[0.06] bg-[#FBFAF8] px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between dark:border-white/[0.06] dark:bg-[#161310]">
      {/* Titre */}
      <div>
        <h1 className="text-xl font-bold text-[#161310] sm:text-2xl dark:text-[#F5F1EA]">
          Bonjour, Chef 
        </h1>
        <p className="text-xs text-[#807A72] sm:text-sm">
          Bienvenue sur votre tableau de bord.
        </p>
      </div>

      {/* Recherche + actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-[#807A72] shadow-sm dark:border-white/[0.08] dark:bg-white/[0.04]">
          <Search className="h-4 w-4 shrink-0" />
          <span className="hidden w-32 truncate sm:inline md:w-44">
            Rechercher...
          </span>
          <kbd className="ml-auto hidden rounded border border-black/10 px-1.5 py-0.5 text-[10px] font-medium text-[#807A72] md:inline">
            ⌘K
          </kbd>
        </div>

        <button
          className="hidden items-center gap-2 rounded-lg bg-[#C2703D] px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#D07F49] sm:flex"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>

        <button className="hidden items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3.5 py-2 text-sm font-medium text-[#161310] shadow-sm transition-colors hover:bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[#F5F1EA] dark:hover:bg-white/[0.08] md:flex">
          <Download className="h-4 w-4" />
          Exporter
        </button>

        <button
          onClick={() => setDark((d) => !d)}
          aria-label="Changer de thème"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-[#161310] shadow-sm transition-colors hover:bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[#F5F1EA] dark:hover:bg-white/[0.08]"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-[#161310] shadow-sm transition-colors hover:bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-[#F5F1EA] dark:hover:bg-white/[0.08]"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C2703D]" />
        </button>

        <button
          aria-label="Profil"
          className="h-9 w-9 overflow-hidden rounded-full border border-black/[0.08] dark:border-white/[0.08]"
        >
          <Image
            src="/avatar-placeholder.png"
            alt="Avatar utilisateur"
            className="h-full w-full object-cover"
            width={36}
            height={36}
            priority
          />
        </button>
      </div>
    </header>
  );
}