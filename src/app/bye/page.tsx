"use client";

import Link from "next/link";
import { Check, Home, LogIn, Sparkles } from "lucide-react";

const RESTAURANT_NAME = "Le Jardin Doré";
const RESTAURANT_TAGLINE = "Cuisine de saison";
const HREF_RECONNEXION = "/inscription";
const HREF_ACCUEIL = "/";

export default function DeconnexionPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#07111f] px-5 py-10 text-white">
      {/* Arrière-plan décoratif */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <section className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-[#07111f] shadow-lg shadow-cyan-500/30">
              <Check size={26} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Carte principale */}
        <div className="rounded-[2rem] border border-white/15 bg-white/[0.08] p-7 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
              <Sparkles size={14} />
              {RESTAURANT_TAGLINE}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              À bientôt !
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-300 sm:text-base">
              Vous avez été déconnecté de votre espace. Merci pour votre visite
              chez <span className="font-semibold text-white">{RESTAURANT_NAME}</span>.
            </p>
          </div>

          {/* Confirmation */}
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
              <Check size={20} strokeWidth={2.5} />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-200">
                Déconnexion réussie
              </p>
              <p className="mt-1 text-xs text-emerald-100/60">
                Votre session est maintenant fermée.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href={HREF_RECONNEXION}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-500 px-5 py-3.5 text-sm font-bold text-[#07111f] shadow-lg shadow-cyan-500/20 transition duration-300 hover:-translate-y-0.5 hover:from-cyan-200 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#07111f]"
            >
              <LogIn size={18} />
              Se reconnecter
            </Link>

            <Link
              href={HREF_ACCUEIL}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-sm font-semibold text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#07111f]"
            >
              <Home size={18} />
              Accueil
            </Link>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-xs tracking-[0.18em] text-slate-400">
              {RESTAURANT_NAME}
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Nous espérons vous revoir très bientôt.
        </p>
      </section>
    </main>
  );
}