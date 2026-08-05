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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DiscoverButton } from "../ui/DiscoverBtn";
import Link from "next/link";

type UserData = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
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
      <div className="h-12 w-44 rounded-full bg-white/30 animate-pulse backdrop-blur-md border border-white/40" />
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

  return (
    <div ref={menuRef} className="relative h-[10vh]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-full border border-white/40 bg-white/40 backdrop-blur-md px-3 py-2 shadow-lg hover:bg-white/60 transition"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white font-semibold">
          {user.firstName.charAt(0).toUpperCase()}
        </div>

        <div className="text-left">
          <p className="text-sm font-semibold text-gray-900">
            {user.firstName}
          </p>

          <p className="text-xs text-gray-500">
            {admin ? "Administrateur" : "Client"}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.95,
            }}
            transition={{
              duration: 0.18,
            }}
            className="absolute right-0 mt-3 w-72 rounded-3xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b">
              <p className="font-bold">
                {user.firstName} {user.lastName}
              </p>

              <p className="text-sm text-gray-500">
                {admin ? "Administrateur BakeryFlow" : "Client BakeryFlow"}
              </p>
            </div>

            <div className="py-2">
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
                </>
              )}
            </div>

            <div className="border-t p-2">
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
      className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition hover:bg-gray-100 ${
        danger ? "text-red-500" : "text-gray-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
