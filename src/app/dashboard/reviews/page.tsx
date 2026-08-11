import { prisma } from "@/lib/prisma";
import { DeleteReviewButton } from "@/components/dashboard/reviews/DeleteReviewButton";
import { Star, MessageSquare, Users } from "lucide-react";

export default async function ReviewsPage() {
  const [reviews, aggregate] = await Promise.all([
    prisma.review.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.aggregate({ _avg: { rating: true }, _count: { id: true } }),
  ]);

  const average = aggregate._avg.rating
    ? aggregate._avg.rating.toFixed(1)
    : "—";

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 mt-[26vh] lg:mt-[12vh]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Feedback
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Avis clients
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Suivez les retours publiés après les commandes livrées.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#EA580C] shadow-sm">
              <Star className="h-5 w-5 fill-[#EA580C]" />
            </div>
            <div>
              <p className="text-xl font-bold text-amber-700">{average} / 5</p>
              <p className="text-xs text-amber-600">
                {aggregate._count.id} avis publiés
              </p>
            </div>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <MessageSquare className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            Aucun avis client pour le moment.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Les avis apparaîtront ici dès que les clients en publieront.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:bg-[#C3B9B1] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:backdrop-blur-[150px]">
            <table className="min-w-[1000px] w-full border-collapse">
              <thead className="bg-slate-50 text-left text-sm text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Produit</th>
                  <th className="px-6 py-4 text-center font-medium">Note</th>
                  <th className="px-6 py-4 font-medium">Commentaire</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {review.user.firstName} {review.user.lastName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {review.user.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">
                        {review.product.name}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-0.5 text-[#EA580C]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-[#EA580C]"
                                : "fill-transparent text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="max-w-md text-sm text-slate-700">
                        {review.comment}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {review.createdAt.toLocaleDateString("fr-FR")}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <DeleteReviewButton reviewId={review.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
