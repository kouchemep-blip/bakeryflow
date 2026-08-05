"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteReviewButton({ reviewId }: { reviewId: number }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function deleteReview() {
    if (!window.confirm("Supprimer définitivement cet avis ?")) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      // Rafraîchit le Server Component afin de recalculer les moyennes et compteurs affichés.
      router.refresh();
    } catch {
      window.alert("La suppression de l'avis a échoué.");
    } finally {
      setDeleting(false);
    }
  }

  return <button type="button" onClick={deleteReview} disabled={deleting} className="inline-flex items-center gap-1 rounded-md p-2 text-red-600 hover:bg-red-50 disabled:opacity-50" aria-label="Supprimer l'avis"><Trash2 size={16} />{deleting ? "Suppression…" : "Supprimer"}</button>;
}
