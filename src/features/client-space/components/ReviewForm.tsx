"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

type Product = { id: number; name: string; image: string; deliveredAt: string };

export function ReviewForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [productId, setProductId] = useState(products[0]?.id ?? 0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  if (!products.length) return <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-gray-500">Vous pourrez laisser un avis dès qu&apos;une commande contenant un produit aura été livrée.</div>;
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); setMessage(null); try { const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, rating, comment }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); setComment(""); setMessage("Merci, votre avis a été publié."); router.refresh(); } catch (error) { setMessage(error instanceof Error ? error.message : "Impossible de publier l'avis."); } finally { setSaving(false); } }
  return <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm"><label className="block text-sm font-medium">Produit<select value={productId} onChange={(e) => setProductId(Number(e.target.value))} className="mt-1 w-full rounded-lg border p-3">{products.map((product) => <option key={product.id} value={product.id}>{product.name} — livré le {product.deliveredAt}</option>)}</select></label><div><p className="mb-2 text-sm font-medium">Votre note</p><div className="flex gap-1">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} étoile${value > 1 ? "s" : ""}`}><Star className={value <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} /></button>)}</div></div><label className="block text-sm font-medium">Votre avis<textarea required minLength={3} maxLength={1000} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Partagez votre expérience…" className="mt-1 min-h-28 w-full rounded-lg border p-3 font-normal" /></label>{message && <p className={message.startsWith("Merci") ? "text-sm text-green-600" : "text-sm text-red-600"}>{message}</p>}<button disabled={saving} className="rounded-lg bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600 disabled:opacity-60">{saving ? "Publication…" : "Publier mon avis"}</button></form>;
}
