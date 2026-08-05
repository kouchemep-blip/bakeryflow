import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { ReviewForm } from "@/features/client-space/components/ReviewForm";

export default async function CustomerReviewsPage() {
  const token = (await cookies()).get("token")?.value; if (!token) redirect("/login");
  let userId: number; try { userId = (verifyToken(token) as { id: number }).id; } catch { redirect("/login"); }
  const items = await prisma.orderitem.findMany({ where: { order: { userId, status: "DELIVERED" } }, include: { product: { select: { id: true, name: true, image: true } }, order: { select: { updatedAt: true } } }, orderBy: { order: { updatedAt: "desc" } } });
  const products = Array.from(new Map(items.map((item) => [item.productId, { ...item.product, deliveredAt: item.order.updatedAt.toLocaleDateString("fr-FR") }])).values());
  const reviews = await prisma.review.findMany({ where: { userId }, include: { product: { select: { name: true } } }, orderBy: { createdAt: "desc" } });
  return <section className="space-y-8"><div><h1 className="text-3xl font-bold">Mes avis</h1><p className="mt-2 text-gray-500">Vous pouvez publier plusieurs avis pour chacun de vos produits déjà livrés.</p></div><ReviewForm products={products} />{reviews.length > 0 && <div className="space-y-3"><h2 className="text-xl font-semibold">Avis publiés</h2>{reviews.map((review) => <article key={review.id} className="rounded-xl border bg-white p-5"><div className="flex items-center justify-between"><p className="font-semibold">{review.product.name}</p><p className="text-amber-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p></div><p className="mt-2 text-gray-600">{review.comment}</p><p className="mt-3 text-xs text-gray-400">{review.createdAt.toLocaleDateString("fr-FR")}</p></article>)}</div>}</section>;
}
