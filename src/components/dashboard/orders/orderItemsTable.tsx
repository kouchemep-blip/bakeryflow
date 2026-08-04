import Image from "next/image";
import type { OrderItemWithProduct } from "@/types/order";

type Props = {
  items: OrderItemWithProduct[];
};

export default function OrderItemsTable({
  items,
}: Props) {
  return (
    <div className="rounded-xl border p-6">

      <h2 className="mb-5 text-xl font-semibold">
        Produits
      </h2>

      <table className="w-full">

        <thead>

          <tr>

            <th></th>

            <th>Produit</th>

            <th>Qté</th>

            <th>Prix</th>

            <th>Total</th>

          </tr>

        </thead>

        <tbody>

          {items.map((item) => (

            <tr key={item.id} className="border-t">

              <td className="py-4">

                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />

              </td>

              <td>{item.product.name}</td>

              <td>{item.quantity}</td>

              <td>
                {item.unitPrice.toLocaleString()} FCFA
              </td>

              <td>
                {(item.quantity * item.unitPrice).toLocaleString()} FCFA
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
