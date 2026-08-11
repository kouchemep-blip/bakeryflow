import ScrollMaskReveal from "@/components/common/Scrollmaskreveal";

const HEADLINE_LINES = [
  "Bold research to unlock",
  "small molecules that solve",
  "large, unmet medical needs.",
];

export default function Home() {
  return (
    <main
      className="min-h-[300vh] bg-[#F5EFE6] text-white"
      style={
        {
          // Le masque de ScrollMaskReveal lit cette variable :
          // elle doit toujours matcher le fond visible derrière le texte.
          "--reveal-mask-bg": "#F5EFE6",
        } as React.CSSProperties
      }
    >
      {/* Espace de scroll avant la section, pour arriver dessus naturellement */}
      <div className="h-[40vh] bg-[#F5EFE6]" />

      <section className="sticky top-0 flex min-h-screen bg-[#F5EFE6] flex-col justify-center px-6 md:px-16 lg:px-24">
        <p className="mb-6 text-xs tracking-[0.25em] uppercase text-[#8CA78C]">
          01 — Recherche
        </p>

        <ScrollMaskReveal
          lines={HEADLINE_LINES}
          className="max-w-4xl"
          lineClassName="font-serif text-[9vw] md:text-[5vw] lg:text-[4.2rem] leading-[1.08] tracking-tight"
          stagger={0.18}
          duration={1}
          start="top 75%"
          end="bottom 45%"
          scrub={0.6}
        />
      </section>

      {/* Espace de scroll après la section, pour laisser le temps au reveal */}
      <div className="h-[60vh] bg-transparent" />
    </main>
  );
}