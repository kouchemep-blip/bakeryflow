"use client";

import { useState } from "react";
import { Search, Sun, Moon, Plus, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.refresh();
    router.push("/bye");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex flex-col gap-3 border-b border-black/[0.08] bg-[#F5EFE6]/90 backdrop-blur-md px-4 py-4 sm:px-6 lg:left-64 lg:flex-row lg:items-center lg:justify-between dark:border-white/[0.06] dark:bg-[#161310]/90">
      {/* ── Barre Principale Toujours Visible ── */}
      <div className="flex items-center justify-between w-full lg:w-auto">
        {/* Titre */}
        <div>
          <h1 className="text-xl font-bold text-[#161310] sm:text-2xl dark:text-white">
            Bonjour, Chef
          </h1>
          <p className="text-xs text-[#807A72] sm:text-sm">
            Bienvenue sur votre tableau de bord.
          </p>
        </div>

        {/* Actions rapides Mobile + Bouton Burger */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Avatar toujours visible sur mobile */}
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

          {/* Déclencheur du menu mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-[#161310] shadow-sm dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Menu Déroulant (Mobile) / Actions Alignées (Desktop) ── */}
      <div
        className={`
          ${menuOpen ? "flex opacity-100 max-h-[400px] mt-2 py-2" : "hidden lg:flex opacity-0 lg:opacity-100 max-h-0 lg:max-h-none overflow-hidden lg:overflow-visible"}
          flex-col lg:flex-row flex-wrap items-stretch lg:items-center gap-3 transition-all duration-300 ease-in-out w-full lg:w-auto
        `}
      >
        {/* Barre de recherche complète */}
        <div className="flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-[#807A72] shadow-sm dark:border-white/[0.08] dark:bg-white/[0.04]">
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-transparent outline-none text-[#161310] dark:text-white text-sm"
          />
          <kbd className="ml-auto hidden rounded border border-black/10 px-1.5 py-0.5 text-[10px] font-medium text-[#807A72] md:inline">
            ⌘K
          </kbd>
        </div>

        {/* Bouton Ajouter */}
        <button className="flex items-center justify-center gap-2 rounded-lg bg-[#EA580C] px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#D07F49]">
          <Plus className="h-4 w-4" />
          <span>Ajouter un élément</span>
        </button>

        {/* Actions système (Thème + Déconnexion + Avatar Desktop) */}
        <div className="flex items-center justify-center gap-3 border-t border-black/[0.08] pt-3 mt-1 lg:border-none lg:pt-0 lg:mt-0">
          {/* Mode Sombre */}
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Changer de thème"
            className="flex flex-1 lg:flex-none h-9 items-center justify-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3 text-[#161310] shadow-sm transition-colors hover:bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="text-xs font-medium lg:hidden">Thème</span>
          </button>

          {/* Déconnexion */}
          <button
            onClick={logout}
            aria-label="Se déconnecter"
            className="flex flex-1 lg:flex-none h-9 items-center justify-center gap-2 cursor-pointer rounded-lg border border-black/[0.08] bg-white px-3 text-rose-600 shadow-sm transition-colors hover:bg-rose-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-rose-950/30"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs font-medium lg:hidden">Quitter</span>
          </button>

          {/* Avatar Desktop */}
          <button
            aria-label="Profil"
            className="hidden lg:block h-9 w-9 overflow-hidden rounded-full border border-black/[0.08] dark:border-white/[0.08]"
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
      </div>
    </header>
  );
}
