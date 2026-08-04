"use client";
// Animation "miniature qui vole vers le panier" au clic sur Ajouter
// Principe : clone visuel de l'image produit, animé de sa position
// vers la position du bouton panier, puis disparaît

import { animate } from "framer-motion";

type FlyToCartOptions = {
  // Élément source (image produit cliquée)
  sourceEl: HTMLElement;
  // Élément cible (bouton panier fixe)
  targetEl: HTMLElement;
  // URL image du produit
  imageSrc: string;
  // Callback déclenché quand l'animation est terminée
  onComplete?: () => void;
};

// Fonction utilitaire — appelée depuis ProductCard via onAddToCart
// Pas un composant React car elle manipule le DOM directement pour les perfs
export function flyToCart({
  sourceEl,
  targetEl,
  imageSrc,
  onComplete,
}: FlyToCartOptions) {
  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();

  // ── Crée le clone visuel ───────────────────────────────────────────────────
  const clone = document.createElement("img");
  clone.src = imageSrc;

  Object.assign(clone.style, {
    position:     "fixed",
    top:          `${sourceRect.top}px`,
    left:         `${sourceRect.left}px`,
    width:        `${sourceRect.width}px`,
    height:       `${sourceRect.height}px`,
    borderRadius: "12px",
    objectFit:    "cover",
    pointerEvents: "none",
    zIndex:       "9999",
    opacity:      "1",
  });

  document.body.appendChild(clone);

  // ── Calcule la destination (centre du bouton panier) ──────────────────────
  const targetX = targetRect.left + targetRect.width / 2 - sourceRect.width / 2;
  const targetY = targetRect.top  + targetRect.height / 2 - sourceRect.height / 2;

  // ── Anime le clone : position + shrink + fade ─────────────────────────────
  animate(
    clone,
    {
      x:       [0, targetX - sourceRect.left],
      y:       [0, targetY - sourceRect.top],
      scale:   [1, 0.15],
      opacity: [1, 0],
    },
    {
      duration: 0.65,
      ease:     [0.16, 1, 0.3, 1],
      onComplete: () => {
        clone.remove();
        onComplete?.();
      },
    }
  );
}
