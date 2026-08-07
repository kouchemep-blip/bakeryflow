type ProductStatusProps = {
  status: string;
};

export default function ProductStatus({ status }: ProductStatusProps) {
  const isAvailable = status === "AVAILABLE";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        isAvailable
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-rose-200 bg-rose-50 text-rose-700"
      }`}
    >
      <span
        className={`mr-2 h-2 w-2 rounded-full ${
          isAvailable ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {isAvailable ? "Disponible" : "Indisponible"}
    </span>
  );
}