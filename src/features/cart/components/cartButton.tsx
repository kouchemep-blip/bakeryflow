"use client";
// Bouton panier fixe — coin inférieur droit
// Apparaît au 1er ajout, badge compteur animé à chaque incrément

import { forwardRef, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/features/cart/store/cart.store";
import { FaShoppingCart } from "react-icons/fa";

export const CartButton = forwardRef<HTMLButtonElement>((_, ref) => {
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());
  const openDrawer = useCartStore((state) => state.openDrawer);

  // Garde la valeur précédente du badge pour détecter un incrément
  const prevCountRef = useRef(totalItems);
  const [badgeBump, setBadgeBump] = useState(false);

  useEffect(() => {
    if (totalItems > prevCountRef.current) {
      // Déclenche l'animation spring du badge
      setBadgeBump(true);
      setTimeout(() => setBadgeBump(false), 400);
    }
    prevCountRef.current = totalItems;
  }, [totalItems]);

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          ref={ref}
          onClick={openDrawer}
          // Apparition au 1er ajout : bounce depuis le bas
          initial={{ y: 80, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          aria-label={`Ouvrir le panier — ${totalItems} article${totalItems > 1 ? "s" : ""}`}
          className={[
            "fixed bottom-6 right-6 z-50 cursor-pointer",
            "flex items-center gap-3",
            "bg-gray-900 text-white",
            "pl-4 pr-5 py-3 rounded-full",
            "shadow-xl hover:bg-[#EA580C]",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C] focus-visible:ring-offset-2",
          ].join(" ")}
        >
          {/* Icône panier + badge compteur */}
          <div className="relative">
            <FaShoppingCart size={20} />

            {/* Remplace le badge compteur dans CartButton — fix spring 3 keyframes : */}
            <motion.span
              key={totalItems}
              animate={
                badgeBump
                  ? {
                      scale: [1, 1.5, 1],
                      transition: {
                        duration: 0.4,
                        // tween supporte 3 keyframes, pas spring
                        ease: "easeOut",
                      },
                    }
                  : { scale: 1 }
              }
              className={[
                "absolute -top-2 -right-2",
                "w-5 h-5 rounded-full",
                "bg-[#EA580C] text-white text-[10px] font-bold",
                "flex items-center justify-center",
                "border-1 border-gray-900",
              ].join(" ")}
            >
              {totalItems > 99 ? "99+" : totalItems}
            </motion.span>
          </div>

          {/* Prix total */}
          <span className="text-sm font-semibold">
            {totalPrice.toLocaleString("fr-FR")} FCFA
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
});

CartButton.displayName = "CartButton";
