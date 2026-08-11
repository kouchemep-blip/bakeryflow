// "use client";

// /**
//  * ScrollMaskReveal
//  * -----------------
//  * Révèle une série de lignes de texte au scroll, chacune masquée par un
//  * volet opaque (même couleur que le fond) qui se rétracte horizontalement.
//  *
//  * - Le texte ne bouge JAMAIS : seul le masque (transform: scaleX) est animé.
//  * - Chaque ligne a son propre masque, avec un léger décalage (stagger).
//  * - `scrub` lie précisément la progression de l'animation à la position
//  *   de scroll : on peut avancer / reculer, l'animation suit fidèlement.
//  * - Cycle de vie GSAP proprement géré avec gsap.context() + revert().
//  */

// import { useLayoutEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// if (typeof window !== "undefined") {
//   gsap.registerPlugin(ScrollTrigger);
// }

// export interface ScrollMaskRevealProps {
//   /** Les lignes de texte à révéler, dans l'ordre d'affichage (haut -> bas). */
//   lines: string[];
//   /** Classe(s) Tailwind appliquée(s) à chaque ligne de texte (typo, taille...). */
//   lineClassName?: string;
//   /** Classe(s) Tailwind sur le conteneur global. */
//   className?: string;
//   /**
//    * Couleur du masque. Doit être identique au fond visible derrière le texte
//    * pour que l'illusion de "volet" fonctionne. Accepte toute valeur CSS
//    * (hex, rgb, var(--...)). Par défaut, hérite du fond via `bg-background`.
//    */
//   maskColor?: string;
//   /** Décalage (en secondes de timeline) entre le début de chaque masque. */
//   stagger?: number;
//   /** Durée d'animation de chaque masque, en secondes de timeline. */
//   duration?: number;
//   /** Ancrage de déclenchement ScrollTrigger (ligne haute du conteneur). */
//   start?: string;
//   /** Ancrage de fin ScrollTrigger. */
//   end?: string;
//   /** Valeur de scrub GSAP : `true` = 1:1 avec le scroll, ou un nombre = lissage (ex: 0.5). */
//   scrub?: boolean | number;
// }

// export default function ScrollMaskReveal({
//   lines,
//   lineClassName = "",
//   className = "",
//   maskColor,
//   stagger = 0.15,
//   duration = 1,
//   start = "top 80%",
//   end = "bottom 40%",
//   scrub = 0.6,
// }: ScrollMaskRevealProps) {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const maskRefs = useRef<HTMLDivElement[]>([]);

//   // On réinitialise le tableau de refs à chaque rendu, avant que React
//   // ne recolle les nouvelles refs via les callback refs ci-dessous.
//   maskRefs.current = [];

//   const registerMask = (el: HTMLDivElement | null) => {
//     if (el && !maskRefs.current.includes(el)) {
//       maskRefs.current.push(el);
//     }
//   };

//   useLayoutEffect(() => {
//     const container = containerRef.current;
//     const masks = maskRefs.current;
//     if (!container || masks.length === 0) return;

//     const prefersReducedMotion = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     const ctx = gsap.context(() => {
//       // État initial : masque plein, ancré à droite pour se rétracter
//       // vers la gauche au fur et à mesure du reveal.
//       gsap.set(masks, { scaleX: 1, transformOrigin: "right center" });

//       if (prefersReducedMotion) {
//         // Pas d'animation liée au scroll : on révèle directement.
//         gsap.set(masks, { scaleX: 0 });
//         return;
//       }

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: container,
//           start,
//           end,
//           scrub,
//           // markers: true, // décommenter pour debug
//         },
//       });

//       tl.to(masks, {
//         scaleX: 0,
//         duration,
//         stagger,
//         ease: "power2.inOut",
//       });
//     }, container);

//     return () => ctx.revert();
//   }, [lines, stagger, duration, start, end, scrub]);

//   return (
//     <div ref={containerRef} className={className}>
//       {lines.map((line, i) => (
//         <div key={i} className="relative overflow-hidden">
//           <span
//             className={`block will-change-transform ${lineClassName}`}
//             // Le texte est statique : aucune transform, aucune opacité animée.
//           >
//             {line}
//           </span>
//           <div
//             ref={registerMask}
//             aria-hidden
//             className="absolute inset-0 will-change-transform"
//             style={{ backgroundColor: maskColor ?? "var(--reveal-mask-bg, #ffffff)" }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollMaskRevealProps {
  lines: string[];
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
          // markers: true,
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
          <span className={`block will-change-transform ${lineClassName}`}>
            {line}
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