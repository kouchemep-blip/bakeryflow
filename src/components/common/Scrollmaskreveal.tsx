"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 1. Mise à jour du type pour accepter un tableau d'objets
export interface ScrollMaskRevealProps {
  lines: { text: string; color?: string }[];
  lineClassName?: string;
  className?: string;
  maskColor?: string;
  stagger?: number;
  duration?: number;
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

export default function ScrollMaskReveal({
  lines,
  lineClassName = "",
  className = "",
  maskColor,
  stagger = 0.08,
  duration = 0.8,
  start = "top 85%",
  end = "bottom 20%",
  scrub = true,
}: ScrollMaskRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const maskRefs = useRef<HTMLDivElement[]>([]);

  maskRefs.current = [];

  const registerMask = (el: HTMLDivElement | null) => {
    if (el && !maskRefs.current.includes(el)) {
      maskRefs.current.push(el);
    }
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    const masks = maskRefs.current;
    if (!container || masks.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      gsap.set(masks, { scaleX: 1, transformOrigin: "right center" });

      if (prefersReducedMotion) {
        gsap.set(masks, { scaleX: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub,
        },
      });

      tl.to(masks, {
        scaleX: 0,
        duration,
        stagger,
        ease: "power2.out",
      });
    }, container);

    return () => ctx.revert();
  }, [lines, stagger, duration, start, end, scrub]);

  return (
    <div ref={containerRef} className={className}>
      {lines.map((line, i) => (
        <div key={i} className="relative overflow-hidden">
          {/* 2. CORRECTION : Injection de la couleur unique de la ligne dans les classes */}
          <span className={`block will-change-transform ${lineClassName} ${line.color ?? ""}`}>
            {line.text}
          </span>
          <div
            ref={registerMask}
            aria-hidden
            className="absolute inset-0 will-change-transform"
            style={{ backgroundColor: maskColor ?? "var(--reveal-mask-bg, #ffffff)" }}
          />
        </div>
      ))}
    </div>
  );
}
