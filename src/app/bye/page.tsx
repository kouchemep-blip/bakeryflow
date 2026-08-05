"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const RESTAURANT_NAME = "Le Jardin Doré";
const RESTAURANT_TAGLINE = "Cuisine de saison";
const HREF_RECONNEXION = "/inscription"; // Lien vers la page de connexion ou d'inscription
const HREF_ACCUEIL = "/";

export default function DeconnexionPage() {
  const [sceauBrise, setSceauBrise] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSceauBrise(true), 450);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#100c0a] px-5 py-8">
      {/* Ambiance : dégradé façon bougie + vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, #241a15 0%, #1c1512 45%, #100c0a 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 animate-pulse"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(230,201,138,0.08), transparent 55%)",
          animationDuration: "6s",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <main className="relative z-10 w-full max-w-md text-center rounded-sm border border-[#c9a15c]/35 bg-gradient-to-b from-[#241a15] to-[#1a130f] px-9 pb-9 pt-12 shadow-[0_30px_70px_rgba(0,0,0,0.55)] before:content-[''] before:absolute before:left-3 before:right-3 before:top-3 before:h-px before:bg-[#c9a15c]/25 after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-3 after:h-px after:bg-[#c9a15c]/25">
        {/* Sceau de cire */}
        <div
          className={`mx-auto -mt-[3.25rem] mb-5 h-[84px] w-[84px] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            sceauBrise ? "-rotate-[14deg] scale-[1.04]" : "rotate-0 scale-100"
          }`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]"
          >
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#c9a15c"
              strokeWidth="1.5"
              opacity="0.7"
            />
            <circle
              cx="60"
              cy="60"
              r="44"
              fill="#5a1d24"
              stroke="#e6c98a"
              strokeWidth="1"
              className={`transition-opacity duration-500 ${
                sceauBrise ? "opacity-90" : "opacity-0"
              }`}
            />
            <text
              x="60"
              y="70"
              textAnchor="middle"
              fill="#e6c98a"
              fontSize="44"
              fontStyle="italic"
            >
              {RESTAURANT_NAME.charAt(0)}
            </text>
          </svg>
        </div>

        <p className="mb-2 text-[0.72rem] uppercase tracking-[0.28em] text-[#c9a15c] opacity-85">
          {RESTAURANT_TAGLINE}
        </p>

        <h1 className="text-[2.15rem] font-semibold leading-tight tracking-wide text-[#f3ead9]">
          Vous avez été déconnecté
        </h1>

        {/* Séparateur */}
        <div className="mx-auto my-6 h-4 w-36 text-[#c9a15c] opacity-75" aria-hidden="true">
          <svg viewBox="0 0 200 20" className="h-full w-full">
            <path d="M0 10 H70 M130 10 H200" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="100" cy="10" r="3" fill="currentColor" />
            <path d="M85 10 Q100 -4 115 10 Q100 24 85 10 Z" fill="currentColor" />
          </svg>
        </div>

        <p className="mx-auto mb-8 max-w-[320px] text-[0.98rem] leading-relaxed text-[#cdbfa4]">
          Merci de votre visite chez {RESTAURANT_NAME}.
          <br />
          Nous espérons vous revoir très bientôt.
        </p>

        <div className="mb-7 flex flex-col gap-3">
          <Link
            href={HREF_RECONNEXION}
            className="inline-block rounded-sm bg-gradient-to-b from-[#e6c98a] to-[#c9a15c] px-6 py-3.5 text-[0.85rem] font-medium uppercase tracking-[0.12em] text-[#1a130f] shadow-[0_8px_18px_rgba(201,161,92,0.25)] transition-all hover:-translate-y-px hover:brightness-105"
          >
            Se reconnecter
          </Link>
          <Link
            href={HREF_ACCUEIL}
            className="inline-block rounded-sm border border-[#cdbfa4]/35 bg-transparent px-6 py-3.5 text-[0.85rem] uppercase tracking-[0.12em] text-[#cdbfa4] transition-all hover:border-[#c9a15c] hover:text-[#f3ead9]"
          >
            Retour à l&apos;accueil
          </Link>
        </div>

        <p className="italic text-[0.95rem] tracking-wide text-[#c9a15c]/60">
          {RESTAURANT_NAME}
        </p>
      </main>
    </div>
  );
}