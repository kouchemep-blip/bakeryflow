"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Star, Flame, Leaf, Sparkles, TrendingUp } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cart.store";
import { getAverageRating } from "@/types/products";
import type { ProductWithCategoryAndReviews } from "@/types/products";

// ─── Tags visuels ─────────────────────────────────────────────────────────────
// Logique simple basée sur les données existantes (pas de champ tag en DB)
// Extension future : ajouter un champ tags[] dans le modèle Prisma

type Tag = {
  label: string;
  color: string;
  icon: React.ReactNode;
};

function resolveTags(product: ProductWithCategoryAndReviews): Tag[] {
  const tags: Tag[] = [];
  const avg = getAverageRating(product.reviews);

  // Nouveau : créé dans les 7 derniers jours
  const isNew =
    new Date(product.createdAt).getTime() >
    Date.now() - 7 * 24 * 60 * 60 * 1000;

  // Populaire : note ≥ 4.5 avec au moins 3 avis
  const isPopular = avg !== null && avg >= 4.5 && product.reviews.length >= 3;

  // Végé : détection naïve par nom/description (à affiner selon ton catalogue)
  const isVege = /salade|végé|vegan|légume/i.test(
    product.name + product.description
  );

  // Épicé : détection par nom/description
  const isSpicy = /épicé|pimenté|harissa|spicy/i.test(
    product.name + product.description
  );

  if (isNew)     tags.push({ label: "Nouveau",   color: "bg-blue-500",   icon: <Sparkles size={10} /> });
  if (isPopular) tags.push({ label: "Populaire", color: "bg-orange-500", icon: <TrendingUp size={10} /> });
  if (isVege)    tags.push({ label: "Végé",      color: "bg-green-500",  icon: <Leaf size={10} /> });
  if (isSpicy)   tags.push({ label: "Épicé",     color: "bg-red-500",    icon: <Flame size={10} /> });

  return tags;
}

// ─── Props ────────────────────────────────────────────────────────────────────

type ProductCardProps = {
  product: ProductWithCategoryAndReviews;
  // Ref du bouton panier pour l'animation fly-to-cart (étape 5)
  cartButtonRef?: React.RefObject<HTMLElement>;
  // Callback déclenché après ajout (pour fly-to-cart)
  onAddToCart?: (productEl: HTMLElement) => void;
};

// ─── Composant ────────────────────────────────────────────────────────────────

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const addItem    = useCartStore((state) => state.addItem);
  const openDrawer = useCartStore((state) => state.openDrawer);

  // Feedback bouton : idle | added (check) | back à idle après 1.5s
  const [btnState, setBtnState] = useState<"idle" | "added">("idle");

  const isUnavailable = product.status === "UNAVAILABLE";
  const avgRating     = getAverageRating(product.reviews);
  const tags          = resolveTags(product);

  // Ref sur l'image pour passer au fly-to-cart
  const imageRef = useState<HTMLDivElement | null>(null);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isUnavailable || btnState === "added") return;

    addItem({
      product: {
        id:         product.id,
        name:       product.name,
        image:      product.image,
        price:      product.price,
        categoryId: product.categoryId,
      },
    });

    // Feedback check temporaire
    setBtnState("added");
    setTimeout(() => setBtnState("idle"), 1500);

    // Déclenche fly-to-cart si le parent le gère (étape 5)
    if (onAddToCart && imageRef[0]) {
      onAddToCart(imageRef[0]);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={[
        "relative flex flex-col rounded-2xl overflow-hidden",
        "bg-white shadow-sm border border-gray-100",
        "hover:shadow-md transition-shadow duration-300",
        isUnavailable ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {/* ── Image ────────────────────────────────────────────────────────── */}
      <div
        ref={(el) => { imageRef[1](el); }}
        className="relative w-full h-48 overflow-hidden bg-gray-50"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={[
            "object-cover transition-transform duration-500",
            isUnavailable ? "" : "group-hover:scale-105",
          ].join(" ")}
        />

        {/* Rupture de stock overlay */}
        {isUnavailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
              Rupture de stock
            </span>
          </div>
        )}

        {/* Tags visuels */}
        {tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className={[
                  "flex items-center gap-1 px-2 py-0.5 rounded-full",
                  "text-white text-[10px] font-semibold",
                  tag.color,
                ].join(" ")}
              >
                {tag.icon}
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Contenu ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-2">

        {/* Catégorie */}
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {product.category.name}
        </span>

        {/* Nom */}
        <h3 className="text-gray-900 font-semibold text-base leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Note */}
        {avgRating !== null && (
          <div className="flex items-center gap-1">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-700">{avgRating}</span>
            <span className="text-xs text-gray-400">
              ({product.reviews.length} avis)
            </span>
          </div>
        )}

        {/* Prix + bouton ajout */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString("fr-FR")} FCFA
          </span>

          {/* Bouton ajout — feedback check animé */}
          <motion.button
            onClick={handleAdd}
            disabled={isUnavailable}
            whileTap={isUnavailable ? {} : { scale: 0.88 }}
            aria-label={`Ajouter ${product.name} au panier`}
            className={[
              "flex items-center justify-center w-10 h-10 rounded-full",
              "transition-colors duration-200",
              isUnavailable
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : btnState === "added"
                ? "bg-green-500 text-white"
                : "bg-gray-900 text-white hover:bg-amber-500",
            ].join(" ")}
          >
            <AnimatePresence mode="wait" initial={false}>
              {btnState === "added" ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check size={16} strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ShoppingCart size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}