"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cart.store";
import type { CartItem as CartItemType } from "@/features/cart/cart.types";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const addItem = useCartStore((state) => state.addItem);
  const removeOne = useCartStore((state) => state.removeOne);
  const removeLine = useCartStore((state) => state.removeLine);

  const handleIncrement = () => {
    addItem({ product: item.product, options: item.options });
  };

  const handleDecrement = () => {
    removeOne(item.cartItemId);
  };

  const handleRemove = () => {
    removeLine(item.cartItemId);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-3 py-4 border-b border-gray-100 last:border-0"
    >
      {/* ── Image produit ──────────────────────────────────────────────────── */}
      {/* Remplace le bloc Image dans CartItem : */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-amber-50">
            <span className="text-2xl">🍞</span>
          </div>
        )}
      </div>

      {/* ── Détails ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          {/* Nom */}
          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
            {item.product.name}
          </p>

          {/* Bouton suppression ligne */}
          <button
            onClick={handleRemove}
            aria-label={`Supprimer ${item.product.name}`}
            className="flex-shrink-0 p-1 text-gray-300 hover:text-red-400 transition-colors duration-150"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Options choisies (taille, supplément…) */}
        {item.options.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.options.map((opt) => (
              <span
                key={`${opt.label}:${opt.value}`}
                className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"
              >
                {opt.label} : {opt.value}
                {opt.priceModifier > 0 && (
                  <> +{opt.priceModifier.toLocaleString("fr-FR")} FCFA</>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Prix + contrôle quantité */}
        <div className="flex items-center justify-between mt-1">
          {/* Prix ligne */}
          <span className="text-sm font-bold text-gray-900">
            {item.totalPrice.toLocaleString("fr-FR")} FCFA
          </span>

          {/* Contrôle quantité */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleDecrement}
              aria-label="Retirer un article"
              className={[
                "w-7 h-7 rounded-full flex items-center justify-center",
                "border border-gray-200 text-gray-500",
                "hover:border-red-300 hover:text-red-400",
                "transition-colors duration-150",
              ].join(" ")}
            >
              <Minus size={12} strokeWidth={2.5} />
            </motion.button>

            {/* Quantité — animée à chaque changement */}
            <motion.span
              key={item.quantity}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="w-5 text-center text-sm font-semibold text-gray-900"
            >
              {item.quantity}
            </motion.span>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleIncrement}
              aria-label="Ajouter un article"
              className={[
                "w-7 h-7 rounded-full flex items-center justify-center",
                "border border-gray-200 text-gray-500",
                "hover:border-amber-400 hover:text-[#EA580C]",
                "transition-colors duration-150",
              ].join(" ")}
            >
              <Plus size={12} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
