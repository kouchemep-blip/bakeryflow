"use client";

/**
 * RotatingHeadline
 * -----------------
 * Reproduit l'animation observée : une phrase fixe dont deux segments
 * (mis en évidence en vert) changent en boucle, avec une transition
 * "blur fade" — le texte sortant se floute et s'estompe sur place,
 * puis le texte entrant apparaît flouté et se stabilise net.
 *
 * Le reste de la phrase ("Je transforme vos idées en ... qui ... vite.")
 * ne bouge jamais : seuls les deux mots dynamiques sont animés, et les
 * sauts de ligne sont fixes (via <br/>) pour que la mise en page ne
 * bouge pas quand un mot est plus long/court qu'un autre.
 *
 * Fichier unique, autonome — copiez-le tel quel dans votre projet
 * Next.js (`npm i gsap`), c'est un composant client ("use client").
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Les paires de mots qui se succèdent en boucle. Modifiez librement.
const PHRASES: { a: string; b: string }[] = [
  { a: "interfaces premium", b: "convertissent" },
  { a: "expériences web", b: "évoluent" },
  { a: "produits digitaux", b: "captent" },
];

const HOLD_DURATION = 1800; // temps d'affichage de chaque phrase (ms)
const EXIT_DURATION = 0.45; // durée de la sortie (s)
const ENTER_DURATION = 0.55; // durée de l'entrée (s)
const BLUR_AMOUNT = 8; // px

export default function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  const wordARef = useRef<HTMLSpanElement | null>(null);
  const wordBRef = useRef<HTMLSpanElement | null>(null);
  const isFirstRender = useRef(true);

  // Boucle : à intervalle régulier, on floute/efface les mots courants,
  // puis on change le contenu (ce qui déclenche l'effet ci-dessous pour
  // l'entrée du nouveau mot).
  useEffect(() => {
    const interval = setInterval(() => {
      const targets = [wordARef.current, wordBRef.current].filter(
        Boolean
      ) as HTMLSpanElement[];

      gsap.to(targets, {
        filter: `blur(${BLUR_AMOUNT}px)`,
        opacity: 0,
        y: -6,
        duration: EXIT_DURATION,
        ease: "power2.in",
        onComplete: () => {
          setIndex((i) => (i + 1) % PHRASES.length);
        },
      });
    }, HOLD_DURATION + EXIT_DURATION * 1000 + ENTER_DURATION * 1000);

    return () => clearInterval(interval);
  }, []);

  // À chaque changement de mot (nouveau contenu déjà dans le DOM),
  // on anime l'entrée : flou -> net, léger déplacement vertical, fade in.
  useEffect(() => {
    const targets = [wordARef.current, wordBRef.current].filter(
      Boolean
    ) as HTMLSpanElement[];
    if (targets.length === 0) return;

    gsap.fromTo(
      targets,
      {
        filter: `blur(${BLUR_AMOUNT}px)`,
        opacity: 0,
        y: isFirstRender.current ? 0 : 8,
      },
      {
        filter: "blur(0px)",
        opacity: 1,
        y: 0,
        duration: ENTER_DURATION,
        ease: "power3.out",
      }
    );
    isFirstRender.current = false;
  }, [index]);

  const current = PHRASES[index];

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F1F8F3] px-6">
      <h1 className="max-w-3xl text-center font-serif text-4xl font-black leading-[1.15] tracking-tight text-[#0F2E1F] sm:text-5xl md:text-6xl">
        Je transforme vos idées
        <br />
        en{" "}
        <span
          ref={wordARef}
          className="inline-block text-[#22A559] will-change-transform"
        >
          {current.a}
        </span>
        <br />
        qui{" "}
        <span
          ref={wordBRef}
          className="inline-block text-[#22A559] will-change-transform"
        >
          {current.b}
        </span>{" "}
        vite.
      </h1>
    </section>
  );
}