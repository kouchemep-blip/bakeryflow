"use client";

/**
 * loading.tsx — BakeryFlow
 *
 * Écran de chargement global (Next.js App Router Suspense boundary).
 * Exporté par défaut → compatible avec le système de loading automatique de Next.js.
 *
 * Palette : noir profond #1A1410, or #C9A84C, blanc cassé #F5F0E8, bois #2D1F0E
 * Police display : Merienda (chargée via next/font dans layout.tsx)
 * Police corps    : Lato (Google Fonts, sobre, se marie avec Merienda)
 */
import { Lato } from "next/font/google";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// ─── Messages selon la page ───────────────────────────────────────────────────
// usePathname permet d'afficher un message contextuel selon l'URL courante

const lato = Lato({ subsets: ["latin"], weight: ["300", "400"] });
const PAGE_MESSAGES: Record<string, string> = {
  "/":          "Mise en place...",
  "/menu":      "Préparation de la carte...",
  "/commande":  "Chargement de votre commande...",
  "/client":    "Accès à votre espace...",
  "/dashboard": "Chargement du tableau de bord...",
};

const DEFAULT_MESSAGE = "Préparation de votre expérience...";

// Message affiché si le chargement dure plus de 2 secondes
const LONG_WAIT_MESSAGE = "Encore quelques instants, nous préparons tout avec soin...";

// ─── Spinner : assiette / motif géométrique raffiné ───────────────────────────
// Cercle extérieur qui tourne + arc doré + pastille centrale + fourchette SVG

function ElegantSpinner() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">

      {/* Cercle de fond — légèrement visible */}
      <div className="absolute inset-0 rounded-full border border-[#C9A84C]/20" />

      {/* Arc tournant — effet "assiette qui se remplit" */}
      <motion.svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 96 96"
        animate={{ rotate: ["-90deg", "270deg"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="48"
          cy="48"
          r="44"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="80 196"
          opacity="0.9"
        />
      </motion.svg>

      {/* Second arc — décalé, plus fin, effet de profondeur */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 96 96"
        animate={{ rotate: ["0deg", "-360deg"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="48"
          cy="48"
          r="36"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeDasharray="30 196"
          opacity="0.4"
        />
      </motion.svg>

      {/* Fourchette SVG au centre — signature BakeryFlow */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Fourchette stylisée */}
          <line x1="8"  y1="2"  x2="8"  y2="8"  />
          <line x1="12" y1="2"  x2="12" y2="8"  />
          <line x1="16" y1="2"  x2="16" y2="8"  />
          <path d="M8 8 Q12 12 12 22" />
          <path d="M16 8 Q12 12 12 22" />
          {/* Couteau */}
          <line x1="19" y1="2"  x2="19" y2="22" opacity="0.5" />
        </svg>
      </motion.div>

    </div>
  );
}

// ─── Squelettes de page (skeleton) ────────────────────────────────────────────
// Simule la structure d'une page produit pendant le chargement

function SkeletonLayout() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 mt-16 space-y-8">

      {/* Barre de titre */}
      <motion.div
        className="h-5 w-48 rounded-full bg-[#C9A84C]/10 mx-auto"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grille de cartes produit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
          >
            {/* Image skeleton */}
            <motion.div
              className="h-36 bg-[#C9A84C]/8 rounded-t-2xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
            {/* Contenu skeleton */}
            <div className="p-4 space-y-2 bg-white/3 rounded-b-2xl">
              <div
                className="h-3 rounded-full bg-[#C9A84C]/10"
                style={{ width: `${60 + (i % 3) * 15}%` }}
              />
              <div className="h-2.5 rounded-full bg-[#C9A84C]/6 w-4/5" />
              <div className="h-2.5 rounded-full bg-[#C9A84C]/6 w-3/5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Points de suspension animés ──────────────────────────────────────────────

function AnimatedDots() {
  return (
    <span className="inline-flex gap-1 ml-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full bg-[#C9A84C] inline-block"
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────

export default function Loading() {
  const pathname = usePathname();

  // Message contextuel selon la page
  const message = PAGE_MESSAGES[pathname] ?? DEFAULT_MESSAGE;

  // Affiche un message d'attente supplémentaire si > 2 secondes
  const [showLongWait, setShowLongWait] = useState(false);

  // Évite le flash sur les chargements très rapides
  // (le composant ne s'affiche visuellement qu'après 100ms)
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Délai minimal d'affichage — évite le flash
    const visibilityTimer = setTimeout(() => setVisible(true), 100);

    // Message d'attente après 2 secondes
    const longWaitTimer = setTimeout(() => setShowLongWait(true), 2000);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(longWaitTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}

          // Fond : noir profond avec très légère texture chaleur
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center min-h-screen"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, #2D1F0E 0%, #1A1410 60%, #0F0B08 100%)",
          }}
        >

          {/* Ligne décorative haut — discrète */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

          {/* ── Zone centrale ── */}
          <div className="flex flex-col items-center gap-8">

            {/* Logo texte — utilise Merienda via la classe définie dans layout.tsx */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p
                className="text-[#C9A84C]/50 text-[10px] uppercase tracking-[0.4em] font-light mb-1"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Boulangerie artisanale
              </p>
              <h1
                className="text-[#F5F0E8] text-3xl font-light tracking-wide"
                // Merienda est chargée dans layout.tsx via next/font
                // Applique la variable CSS que tu as définie pour Merienda
                style={{ fontFamily: "var(--font-merienda), 'Georgia', serif" }}
              >
                BakeryFlow
              </h1>
            </motion.div>

            {/* Séparateur or */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-12 h-px bg-[#C9A84C]/40 origin-center"
            />

            {/* Spinner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ElegantSpinner />
            </motion.div>

            {/* Message principal */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center space-y-2"
            >
              <p
                className="text-[#F5F0E8]/70 text-sm tracking-widest flex items-center gap-1"
                style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              >
                {message}
                <AnimatedDots />
              </p>

              {/* Message long wait — apparaît après 2s */}
              <AnimatePresence>
                {showLongWait && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-[#C9A84C]/50 text-xs tracking-wide"
                    style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                  >
                    {LONG_WAIT_MESSAGE}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Skeleton layout ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute bottom-0 left-0 right-0 overflow-hidden"
            style={{
              // Masque progressivement le skeleton vers le haut
              maskImage: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)",
            }}
          >
            <SkeletonLayout />
          </motion.div>

          {/* Ligne décorative bas */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

          {/* Grain subtil (texture) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px",
            }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  );
}