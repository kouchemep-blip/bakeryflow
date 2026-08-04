import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import Link from "next/link";

export default async function ClientOrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return <p>Vous devez être connecté.</p>;
  }

  let userId: number;

  try {
    const payload = verifyToken(token.value) as {
      id: number;
    };

    userId = payload.id;
  } catch {
    return <p>Session invalide.</p>;
  }

  const orders = await prisma.order.findMany({
    where: {
      userId,
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p>Vous n&apos;avez encore passé aucune commande.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="
                rounded-xl
                border
                bg-white
                p-6
              "
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">Commande #{order.id}</h2>

                  <p className="text-sm text-gray-500">
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>

                <span
                  className="
                    rounded-full
                    bg-orange-100
                    px-3 py-1
                    text-sm
                  "
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4">
                <p>{order.items.length} produit(s)</p>

                <p className="font-semibold">
                  {order.totalPrice.toLocaleString()} FCFA
                </p>
              </div>

              <Link
                href={`/customers/orders/${order.id}`}
                className="
                  mt-4
                  inline-block
                  text-orange-600
                "
              >
                Voir le détail →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
