"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check, Home, LogIn } from "lucide-react";
import { DiscoverButton } from "@/components/ui/DiscoverBtn";

gsap.registerPlugin(useGSAP);

const RESTAURANT_NAME = "BakeryFlow";
const HREF_RECONNEXION = "/inscription";
const HREF_ACCUEIL = "/";

export default function DeconnexionPage() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 24, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
        );

        gsap.fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.9, rotate: -6 },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.7,
            delay: 0.08,
            ease: "power3.out",
          },
        );

        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.12, ease: "power2.out" },
        );

        gsap.fromTo(
          successRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.22, ease: "power2.out" },
        );
      });

      return () => ctx.revert();
    },
    { scope: cardRef },
  );

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F5EFE6] px-5 py-10 text-black">
      <section className="relative z-10 w-full max-w-xl">
        <div
          ref={cardRef}
          className="rounded-4xl border border-white/55 bg-white/45 p-7 shadow-[0_24px_110px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:p-10"
        >
          <div ref={titleRef} className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              À bientôt !
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-black/65 sm:text-base">
              Vous avez été déconnecté de votre espace. Merci pour votre visite
              chez{" "}
              <span className="font-semibold text-black">
                {RESTAURANT_NAME}
              </span>
              .
            </p>
          </div>

          <div
            ref={successRef}
            className="mb-8 flex items-center gap-3 rounded-[1.35rem] border border-[#EA580C]/10 bg-[#EA580C]/8 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EA580C]/12 text-[#EA580C]">
              <Check className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#EA580C]">
                Déconnexion réussie
              </p>
              <p className="mt-1 text-xs text-[#EA580C]">
                Votre session est maintenant fermée.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href={HREF_RECONNEXION}>
              <DiscoverButton icon={LogIn} label="Se reconnecter" />
            </Link>
            <Link href={HREF_ACCUEIL}>
              <DiscoverButton icon={Home} label="Acceuil" />
            </Link>
          </div>

          <div className="mt-8 border-t border-black/5 pt-6 text-center">
            <p className="text-xs tracking-[0.18em] text-black/40">
              {RESTAURANT_NAME}
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-black/45">
          Nous espérons vous revoir très bientôt.
        </p>
      </section>
    </main>
  );
}
