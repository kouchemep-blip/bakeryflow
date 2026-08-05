"use client";

import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import type { IconType } from "react-icons";

type Props = {
  label?: string;
  onClick?: () => void;
  icon?: IconType;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function DiscoverButton({
  label = "DISCOVER OUR PLATFORM",
  onClick,
  icon: Icon = FaArrowRight,
  type = "button",
  disabled = false,
}: Props) {
  const [hovered, setHovered] = useState(false);
  
  // "idle" (repos), "enter" (survol), "leave" (sortie du survol)
  const [animState, setAnimState] = useState<"idle" | "enter" | "leave">("idle");

  // Détection du type de flèche pour orienter l'animation
const isLeftArrow = Icon.name === "FaArrowLeft";

  // Gestionnaires d'événements directs (Plus besoin de useEffect !)
  const handleMouseEnter = () => {
    setHovered(true);
    setAnimState("enter");
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setAnimState("leave");
  };

  // Définition des classes d'animation CSS selon le sens de la flèche
  let animationClass = "";
  if (animState === "enter") {
    animationClass = isLeftArrow ? "animate-arrow-left-enter" : "animate-arrow-right-enter";
  } else if (animState === "leave") {
    animationClass = isLeftArrow ? "animate-arrow-left-leave" : "animate-arrow-right-leave";
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className="flex items-stretch gap-2 cursor-pointer mt-2 select-none disabled:cursor-not-allowed disabled:opacity-60"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Injection des Keyframes CSS dynamiques */}
      <style jsx global>{`
        /* ─── FLÈCHE VERS LA DROITE (FaArrowRight) ─── */
        @keyframes arrowRightEnter {
          0% { transform: translateX(0); opacity: 1; }
          40% { transform: translateX(28px); opacity: 0; }
          41% { transform: translateX(-28px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes arrowRightLeave {
          0% { transform: translateX(0); opacity: 1; }
          40% { transform: translateX(-28px); opacity: 0; }
          41% { transform: translateX(28px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        /* ─── FLÈCHE VERS LA GAUCHE (FaArrowLeft) ─── */
        @keyframes arrowLeftEnter {
          0% { transform: translateX(0); opacity: 1; }
          40% { transform: translateX(-28px); opacity: 0; }
          41% { transform: translateX(28px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes arrowLeftLeave {
          0% { transform: translateX(0); opacity: 1; }
          40% { transform: translateX(28px); opacity: 0; }
          41% { transform: translateX(-28px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        /* Classes d'activation */
        .animate-arrow-right-enter { animation: arrowRightEnter 550ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-arrow-right-leave { animation: arrowRightLeave 550ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-arrow-left-enter { animation: arrowLeftEnter 550ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-arrow-left-leave { animation: arrowLeftLeave 550ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>

      {/* ── Bouton texte ── */}
      <div
        className="relative overflow-hidden flex items-center justify-center px-6 py-4"
        style={{
          backgroundColor: hovered ? "#d2f99d" : "#1e292b",
          borderRadius: hovered
            ? "24px 80px 24px 24px / 24px 100px 24px 24px"
            : "24px 24px 80px 24px / 24px 24px 100px 24px",
          transition: "background-color 500ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 800ms cubic-bezier(0.22, 1, 0.36, 1)",
          minWidth: "150px",
        }}
      >
        <span
          className="font-merienda text-[13px] tracking-[0.18em] font-medium whitespace-nowrap relative z-10"
          style={{
            color: hovered ? "#1e292b" : "#ffffff",
            transition: "color 400ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {label}
        </span>
      </div>

      {/* ── Bloc flèche ── */}
      <div
        className="relative flex items-center justify-center w-14 px-3 overflow-hidden"
        style={{
          backgroundColor: hovered ? "#1e292b" : "#d2f99d",
          borderRadius: hovered
            ? "24px 24px 24px 80px / 24px 24px 24px 80px"
            : "80px 24px 24px 24px / 80px 24px 24px 24px",
          transition: "background-color 500ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 800ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div 
          className={`text-lg flex items-center justify-center ${animationClass}`}
          style={{
            color: hovered ? "#ffffff" : "#1e292b",
            transition: "color 400ms ease",
          }}
        >
          <Icon size={14} />
        </div>
      </div>
    </button>
  );
}
