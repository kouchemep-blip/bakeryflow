"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ShowcaseItem {
  index: string;
  title: string;
  description: string;
}

export interface ImmersiveScrollShowcaseProps {
  eyebrow?: string;
  title: string;
  items: ShowcaseItem[];
  segmentVh?: number;
}

export default function ImmersiveScrollShowcase({
  eyebrow,
  title,
  items,
  segmentVh = 110,
}: ImmersiveScrollShowcaseProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  itemRefs.current = [];

  const registerItem = (el: HTMLDivElement | null) => {
    if (el && !itemRefs.current.includes(el)) itemRefs.current.push(el);
  };

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const pin = pinRef.current;
    if (!wrapper || !pin) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const itemEls = itemRefs.current.filter(Boolean) as HTMLElement[];
        const n = itemEls.length;

        // CORRECTION IMMERSIVE : Tous les items commencent cachés et décalés vers le bas au même endroit
        gsap.set(itemEls, { opacity: 0, y: 60, scale: 0.95 });
        // On affiche le premier dès le départ
        gsap.set(itemEls[0], { opacity: 1, y: 0, scale: 1 });

        const master = ScrollTrigger.create({
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          pin,
          scrub: 1,
          onUpdate: (self) => {
            gsap.set(lineRef.current, {
              scaleY: 0.1 + self.progress * 0.9,
              transformOrigin: "top center",
            });
          },
        });

        itemEls.forEach((el, i) => {
          // Division stricte des fenêtres de scroll selon le nombre d'éléments
          const startPct = (i / n) * 100;
          const endPct = ((i + 1) / n) * 100;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: wrapper,
              start: `top+=${startPct}% top`,
              end: `top+=${endPct}% top`,
              scrub: 0.8,
            },
          });

          // Animation d'entrée pour les éléments suivants
          if (i > 0) {
            tl.to(el, { opacity: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.4 }, 0);
          }

          // Animation de sortie (sauf pour le tout dernier élément qui reste visible à la fin)
          if (i < n - 1) {
            tl.to(el, { opacity: 0, y: -60, scale: 0.95, ease: "power2.in", duration: 0.4 }, 0.6);
          }
        });

        return () => master.kill();
      });

      mm.add("(max-width: 767px)", () => {
        const itemEls = itemRefs.current.filter(Boolean) as HTMLElement[];
        gsap.set(itemEls, { opacity: 0, y: 40 });

        itemEls.forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 60%",
              scrub: 0.3,
            },
          });
        });
      });
    }, wrapper);

    return () => ctx.revert();
  }, [items, segmentVh]);

  return (
    <section
      ref={wrapperRef}
      className="relative bg-transparent text-black h-auto md:h-[var(--desktop-height)]"
      style={{ "--desktop-height": `${items.length * segmentVh}vh` } as React.CSSProperties}
    >
      <div ref={pinRef} className="relative overflow-visible md:overflow-hidden h-auto md:h-screen">
        <div className="pointer-events-none absolute inset-0" />

        <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-[1fr_auto_1fr] md:px-16">
          
          {/* Colonne gauche : titre */}
          <div className="flex flex-col justify-start md:justify-center">
            <h2 className="max-w-md text-4xl font-medium leading-tight md:text-5xl lg:text-6xl">
              {title}
            </h2>
          </div>

          {/* Ligne séparatrice verticale */}
          <div className="relative mt-5 hidden md:flex md:justify-center">
            <div className="absolute top-0 h-full w-px bg-transparent" />
            <div
              ref={lineRef}
              className="absolute top-0 h-full w-px bg-[#EA580C]"
              style={{ transform: "scaleY(0.1)" }}
            />
          </div>

          {/* Colonne droite : Les étapes fixes sur PC, empilées sur mobile */}
          {/* CORRECTION DESKTOP : h-auto sur mobile, h-[45vh] fixe sur PC pour servir de boîte d'ancrage */}
          <div className="relative flex flex-col justify-start md:justify-center gap-16 md:gap-0 h-auto md:h-[45vh] my-auto">
            {items.map((item, i) => (
              <div
                key={item.index}
                ref={registerItem}
                // CORRECTION TAILWIND : md:absolute et md:inset-0 forcent tous les blocs à occuper le même espace exact au centre
                className="relative md:absolute md:inset-0 flex flex-col justify-center max-w-lg"
              >
                <div className="mb-4 flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#8b5b4d]/50 bg-white text-lg font-medium text-[#6d2f2f] shadow-sm">
                    {item.index}
                  </span>
                  <div className="h-px flex-1 bg-[#8b5b4d]/20" />
                </div>

                <h3 className="mb-3 text-2xl font-medium text-[#4b1f1f] md:text-3xl">
                  {item.title}
                </h3>
                <p className="max-w-md text-sm leading-7 text-[#6f4b45] md:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
