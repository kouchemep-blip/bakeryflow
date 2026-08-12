import { Prisma } from "@prisma/client";

export type ProductWithCategory = Prisma.productGetPayload<{
  include: {
    category: true;
  };
}> & {
  averageRating?: number | null;
  reviewsCount?: number;
};

export type ProductWithCategoryAndReviews = Prisma.productGetPayload<{
  include: {
    category: true;
    review: {
      select: {
        rating: true;
        comment: true;
        createdAt: true;
        user: { select: { firstName: true; lastName: true } };
      };
    };
  };
}>;

export function getAverageRating(
  reviews: { rating: number }[]
): number | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
