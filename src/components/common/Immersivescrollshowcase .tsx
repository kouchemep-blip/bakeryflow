"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  PackageCheck,
  Search,
  ShoppingBag,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { DiscoverButton } from "../ui/DiscoverBtn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ShowcaseIcon = "search" | "shopping-bag" | "check" | "package";

export interface ShowcaseItem {
  index: string;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  icon: ShowcaseIcon;
}

export interface ImmersiveScrollShowcaseProps {
  eyebrow?: string;
  title: string;
  items: ShowcaseItem[];
  segmentVh?: number;
}

function StepIcon({ name }: { name: ShowcaseIcon }) {
  const iconClassName =
    "h-6 w-6 transition-transform duration-500 ease-out group-hover:rotate-[-8deg] group-hover:scale-110";

  switch (name) {
    case "shopping-bag":
      return <ShoppingBag className={iconClassName} strokeWidth={1.7} />;
    case "check":
      return <Check className={iconClassName} strokeWidth={1.9} />;
    case "package":
      return <PackageCheck className={iconClassName} strokeWidth={1.7} />;
    case "search":
    default:
      return <Search className={iconClassName} strokeWidth={1.7} />;
  }
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
    if (el && !itemRefs.current.includes(el)) {
      itemRefs.current.push(el);
    }
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

        gsap.set(itemEls, {
          opacity: 0,
          y: 60,
          scale: 0.95,
        });

        gsap.set(itemEls[0], {
          opacity: 1,
          y: 0,
          scale: 1,
        });

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
          const startPct = (i / n) * 100;
          const endPct = ((i + 1) / n) * 100;

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: wrapper,
              start: `top+=${startPct}% top`,
              end: `top+=${endPct}% top`,
              scrub: 0.8,
            },
          });

          if (i > 0) {
            timeline.to(
              el,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                ease: "power2.out",
                duration: 0.4,
              },
              0,
            );
          }

          if (i < n - 1) {
            timeline.to(
              el,
              {
                opacity: 0,
                y: -60,
                scale: 0.95,
                ease: "power2.in",
                duration: 0.4,
              },
              0.6,
            );
          }
        });

        return () => master.kill();
      });

      mm.add("(max-width: 767px)", () => {
        const itemEls = itemRefs.current.filter(Boolean) as HTMLElement[];

        gsap.set(itemEls, {
          opacity: 0,
          y: 40,
        });

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
      className="relative h-auto bg-transparent text-black md:h-[var(--desktop-height)]"
      style={
        {
          "--desktop-height": `${items.length * segmentVh}vh`,
        } as React.CSSProperties
      }
    >
      <div
        ref={pinRef}
        className="relative h-auto overflow-visible md:h-screen md:overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0" />

        <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-[1fr_auto_1fr] md:px-16">
          <div className="flex flex-col justify-start md:justify-center">
            {eyebrow && (
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.24em] text-[#ea580c]">
                {eyebrow}
              </p>
            )}

            <h2 className="max-w-md text-4xl font-medium leading-tight md:text-5xl lg:text-6xl">
              {title}
            </h2>
          </div>

          <div className="relative mt-5 hidden md:flex md:justify-center">
            <div className="absolute top-0 h-full w-px bg-[#8b5b4d]/15" />

            <div
              ref={lineRef}
              className="absolute top-0 h-full w-px bg-[#ea580c]"
              style={{ transform: "scaleY(0.1)" }}
            />
          </div>

          <div className="relative my-auto flex h-auto flex-col justify-start gap-16 md:h-[45vh] md:justify-center md:gap-0">
            {items.map((item, i) => (
              <Link
                href={item.href}
                key={item.index}
                className="group block relative"
              >
                <div
                  ref={registerItem}
                  className="relative flex max-w-lg flex-col justify-center md:absolute md:inset-0"
                >
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#8b5b4d]/35 bg-white text-[#6d2f2f] shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:border-[#ea580c]/60 group-hover:shadow-md">
                      <StepIcon name={item.icon} />
                    </div>

                    <div className="h-px flex-1 bg-[#8b5b4d]/20 transition-colors duration-500 group-hover:bg-[#ea580c]/50" />

                    <span className="text-sm font-medium tracking-[0.18em] text-[#8b5b4d]/70">
                      {item.index}
                    </span>
                  </div>

                  <h3 className="mb-3 text-2xl font-medium text-[#4b1f1f] transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-3xl">
                    {item.title}
                  </h3>

                  <p className="max-w-md text-sm leading-7 text-[#6f4b45] md:text-base mb-4">
                    {item.description}
                  </p>

                  {/* CORRECTION : Ajout de z-20 et pointer-events-auto pour forcer le bouton à passer au-dessus du conflit absolu */}
                  <motion.div
                    className="relative z-20 pointer-events-auto w-full lg:max-w-md text-left pt-6 border-t border-neutral-200/60"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <DiscoverButton
                      icon={ArrowUpRight}
                      label={item.actionLabel}
                    />
                  </motion.div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
