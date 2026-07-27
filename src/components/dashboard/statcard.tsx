type StatCardProps = {
  title: string;
  value: number;
  description?: string;
};

export default function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-sm text-gray-500">{title}</h3>

      <p className="mt-2 text-3xl font-bold">{value}</p>

      {description && (
        <p className="mt-2 text-sm text-gray-400">{description}</p>
      )}
    </div>
  );
}
