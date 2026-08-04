import { Prisma } from "@prisma/client";

// ── Existant — utilisé par le dashboard admin ──────────────────────────────
export type ProductWithCategory = Prisma.productGetPayload<{
  include: {
    category: true;
  };
}>;

// ── Nouveau — utilisé par la landing page (inclut les avis pour la note) ──
export type ProductWithCategoryAndReviews = Prisma.productGetPayload<{
  include: {
    category: true;
    review: {
      select: {
        rating: true;
      };
    };
  };
}>;

// ── Helper — note moyenne calculée depuis reviews[] ───────────────────────
// Retourne null si aucun avis
export function getAverageRating(
  reviews: { rating: number }[]
): number | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // arrondi 1 décimale
}
