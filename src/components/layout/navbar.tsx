"use client";

import { useState } from "react";
import { DiscoverButton } from "../ui/DiscoverBtn";
import Link from "next/link";

const NAV_LINK = ["Services", "Sites", "About", "Contact", "Ressource"];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="hidden md:flex flex-row items-center h-[23vh]">
        <div className="relative left-8 h-full w-[26vw] shrink-0 text-white/80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 450 420"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <Link href={"/"}>
              <path
                d="M 0,0 L 450,0 Q 370,0 370,80 L 370,190 Q 370,270 290,270 L 180,270 Q 40,270 0,420 Z"
                fill="currentColor"
              />
            </Link>
          </svg>
        </div>

        {/* Liens centrés — effet glass */}
        <div className="glass-nav absolute left-1/2 -translate-x-1/2 top-4 w-[45%] h-[10vh] rounded-full flex items-center justify-center">
          <ul className="flex flex-row uppercase gap-10 xl:gap-20 items-center justify-center relative z-10">
            {NAV_LINK.map((link) => (
              <li
                key={link}
                className="text-sm font-bold text-gray-800 hover:text-black cursor-pointer transition-colors"
              >
                {link}
              </li>
            ))}
          </ul>
        </div>

        {/* Bouton droite */}
        <div className="absolute right-6 top-2 -translate-y-1/2">
          <Link href={"/inscription"}>
            <DiscoverButton label="SE CONNECTER" />
          </Link>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="flex md:hidden items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <span className="font-bold text-gray-900 text-lg">Logo</span>

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
          {NAV_LINK.map((link) => (
            <li
              key={link}
              className="text-sm font-medium uppercase text-gray-800 hover:text-black cursor-pointer border-b border-gray-100 pb-4 last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </li>
          ))}
        </ul>
        <div className="">
          <Link href={"/inscription"}>
            <DiscoverButton label="SE CONNECTER" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .glass-nav {
          background: rgba(255, 255, 255, 0.35);
          backdrop-filter: url(#glass-distortion) blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.5);
          overflow: hidden;
          transition:
            transform 0.5s ease,
            box-shadow 0.5s ease;
        }

        .glass-nav::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -60%;
          width: 60%;
          height: 200%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent
          );
          transform: rotate(15deg);
          animation: sweep 6s ease-in-out infinite;
        }

        .glass-nav:hover {
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.15),
            inset 0 1px 1px rgba(255, 255, 255, 0.6);
        }

        @keyframes sweep {
          0% {
            left: -60%;
          }
          50% {
            left: 120%;
          }
          100% {
            left: 120%;
          }
        }
      `}</style>
    </div>
  );
}
