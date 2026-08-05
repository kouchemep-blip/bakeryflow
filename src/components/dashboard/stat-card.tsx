"use client";
import { motion } from "framer-motion";
import { Users, ShoppingBag, PackageCheck, MessageCircle } from "lucide-react";

export const icons = {
  users: Users,
  shoppingBag: ShoppingBag,
  packageCheck: PackageCheck,
  messageCircle: MessageCircle,
} as const;

type IconName = keyof typeof icons;

type StatCardProps = {
  icon: IconName;
  label: string;
  value: string;
  detail: string;
  color: string;
  bg: string;
  index: number;
};

export function StatCard({ icon, label, value, detail, color, bg, index }: StatCardProps) {
  const Icon = icons[icon]; // ← récupère le vrai composant

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="group rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/[0.06] dark:bg-white/[0.03]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: bg }}>
          {Icon && <Icon className="h-5 w-5" style={{ color }} strokeWidth={2} />}
        </div>
      </div>
      <p className="mt-4 text-sm text-[#807A72]">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-[#A8A29B]">{detail}</p>
    </motion.div>
  );
}
