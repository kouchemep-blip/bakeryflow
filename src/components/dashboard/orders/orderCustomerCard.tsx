import type { OrderWithUserAndItems } from "@/types/order";
import {
  CalendarDays,
  Mail,
  Phone,
  User2,
  Sparkles,
  BadgeCheck,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";

type Props = { order: OrderWithUserAndItems };

export default function OrderCustomerCard({ order }: Props) {
  const initials = `${order.user.firstName?.[0] ?? ""}${order.user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="h-28 bg-gradient-to-r" />

      <div className="px-6 pb-6">
        <div className="-mt-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="flex h-22 w-22 items-center justify-center rounded-[1.4rem] border-4 border-white bg-slate-900 text-2xl font-bold text-white shadow-xl shadow-slate-900/15">
                {initials || "CU"}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                <BadgeCheck className="h-3 w-3 text-white" />
              </span>
            </div>

            <div className="pb-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Client
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {order.user.firstName} {order.user.lastName}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Commande passée le{" "}
                {new Date(order.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Client actif
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                <User2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Nom complet
                </p>
                <p className="truncate text-sm font-semibold text-slate-900">
                  {order.user.firstName} {order.user.lastName}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <p className="truncate text-sm font-semibold text-slate-900">
                  {order.user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Téléphone
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {order.user.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Date de commande
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`tel:${order.user.phone}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <PhoneCall className="h-4 w-4" />
            Appeler
          </a>

          <a
            href={`mailto:${order.user.email}`}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <MessageCircle className="h-4 w-4" />
            Envoyer un mail
          </a>

          <div className="ml-auto inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Profil vérifié
          </div>
        </div>
      </div>
    </section>
  );
}