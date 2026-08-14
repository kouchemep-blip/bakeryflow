"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowUpRight,
  Check,
  Home,
  LogIn,
  Sparkles,
  Cookie,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

const RESTAURANT_NAME = "BakeryFlow";
const RESTAURANT_TAGLINE = "Pâtisserie & moments d’exception";
const HREF_RECONNEXION = "/inscription";
const HREF_ACCUEIL = "/";

function FloatingBlob({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: -12,
        x: 8,
        scale: 1.04,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay,
      });
    });

    return () => ctx.revert();
  }, []);

  return <div ref={ref} className={className} />;
}

function ActionButton({
  href,
  icon: Icon,
  children,
  primary = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
        primary
          ? "bg-[#111827] text-white shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-black focus:ring-[#EA580C]/40 focus:ring-offset-[#F5EFE6]"
          : "border border-black/10 bg-white/55 text-black backdrop-blur-md hover:-translate-y-0.5 hover:bg-white focus:ring-[#EA580C]/30 focus:ring-offset-[#F5EFE6]",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function DeconnexionPage() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
          { opacity: 1, scale: 1, rotate: 0, duration: 0.7, delay: 0.08, ease: "power3.out" },
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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-28 h-96 w-96 rounded-full bg-[#EA580C]/12 blur-3xl" />
        <div className="absolute -right-36 top-12 h-[28rem] w-[28rem] rounded-full bg-white/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#111827]/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <FloatingBlob className="absolute left-10 top-20 h-24 w-24 rounded-full bg-[#EA580C]/10 blur-2xl" />
      <FloatingBlob className="absolute right-14 top-24 h-28 w-28 rounded-full bg-white/60 blur-2xl" delay={0.8} />

      <section className="relative z-10 w-full max-w-xl">
        <div ref={logoRef} className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-white/60 bg-white/55 shadow-[0_16px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF7F0] text-[#EA580C] shadow-sm">
              <Cookie className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div
          ref={cardRef}
          className="rounded-[2rem] border border-white/55 bg-white/45 p-7 shadow-[0_24px_110px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:p-10"
        >
          <div ref={titleRef} className="mb-8 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#EA580C]/15 bg-[#fff7f0] px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#EA580C]">
              <Sparkles className="h-3.5 w-3.5" />
              {RESTAURANT_TAGLINE}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              À bientôt !
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-black/65 sm:text-base">
              Vous avez été déconnecté de votre espace. Merci pour votre visite chez{" "}
              <span className="font-semibold text-black">{RESTAURANT_NAME}</span>.
            </p>
          </div>

          <div
            ref={successRef}
            className="mb-8 flex items-center gap-3 rounded-[1.35rem] border border-emerald-500/10 bg-emerald-500/8 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-600">
              <Check className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-700">
                Déconnexion réussie
              </p>
              <p className="mt-1 text-xs text-emerald-700/70">
                Votre session est maintenant fermée.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ActionButton href={HREF_RECONNEXION} icon={LogIn} primary>
              Se reconnecter
            </ActionButton>

            <ActionButton href={HREF_ACCUEIL} icon={Home}>
              Accueil
            </ActionButton>
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