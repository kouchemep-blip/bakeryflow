"use client";
import Image from "next/image";

export type HeroSlide = {
  id: number;
  image: string;
  alt: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "/images/wedding.jpg",
    alt: "Patiente souriante dans un cabinet dentaire",
  },
  {
    id: 2,
    image: "/images/ceromony.jpg",
    alt: "Patiente souriante dans un cabinet dentaire",
  },
  {
    id: 3,
    image: "/images/birthday.jpg",
    alt: "Patiente souriante dans un cabinet dentaire",
  },
  {
    id: 4,
    image: "/images/family.jpg",
    alt: "Patiente souriante dans un cabinet dentaire",
  },
];

type HeroSliderProps = {
  slides: HeroSlide[];
  activeIndex: number;
};

export function HeroSlider({ slides, activeIndex }: HeroSliderProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={[
            "absolute inset-0",
            "transition-opacity duration-[1200ms] ease-in-out",
            index === activeIndex ? "animate-ken-burns" : "",
            index === activeIndex ? "opacity-100" : "opacity-0",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  );
}
