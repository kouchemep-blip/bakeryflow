type OrderStatusProps = {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "DELIVERED"
    | "CANCELLED";
};

export default function OrderStatus({ status }: OrderStatusProps) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PREPARING: "bg-orange-100 text-orange-700",
    READY: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const labels = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    PREPARING: "Préparation",
    READY: "Prête",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
