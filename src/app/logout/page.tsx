"use client";

/**
 * app/logout/page.tsx
 * ------------------------------------------------------------
 * Déclenche la déconnexion (appel à /api/auth/logout) puis
 * redirige. Redirige vers /bye pour afficher l'écran
 * d'adieu stylisé (voir ce fichier séparé) plutôt que directement
 * vers "/".
 */

import { useState } from "react";

const HREF_APRES_DECONNEXION = "/bye";

export default function Deconnexion() {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = HREF_APRES_DECONNEXION;
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#100c0a] px-5 py-8">
      {/* Ambiance : dégradé façon bougie + vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, #241a15 0%, #1c1512 45%, #100c0a 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <main className="relative z-10 w-full max-w-sm rounded-2xl border border-[#c9a15c]/35 bg-gradient-to-b from-[#241a15] to-[#1a130f] px-9 py-10 text-center shadow-[0_30px_70px_rgba(0,0,0,0.55)] before:content-[''] before:absolute before:left-3 before:right-3 before:top-3 before:h-px before:bg-[#c9a15c]/25 after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-3 after:h-px after:bg-[#c9a15c]/25">
        <p className="mb-2 text-[0.72rem] uppercase tracking-[0.28em] text-[#c9a15c] opacity-85">
          À votre service
        </p>

        <h1 className="text-2xl font-semibold leading-tight tracking-wide text-[#f3ead9]">
          Quitter votre compte
        </h1>

        <p className="mx-auto mb-8 mt-3 max-w-[280px] text-[0.95rem] leading-relaxed text-[#cdbfa4]">
          Vous êtes sur le point de vous déconnecter de votre espace.
        </p>

        <button
          onClick={logout}
          disabled={loading}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#e6c98a] to-[#c9a15c] px-6 py-3.5 text-[0.85rem] font-medium uppercase tracking-[0.12em] text-[#1a130f] shadow-[0_8px_18px_rgba(201,161,92,0.25)] transition-all hover:-translate-y-px hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1a130f]/30 border-t-[#1a130f]" />
          )}
          <span className="relative">
            {loading ? "Déconnexion en cours…" : "Se déconnecter"}
          </span>
        </button>
      </main>
    </div>
  );
}