"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import { Wheat } from "lucide-react";
import Image from "next/image";

// Modification des URLs pour correspondre aux pages créées précédemment
const NAV_LINKS = [
  { label: "ACCUEIL", href: "/" },
  { label: "A VENIR", href: "/coming-soon" },
  { label: "FAQs", href: "/faqs" },
  { label: "NOUS TROUVER", href: "/find-us" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // États pour stocker la position et la taille du background dynamique
  const [bgStyle, setBgStyle] = useState({ width: 0, left: 0 });

  // Références pour cibler la liste et les éléments de la navbar
  const containerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. On trouve d'abord l'élément <a> actif
    const activeLinkElement = containerRef.current.querySelector(
      `a[data-active="true"]`,
    ) as HTMLElement;

    if (activeLinkElement) {
      // CORRECTION : On récupère le parent <li> pour avoir le bon offsetLeft dans le <ul>
      const parentLi = activeLinkElement.parentElement as HTMLElement;

      setBgStyle({
        width: parentLi.offsetWidth,
        left: parentLi.offsetLeft,
      });
    } else {
      // Fallback sur le premier item (Accueil)
      const firstLi = containerRef.current.querySelector("li") as HTMLElement;
      if (firstLi) {
        setBgStyle({
          width: firstLi.offsetWidth,
          left: firstLi.offsetLeft,
        });
      }
    }
  }, [pathname]); // Se déclenche à chaque changement d'URL

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="hidden md:flex flex-row items-center h-[23vh]">
        <div className="relative left-8 h-full w-[26vw] shrink-0 text-white group">
          {/* Le lien englobe tout le bloc pour rendre l'ensemble cliquable proprement */}
          <Link href="/" className="block h-full w-full relative">
            {/* Fond SVG graphique */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 450 420"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,0 L 450,0 Q 370,0 370,80 L 370,190 Q 370,270 290,270 L 180,270 Q 40,270 0,420 Z"
                fill="currentColor"
              />
            </svg>

            {/* Zone invisible superposée qui centre parfaitement l'image sur grand écran */}
            <div className="absolute inset-0 hidden md:flex items-center justify-center">
              <Image
                src="/logo.jpg"
                alt="Logo BakeryFlow"
                width={250} // Augmenté légèrement pour un meilleur rendu sur grand écran
                height={150}
                className="object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          </Link>
        </div>

        {/* Repositionnement centré absolu avec l'effet de flou et de bordure */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 flex items-center gap-3 rounded-full h-[10vh] border border-white/40 bg-white/40 backdrop-blur-md px-3 py-2 shadow-lg hover:bg-white/60 transition">
          <ul
            ref={containerRef}
            className="flex flex-row gap-4 xl:gap-8 items-center justify-center relative py-2 px-4"
          >
            {/* LE FOND COULISSANT - Suit maintenant parfaitement le parent <li> */}
            <div
              className="absolute bg-[#EA580C] rounded-full h-full transition-all duration-300 ease-out z-0"
              style={{
                width: `${bgStyle.width}px`,
                left: `${bgStyle.left}px`,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />

            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                /* Note: La classe relative est conservée pour le z-index, mais l'offset est calculé sur le li entier */
                <li key={link.href} className="relative z-10">
                  <Link
                    href={link.href}
                    data-active={isActive}
                    className={`text-sm font-bold block px-5 py-2.5 rounded-full transition-colors duration-300 ${
                      isActive ? "text-white" : "text-gray-800 hover:text-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bouton droite */}
        <div className="absolute right-6 top-4">
          <UserMenu />
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="flex md:hidden items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="mb-8 hidden items-center gap-2 px-2 md:flex">
          <Image
            src="/logo.jpg"
            alt="Logo BakeryFlow"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-[15px] font-semibold tracking-tight text-[#F5F1EA]">
            BakeryFlow
          </span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span
            className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Menu mobile déroulant */}
      <div
        className={`md:hidden flex flex-col bg-white/95 backdrop-blur-md px-6 overflow-hidden transition-all duration-400 ease-in-out ${
          menuOpen ? "max-h-96 py-6" : "max-h-0 py-0"
        }`}
      >
        <ul className="flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <li
              key={link.href}
              className="text-sm font-medium text-gray-800 hover:text-black cursor-pointer border-b border-gray-100 pb-4 last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              <Link href={link.href} className="block w-full">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
