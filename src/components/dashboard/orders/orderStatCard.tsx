type OrderStatCardProps = {
  title: string;
  value: string | number;
};

export default function OrderStatCard({
  title,
  value,
}: OrderStatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">
        {value}
      </h2>
    </div>
  );
}