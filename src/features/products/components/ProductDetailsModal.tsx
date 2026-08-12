"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Star, X } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cart.store";
import { getAverageRating } from "@/types/products";
import type { ProductWithCategoryAndReviews } from "@/types/products";

type Props = { product: ProductWithCategoryAndReviews | null; onClose: () => void; onAddToCart: (source: HTMLElement, image: string) => void };

export function ProductDetailsModal({ product, onClose, onAddToCart }: Props) {
  const addItem = useCartStore((state) => state.addItem);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!product) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", closeOnEscape); };
  }, [product, onClose]);

  const addToCart = () => {
    if (!product || !addButtonRef.current) return;
    addItem({ product: { id: product.id, name: product.name, image: product.image, price: product.price, categoryId: product.categoryId } });
    onAddToCart(addButtonRef.current, product.image);
  };

  return <AnimatePresence>{product && <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
    <motion.section role="dialog" aria-modal="true" aria-labelledby="product-details-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl" initial={{ y: 32 }} animate={{ y: 0 }} exit={{ y: 32 }} onMouseDown={(event) => event.stopPropagation()}>
      <header className="sticky top-0 z-10 flex justify-end bg-white/90 p-4 backdrop-blur"><button type="button" onClick={onClose} aria-label="Fermer la fiche produit" className="rounded-full p-2 hover:bg-slate-100"><X size={22} /></button></header>
      <div className="grid gap-7 px-6 pb-7 sm:grid-cols-2 sm:px-8"><div className="relative aspect-square overflow-hidden rounded-2xl bg-amber-50"><Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" /></div><div className="flex flex-col"><p className="text-sm font-semibold uppercase tracking-wide text-orange-600">{product.category.name}</p><h2 id="product-details-title" className="mt-2 text-3xl font-black text-slate-900">{product.name}</h2><p className="mt-4 leading-relaxed text-slate-600">{product.description}</p><div className="mt-5 flex items-center gap-2"><Star size={18} className="fill-amber-400 text-amber-400" /><span className="font-semibold">{getAverageRating(product.review) ?? "Nouveau"}</span><span className="text-sm text-slate-500">({product.review.length} avis)</span></div><p className="mt-6 text-2xl font-bold">{product.price.toLocaleString("fr-FR")} FCFA</p><button ref={addButtonRef} type="button" onClick={addToCart} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-orange-600"><ShoppingCart size={18} />Ajouter au panier</button></div></div>
      <div className="border-t border-slate-100 px-6 py-7 sm:px-8"><h3 className="text-xl font-bold">Avis clients</h3>{product.review.length === 0 ? <p className="mt-3 text-sm text-slate-500">Aucun avis pour le moment.</p> : <div className="mt-4 space-y-4">{product.review.map((review, index) => <article key={`${review.createdAt.toString()}-${index}`} className="rounded-xl bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="font-semibold">{review.user.firstName} {review.user.lastName}</p><span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600"><Star size={14} className="fill-amber-400" />{review.rating}/5</span></div><p className="mt-2 text-sm leading-relaxed text-slate-600">{review.comment}</p></article>)}</div>}</div>
    </motion.section>
  </motion.div>}</AnimatePresence>;
}
