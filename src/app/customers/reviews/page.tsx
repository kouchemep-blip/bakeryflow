import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { ReviewForm } from "@/features/client-space/components/ReviewForm";
import Image from "next/image";
import { Package, Star } from "lucide-react";

export default async function CustomerReviewsPage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");
  let userId: number;
  try {
    userId = (verifyToken(token) as { id: number }).id;
  } catch {
    redirect("/login");
  }

  const items = await prisma.orderitem.findMany({
    where: { order: { userId, status: "DELIVERED" } },
    include: {
      product: { select: { id: true, name: true, image: true } },
      order: { select: { updatedAt: true } },
    },
    orderBy: { order: { updatedAt: "desc" } },
  });

  const products = Array.from(
    new Map(
      items.map((item) => [
        item.productId,
        {
          ...item.product,
          deliveredAt: item.order.updatedAt.toLocaleDateString("fr-FR"),
        },
      ]),
    ).values(),
  );

  const reviews = await prisma.review.findMany({
    where: { userId },
    include: { product: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mes avis</h1>
        <p className="mt-1 text-sm text-slate-500">
          Vous pouvez publier plusieurs avis pour chacun de vos produits déjà livrés.
        </p>
      </div>

      <ReviewForm products={products} />

      {reviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Avis publiés
          </h2>
          {reviews.map((review) => (
            <article
              key={review.id}
              className="flex gap-4 rounded-[28px] border border-slate-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-sm"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-orange-100 ring-4 ring-white shadow-sm">
                {review.product.image ? (
                  <Image
                    src={review.product.image}
                    alt={review.product.name}
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
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{review.product.name}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={`h-3.5 w-3.5 ${
                          value <= review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {review.createdAt.toLocaleDateString("fr-FR")}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}