import type { OrderWithUserAndItems } from "@/types/order";

type Props = { order: OrderWithUserAndItems };

export default function OrderCustomerCard({
  order,
}: Props) {
  return (
    <div className="rounded-xl border p-6">

      <h2 className="mb-5 text-xl font-semibold">
        Client
      </h2>

      <div className="grid gap-3 md:grid-cols-2">

        <p>
          <strong>Nom :</strong>{" "}
          {order.user.firstName} {order.user.lastName}
        </p>

        <p>
          <strong>Email :</strong>{" "}
          {order.user.email}
        </p>

        <p>
          <strong>Téléphone :</strong>{" "}
          {order.user.phone}
        </p>

        <p>
          <strong>Date :</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString("fr-FR")}
        </p>

      </div>

    </div>
  );
}
