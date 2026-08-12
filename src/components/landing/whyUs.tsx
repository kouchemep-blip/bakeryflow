
"use client";

import { useLayoutEffect, useRef } from "react";
import type { ComponentType } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag, Truck, LayoutDashboard, MessageCircle } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Feature {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: ShoppingBag,
    title: "Commande simplifiée",
    description:
      "Choisissez vos produits et validez votre commande en quelques clics, sans complications.",
  },
  {
    icon: Truck,
    title: "Suivi en temps réel",
    description:
      "Suivez chaque étape de votre commande, de la préparation jusqu'à la livraison.",
  },
  {
    icon: LayoutDashboard,
    title: "Gestion centralisée",
    description:
      "Toutes vos commandes et informations regroupées dans un espace clair et organisé.",
  },
  {
    icon: MessageCircle,
    title: "Communication directe",
    description:
      "Restez en contact avec l'équipe pour toute question, sans détour ni attente inutile.",
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const crossRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const highlightRefs = useRef<HTMLSpanElement[]>([]);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  highlightRefs.current = [];
  cardRefs.current = [];

  const registerHighlight = (el: HTMLSpanElement | null) => {
    if (el && !highlightRefs.current.includes(el)) highlightRefs.current.push(el);
  };
  const registerCard = (el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // On laisse tout dans son état final naturel, sans mouvement.
        return;
      }

      // États de départ (avant l'entrée en scène)
      gsap.set(imageWrapRef.current, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(crossRef.current, { opacity: 0, scale: 0.4, rotate: -25 });
      gsap.set(badgeRef.current, { opacity: 0, y: 16, scale: 0.9 });
      gsap.set(highlightRefs.current, { scale: 0.6, opacity: 0, rotate: -6 });
      gsap.set(cardRefs.current, { opacity: 0, y: 28 });

      // Chorégraphie d'entrée, jouée une seule fois
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });

      tl.from(eyebrowRef.current, { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" })
        .from(
          headingRef.current,
          { opacity: 0, y: 24, duration: 0.65, ease: "power3.out" },
          "-=0.25"
        )
        .to(
          highlightRefs.current,
          { scale: 1, opacity: 1, rotate: -2, duration: 0.5, ease: "back.out(2.2)", stagger: 0.12 },
          "-=0.25"
        )
        .from(
          paragraphRef.current,
          { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        )
        .to(
          imageWrapRef.current,
          { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power3.inOut" },
          "-=0.55"
        )
        .to(
          crossRef.current,
          { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.8)" },
          "-=0.45"
        )
        .to(
          badgeRef.current,
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        )
        .to(
          cardRefs.current,
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.12 },
          "-=0.2"
        );

      // Léger flottement continu du badge (discret, jamais sous reduced-motion)
      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          y: "+=8",
          duration: 2.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.2,
        });
      }

      // Parallax léger sur l'image pendant le scroll (desktop uniquement, coût faible)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.to(imageWrapRef.current, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#F5EFE6] text-[#2B1B17]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-24 md:grid-cols-2 md:px-12 md:py-32">
        {/* Colonne image */}
        <div className="relative">
          <div
            ref={imageWrapRef}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-tl-[3rem] rounded-tr-[3rem] rounded-br-[3rem] will-change-transform"
          >
            <Image
              src="/images/why-choose-us.jpg"
              alt="Préparation artisanale chez BakeryFlow"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Croix décorative */}
          <div
            ref={crossRef}
            aria-hidden
            className="absolute -bottom-6 -left-6 h-20 w-20 will-change-transform"
          >
            <div className="absolute left-1/2 top-0 h-full w-5 -translate-x-1/2 rounded-full bg-[#EA580C]" />
            <div className="absolute left-0 top-1/2 h-5 w-full -translate-y-1/2 rounded-full bg-[#EA580C]" />
          </div>

          {/* Badge flottant */}
          <div
            ref={badgeRef}
            className="absolute right-4 top-4 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm will-change-transform md:right-6 md:top-6"
          >
            <p className="text-lg font-semibold leading-none text-[#2B1B17]">4.9/5</p>
            <p className="mt-1 text-xs text-[#6B4B40]">Clients satisfaits</p>
          </div>
        </div>

        {/* Colonne contenu */}
        <div>
          {/* <div ref={eyebrowRef} className="mb-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#EA580C]" />
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-[#EA580C]">
              Pourquoi nous choisir
            </span>
          </div> */}

          <h2 ref={headingRef} className="text-4xl font-semibold leading-tight md:text-6xl">
            Commander devient{" "}
            <span
              ref={registerHighlight}
              className="inline-block rounded-xl bg-[#EA580C] px-3 py-1 text-white"
            >
              simple
            </span>
            <br className="hidden md:block" />
            et{" "}
            <span
              ref={registerHighlight}
              className="inline-block rounded-xl bg-[#2B1B17] px-3 py-1 text-white"
            >
              sans stress
            </span>
          </h2>

          <p ref={paragraphRef} className="mt-6 max-w-xl text-base leading-7 text-[#6B4B40] md:text-lg">
            De la sélection des produits jusqu&apos;à la livraison, BakeryFlow réunit tout
            ce dont vous avez besoin pour commander sereinement et suivre chaque étape en
            toute clarté.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} ref={registerCard} className="group will-change-transform">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#2B1B17]/10 text-[#EA580C] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#EA580C]/40 group-hover:bg-[#EA580C]/10">
                  <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B4B40]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}