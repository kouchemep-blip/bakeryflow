type OrderStatCardProps = {
  title: string;
  value: string | number;
};

export default function OrderStatCard({
  title,
  value,
}: OrderStatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
          {value}
        </h2>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
          +12%
        </span>
      </div>
    </div>
  );
}