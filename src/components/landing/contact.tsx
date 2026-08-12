import ScrollMaskReveal from "@/components/common/Scrollmaskreveal";
import ScrollParallaxShowcase from "./textAnime";

// Modification de la structure pour inclure la couleur de chaque ligne
const HEADLINE_LINES = [
  { text: "Vous voulez" },
  { text: "plutôt faire", color: "text-black/60" },
  { text: "une Réservation ?", color: "text-[#EA580C]" },
];
export default function Contact() {
  return (
    <main
      className="bg-[#F5EFE6] text-black"
      style={
        {
          "--reveal-mask-bg": "#F5EFE6",
        } as React.CSSProperties
      }
    >
      <section className="sticky top-0 flex min-h-screen bg-[#F5EFE6] flex-col justify-center px-6 md:px-16 lg:px-24">
        <ScrollMaskReveal
          lines={HEADLINE_LINES}
          className="max-w-4xl"
          lineClassName="text-4xl font-semibold leading-tight md:text-6xl tracking-tight"
          stagger={0.18}
          duration={1}
          start="top 75%"
          end="bottom 45%"
          scrub={0.6}
        />
        <ScrollParallaxShowcase />
      </section>
    </main>
  );
}
