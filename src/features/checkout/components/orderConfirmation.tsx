"use client";
// Écran de confirmation post-commande
// Affiché après createOrder() réussie, avant redirection espace client

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/store/cart.store";

type OrderConfirmationProps = {
  orderId: number;
  totalPrice: number;
  itemCount: number;
  onClose: () => void;
};

export function OrderConfirmation({
  orderId,
  totalPrice,
  itemCount,
  onClose,
}: OrderConfirmationProps) {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  // Vide le panier Zustand côté client après confirmation
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleGoToDashboard = () => {
    onClose();
    router.push("/client");
  };

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        key="confirm-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
      />

      {/* Modale confirmation */}
      <motion.div
        key="confirm-modal"
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 24 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className={[
          "fixed z-[90] bg-white rounded-2xl shadow-2xl",
          "w-full max-w-sm mx-auto px-8 py-10",
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "max-sm:top-auto max-sm:bottom-0 max-sm:left-0",
          "max-sm:translate-x-0 max-sm:translate-y-0",
          "max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:max-w-full",
        ].join(" ")}
      >
        {/* ── Checkmark animé ───────────────────────────────────────────── */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            {/* Cercle de fond pulsant */}
            {/* Remplace l'animation du cercle de fond : */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="absolute inset-0 bg-green-100 rounded-full"
            />
            {/* Icône check */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.4,
                type: "spring",
                stiffness: 300,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <CheckCircle
                size={44}
                className="text-green-500"
                strokeWidth={1.5}
              />
            </motion.div>
          </div>
        </div>

        {/* ── Texte ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex flex-col items-center gap-2 text-center mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900">
            Commande confirmée !
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Merci pour ta commande. Nous allons la préparer avec soin.
          </p>
        </motion.div>

        {/* ── Récap commande ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="bg-gray-50 rounded-xl px-5 py-4 flex flex-col gap-2 mb-6"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Numéro de commande</span>
            <span className="font-semibold text-gray-900">#{orderId}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {itemCount} article{itemCount > 1 ? "s" : ""}
            </span>
            <span className="font-semibold text-gray-900">
              {totalPrice.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Livraison</span>
            <span className="text-green-500 font-medium">Gratuite</span>
          </div>
        </motion.div>

        {/* ── Temps estimé ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="flex items-center gap-2 justify-center text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-3 mb-8"
        >
          <Clock size={15} />
          <span>Préparation estimée : 15 à 30 min</span>
        </motion.div>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex flex-col gap-3"
        >
          {/* Aller à l'espace client */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGoToDashboard}
            className={[
              "w-full py-3.5 rounded-full",
              "bg-gray-900 text-white text-sm font-semibold",
              "hover:bg-amber-500 transition-colors duration-200",
              "flex items-center justify-center gap-2",
            ].join(" ")}
          >
            Suivre ma commande
            <ChevronRight size={15} />
          </motion.button>

          {/* Continuer les achats */}
          <button
            onClick={onClose}
            className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            Continuer mes achats
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
