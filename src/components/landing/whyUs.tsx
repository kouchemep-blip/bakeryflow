"use client";

import ScrollMaskReveal from "../common/Scrollmaskreveal";

const LINES = [
  "Des ingrédients frais, sélectionnés avec exigence pour garantir une cuisine savoureuse.",
  "Des recettes préparées avec soin, pour offrir des plats généreux et réguliers.",
  "Un service attentif et chaleureux, pensé pour que chaque visite soit agréable.",
  "Une ambiance conviviale et élégante, idéale pour un repas en couple, en famille ou entre amis.",
  "Une expérience simple et rassurante, du choix du plat jusqu’au service à table.",
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F5EFE6] text-[#2B1B17]">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
        <div className="mb-12 max-w-2xl">
          <span className="mb-4 block font-mono text-xs uppercase tracking-[0.35em] text-[#EA580C]">
            Pourquoi nous choisir
          </span>

          <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
            Une cuisine qui inspire confiance.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#6B4B40] md:text-lg">
            Nous mettons l’accent sur la qualité, la constance et l’accueil pour
            que chaque client se sente bien dès les premières secondes.
          </p>
        </div>

        <ScrollMaskReveal
          lines={LINES}
          className="space-y-6"
          lineClassName="block text-2xl md:text-4xl font-medium leading-tight text-[#2B1B17]"
          maskColor="#F5EFE6"
          stagger={0.18}
          duration={1}
          start="top 75%"
          end="bottom 35%"
          scrub={0.7}
        />
      </div>
    </section>
  );
}