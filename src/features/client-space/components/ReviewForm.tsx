"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Package } from "lucide-react";

type Product = { id: number; name: string; image: string; deliveredAt: string };

export function ReviewForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [productId, setProductId] = useState(products[0]?.id ?? 0);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!products.length)
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-10 text-center text-slate-500">
        Vous pourrez laisser un avis dès qu&apos;une commande contenant un
        produit aura été livrée.
      </div>
    );

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setComment("");
      setMessage("Merci, votre avis a été publié.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Impossible de publier l'avis."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm"
    >
      <div>
        <p className="mb-3 text-sm font-semibold text-slate-700">Produit</p>
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
          {products.map((product) => {
            const isActive = product.id === productId;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => setProductId(product.id)}
                className="relative shrink-0"
              >
                <div
                  className={`flex w-36 flex-col items-center gap-2 rounded-2xl border p-3 text-center transition ${
                    isActive
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-full bg-orange-100 ring-4 ring-white shadow-sm">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-5 w-5 text-orange-400" />
                      </div>
                    )}
                  </div>
                  <p className="line-clamp-2 text-xs font-medium text-slate-900">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Livré le {product.deliveredAt}
                  </p>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="review-product-ring"
                    className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-orange-500"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">Votre note</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <motion.button
              key={value}
              type="button"
              whileTap={{ scale: 0.85 }}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
              aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  value <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            </motion.button>
          ))}
        </div>
      </div>

      <label className="block text-sm font-semibold text-slate-700">
        Votre avis
        <textarea
          required
          minLength={3}
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience…"
          className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 p-3 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-orange-400 focus:outline-none"
        />
      </label>

      {message && (
        <p
          className={`text-sm ${
            message.startsWith("Merci") ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <button
        disabled={saving}
        className="w-full rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:opacity-60 sm:w-auto"
      >
        {saving ? "Publication…" : "Publier mon avis"}
      </button>
    </form>
  );
}