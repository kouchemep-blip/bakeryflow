import OrderRow from "./orderRow";

type OrderTableProps = {
  orders: any[];
};

export default function OrderTable({
  orders,
}: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Commande</th>
            <th className="p-4 text-left">Client</th>
            <th className="p-4">Articles</th>
            <th className="p-4">Montant</th>
            <th className="p-4">Statut</th>
            <th className="p-4">Date</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}