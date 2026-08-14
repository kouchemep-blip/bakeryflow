"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Info, MessageSquare, ShoppingCart, Star, X } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cart.store";
import { getAverageRating } from "@/types/products";
import type { ProductWithCategoryAndReviews } from "@/types/products";

type Props = {
  product: ProductWithCategoryAndReviews | null;
  onClose: () => void;
  onAddToCart: (source: HTMLElement, image: string) => void;
};

type Tab = "details" | "avis";

export function ProductDetailsModal({ product, onClose, onAddToCart }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<Tab>("details");

  useEffect(() => {
    if (!product) return;
    setTab("details"); // repart sur "Détails" à chaque nouvelle ouverture
    const closeOnEscape = (event: KeyboardEvent) =>
      event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [product, onClose]);

  const addToCart = () => {
    if (!product || !addButtonRef.current) return;
    addItem({
      product: {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        categoryId: product.categoryId,
      },
    });
    onAddToCart(addButtonRef.current, product.image);
  };

  const rating = product ? getAverageRating(product.review) : null;

  const tabs: { id: Tab; label: string; icon: typeof Info }[] = [
    { id: "details", label: "Détails", icon: Info },
    { id: "avis", label: "Avis", icon: MessageSquare },
  ];

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#2B1B17]/50 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-details-title"
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-[#F5EFE6] shadow-2xl sm:h-[560px] sm:flex-row sm:rounded-3xl"
            initial={{ y: 32 }}
            animate={{ y: 0 }}
            exit={{ y: 32 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* Fermer */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer la fiche produit"
              className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-[#2B1B17] shadow-sm hover:bg-white"
            >
              <X size={18} />
            </button>

            {/* Image plein cadre */}
            <div className="relative h-56 w-full shrink-0 sm:h-full sm:w-[38%]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 38vw"
                className="object-cover sm:rounded-l-3xl"
              />
            </div>

            {/* Rail d'onglets — vertical sur desktop, barre horizontale sur mobile */}
            <div className="flex shrink-0 border-b border-[#2B1B17]/10 bg-[#F5EFE6] sm:w-16 sm:flex-col sm:justify-start sm:border-b-0 sm:border-r sm:py-6">
              {tabs.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    aria-pressed={active}
                    className="relative flex flex-1 flex-col items-center gap-1.5 px-3 py-3 sm:flex-none sm:py-4"
                  >
                    <span
                      className={[
                        "absolute bottom-0 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full",
                        "sm:left-0 sm:top-1/2 sm:h-6 sm:w-[3px] sm:translate-x-0 sm:-translate-y-1/2",
                        active ? "bg-[#EA580C]" : "bg-transparent",
                      ].join(" ")}
                    />
                    <span
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-xl border",
                        active
                          ? "border-[#EA580C] text-[#EA580C]"
                          : "border-transparent text-[#2B1B17]/40",
                      ].join(" ")}
                    >
                      <Icon size={18} />
                    </span>
                    <span
                      className={[
                        "text-[11px] font-medium sm:hidden",
                        active ? "text-[#EA580C]" : "text-[#2B1B17]/50",
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              {tab === "details" ? (
                <>
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#EA580C]">
                    {product.category.name}
                  </p>
                  <h2
                    id="product-details-title"
                    className="mt-1.5 text-2xl font-black text-[#2B1B17] sm:text-3xl"
                  >
                    {product.name}
                  </h2>

                  <div className="mt-4 flex items-center gap-2">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-[#2B1B17]">
                      {rating ?? "Nouveau"}
                    </span>
                    <span className="text-sm text-[#2B1B17]/50">
                      ({product.review.length} avis)
                    </span>
                  </div>

                  <div className="mt-6 border-t border-[#2B1B17]/10 pt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-[#2B1B17]/50">
                      Description
                    </h3>
                    <p className="mt-2 leading-relaxed text-[#2B1B17]/80">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-4">
                    <p className="text-2xl font-bold text-[#2B1B17]">
                      {product.price.toLocaleString("fr-FR")} FCFA
                    </p>
                    <button
                      ref={addButtonRef}
                      type="button"
                      onClick={addToCart}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2B1B17] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#EA580C]"
                    >
                      <ShoppingCart size={18} />
                      Ajouter
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-[#2B1B17]">Avis clients</h3>
                  {product.review.length === 0 ? (
                    <p className="mt-3 text-sm text-[#2B1B17]/50">
                      Aucun avis pour le moment.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {product.review.map((review, index) => (
                        <article
                          key={`${review.createdAt.toString()}-${index}`}
                          className="rounded-xl bg-white p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-[#2B1B17]">
                              {review.user.firstName} {review.user.lastName}
                            </p>
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                              <Star size={14} className="fill-amber-400 text-amber-400" />
                              {review.rating}/5
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-[#2B1B17]/70">
                            {review.comment}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
    , document.body,
  );
}
