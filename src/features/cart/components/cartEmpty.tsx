"use client";
import { motion } from "framer-motion";
import { ShoppingBasket } from "lucide-react";

type CartEmptyProps = {
  onClose: () => void;
};

export function CartEmpty({ onClose }: CartEmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center gap-5 py-20 px-8 text-center"
    >
      {/* Icône animée */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center"
      >
        <ShoppingBasket size={36} className="text-amber-400" />
      </motion.div>

      <div className="flex flex-col gap-1">
        <p className="text-gray-800 font-semibold text-base">
          Votre panier est vide
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Ajoutez des produits pour commencer votre commande.
        </p>
      </div>

      <button
        onClick={onClose}
        className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-amber-500 transition-colors duration-200"
      >
        Voir la carte
      </button>
    </motion.div>
  );
}