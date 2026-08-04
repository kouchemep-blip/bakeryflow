import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return null;
  }

  const payload = verifyToken(token.value) as {
    id: number;
  };

  const order = await prisma.order.findFirst({
    where: {
      id: Number(id),
      userId: payload.id,
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Commande #{order.id}</h1>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Statut</h2>

        <p>{order.status}</p>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Produits</h2>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.product.name} x{item.quantity}
              </span>

              <span>
                {(item.unitPrice * item.quantity).toLocaleString()} FCFA
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">Total</h2>

        <p className="text-2xl font-bold">
          {order.totalPrice.toLocaleString()} FCFA
        </p>
      </div>
    </div>
  );
}
