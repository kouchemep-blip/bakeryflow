type ProductStatusProps = {
  status: string;
};

export default function ProductStatus({
  status,
}: ProductStatusProps) {
  return (
    <span>
      {status === "AVAILABLE"
        ? "🟢 Disponible"
        : "🔴 Indisponible"}
    </span>
  );
}