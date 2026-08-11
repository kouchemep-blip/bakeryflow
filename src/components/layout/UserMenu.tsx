"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Package,
  User,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DiscoverButton } from "../ui/DiscoverBtn";
import Link from "next/link";
import Image from "next/image";

type UserData = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  avatar: string;
};

export default function UserMenu() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
        console.log("User data:", data);
      } catch {}

      setLoading(false);
    }

    loadUser();
  }, []);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", escape);

    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", escape);
    };
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.refresh();
    router.push("/bye");
  }

  if (loading) {
    return (
      <div className="h-10 md:h-[10vh] flex w-32 md:w-44 items-center justify-center rounded-full bg-white/30 animate-pulse backdrop-blur-md border border-white/40">
        <p className="text-xs md:text-sm text-slate-500">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Link href="/inscription">
        <DiscoverButton label="SE CONNECTER" />
      </Link>
    );
  }

  const admin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    // Suppression de la hauteur fixe h-[10vh] forcée sur mobile pour éviter les bugs d'alignement dans la navbar
    <div ref={menuRef} className="relative md:h-[10vh] flex items-center cursor-pointer">
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-1.5 md:gap-3 rounded-full border border-white/40 bg-white/40 backdrop-blur-md p-1.5 md:px-3 md:py-2 shadow-lg transition hover:bg-white/60"
      >
        {user.avatar ? (
          <Image
            width={40}
            height={40}
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-slate-900 text-xs md:text-sm font-bold uppercase text-white shadow-md">
            {initials}
          </div>
        )}

        {/* Le nom et le rôle se masquent sur petit mobile pour économiser l'espace de la navbar */}
        <div className="text-left hidden sm:block">
          <p className="text-xs md:text-sm font-semibold text-slate-900 truncate max-w-[100px]">
            {user.firstName}
          </p>
          <p className="text-[10px] md:text-xs text-slate-500">
            {admin ? "Admin" : "Client"}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={`text-slate-500 transition group-hover:text-slate-700 md:scale-110 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            // right-0 et max-w-[calc(100vw-2rem)] empêchent le menu de dépasser de l'écran sur mobile
            className="absolute right-0 top-full mt-2 w-64 md:w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200 bg-white shadow-2xl z-50"
          >
            <div className="border-b border-slate-100 bg-slate-50 p-4 md:p-5">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <Image
                    width={40}
                    height={40}
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-slate-900 text-xs md:text-sm font-bold uppercase text-white shadow-md">
                    {initials}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-semibold text-sm md:text-base text-slate-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>

                  <p className="text-[11px] md:text-xs text-slate-500 truncate">
                    {admin ? (
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 shrink-0" />
                        Admin BakeryFlow
                      </span>
                    ) : (
                      "Client BakeryFlow"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-1 md:py-2">
              {admin ? (
                <MenuButton
                  icon={<LayoutDashboard size={18} />}
                  label="Tableau de bord"
                  onClick={() => {
                    router.push("/dashboard");
                    setOpen(false);
                  }}
                />
              ) : (
                <>
                  <MenuButton
                    icon={<User size={18} />}
                    label="Mon espace"
                    onClick={() => {
                      router.push("/customers");
                      setOpen(false);
                    }}
                  />

                  <MenuButton
                    icon={<Package size={18} />}
                    label="Mes commandes"
                    onClick={() => {
                      router.push("/customers/orders");
                      setOpen(false);
                    }}
                  />

                  <MenuButton
                    icon={<MessageCircle size={18} />}
                    label="Messagerie"
                    onClick={() => {
                      router.push("/customers/messages");
                      setOpen(false);
                    }}
                  />

                  <MenuButton
                    icon={<Settings size={18} />}
                    label="Paramètres"
                    onClick={() => {
                      router.push("/customers/settings");
                      setOpen(false);
                    }}
                  />
                </>
              )}
            </div>

            <div className="border-t border-slate-100 p-1.5 md:p-2">
              <MenuButton
                danger
                icon={<LogOut size={18} />}
                label="Se déconnecter"
                onClick={logout}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 md:gap-3 px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm transition hover:bg-slate-50 cursor-pointer ${
        danger ? "text-rose-600 hover:bg-rose-50" : "text-slate-700"
      }`}
    >
      <span className="text-slate-400 group-hover:text-slate-500 shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}
