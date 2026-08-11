"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import { Menu, Wheat, X } from "lucide-react";

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

    const activeLinkElement = containerRef.current.querySelector(
      `a[data-active="true"]`,
    ) as HTMLElement;

    if (activeLinkElement) {
      const parentLi = activeLinkElement.parentElement as HTMLElement;
      setBgStyle({
        width: parentLi.offsetWidth,
        left: parentLi.offsetLeft,
      });
    } else {
      const firstLi = containerRef.current.querySelector("li") as HTMLElement;
      if (firstLi) {
        setBgStyle({
          width: firstLi.offsetWidth,
          left: firstLi.offsetLeft,
        });
      }
    }
  }, [pathname]);

  // Fermer le menu mobile lors d'un changement de page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* ── Structure Desktop (md et plus) ── */}
      <div className="hidden md:flex flex-row items-center h-[23vh]">
        <div className="relative left-8 h-full w-[26vw] shrink-0 text-[#F5EFE6] group">
          <Link href="/" className="block h-full w-full relative">
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
            <div className="absolute top-6 left-4 flex items-center gap-2 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EA580C]">
                <Wheat className="h-6 w-6 text-[#161310]" strokeWidth={2} />
              </div>
              <span className="text-[35px] font-semibold tracking-tight text-black">
                BakeryFlow
              </span>
            </div>
          </Link>
        </div>

        {/* Liens de navigation centrés */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 flex items-center gap-3 rounded-full h-[10vh] border border-white/40 bg-white/40 backdrop-blur-md px-3 py-2 shadow-lg hover:bg-white/60 transition">
          <ul
            ref={containerRef}
            className="flex flex-row gap-4 xl:gap-8 items-center justify-center relative py-2 px-4"
          >
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

        {/* Menu utilisateur desktop */}
        <div className="absolute right-6 top-5">
          <UserMenu />
        </div>
      </div>

      {/* ── Structure Mobile & Tablette (En dessous de md) ── */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 shadow-sm h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EA580C]">
            <Wheat className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            BakeryFlow
          </span>
        </Link>

        {/* Actions à droite : Menu utilisateur + Bouton Burger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer text-slate-800"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {/* Icône Menu Burger */}
            <div
              className={`absolute transition-all duration-300 transform ${
                menuOpen
                  ? "scale-0 rotate-90 opacity-0"
                  : "scale-100 rotate-0 opacity-100"
              }`}
            >
              <Menu size={20} strokeWidth={2.5} />
            </div>

            {/* Icône Croix de fermeture */}
            <div
              className={`absolute transition-all duration-300 transform ${
                menuOpen
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-0 -rotate-90 opacity-0"
              }`}
            >
              <X size={20} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant fluide */}
      <div
        className={`md:hidden absolute w-full left-0 bg-[#F5EFE6] shadow-2xl transition-all duration-300 ease-in-out border-b border-neutral-200 overflow-visible ${
          menuOpen
            ? "max-h-72 opacity-100 py-5"
            : "max-h-0 opacity-0 py-0 pointer-events-none"
        }`}
      >
        <div className="flex w-full flex-col items-center px-6">
          <div className="w-full flex justify-center">
            <UserMenu />
          </div>

          <ul className="flex w-full flex-col items-center">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li
                  key={link.href}
                  className="w-full flex flex-col items-center"
                >
                  <div className="mt-2 h-px w-15 bg-black/60" />
                  <Link
                    href={link.href}
                    className={`flex w-full items-center justify-center py-3 text-center text-sm font-bold border-b border-neutral-200/60 last:border-0 transition-colors ${
                      isActive
                        ? "text-[#EA580C]"
                        : "text-gray-700 hover:text-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
