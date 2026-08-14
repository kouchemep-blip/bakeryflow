"use client";

import { useState } from "react";
import { User2, LogOut, Settings, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserMenu from "../layout/UserMenu";

type Props = {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
  } | null;
  pageTitle?: string;
};

export default function ClientHeader({ user, pageTitle }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/bye");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#F5F1EA] px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EA580C] md:hidden">
          <span className="text-sm font-bold text-[#161310]">
            {initials || "CL"}
          </span>
        </div>

        {pageTitle && (
          <h1 className="text-base font-semibold text-black md:text-lg">
            {pageTitle}
          </h1>
        )}
      </div>

      <div className="relative">
        {/* <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-black transition hover:bg-white/[0.1]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EA580C] text-xs font-bold text-[#161310]">
            {initials || "CL"}
          </div>

          <span className="hidden md:block">{user?.firstName || "Client"}</span>

          <ChevronDown className="h-4 w-4 text-[#807A72]" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/[0.12] bg-[#161310] p-2 shadow-xl">
            <div className="border-b border-white/[0.08] p-3">
              <p className="text-sm font-semibold text-black">
                {user ? `${user.firstName} ${user.lastName}` : "Chargement..."}
              </p>
              <p className="text-xs text-[#807A72]">{user?.email || ""}</p>
            </div>

            <nav className="py-2">
              <Link
                href="/customers/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#A8A29B] transition hover:bg-white/[0.06] hover:text-black"
                onClick={() => setMenuOpen(false)}
              >
                <User2 className="h-4 w-4" />
                Mon profil
              </Link>

              <Link
                href="/customers/settings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#A8A29B] transition hover:bg-white/[0.06] hover:text-black"
                onClick={() => setMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
            </nav>

            <div className="border-t border-white/[0.08] pt-2">
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 transition hover:bg-white/[0.06]"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </div>
          </div>
        )} */}
        <UserMenu />
      </div>
    </header>
  );
}
