"use client";
import { useEffect, useState } from "react";
import { HERO_SLIDES } from "@/components/landing/contactSlide";
type UseHeroSliderReturn = {
  activeIndex: number;
};

export function useHeroSlider(): UseHeroSliderReturn {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        return (prev + 1) % HERO_SLIDES.length;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  return {
    activeIndex,
  };
}
