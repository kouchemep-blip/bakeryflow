import CategoryRow from "./categoryRows";

type CategoryTableProps = {
  categories: {
    id: number;
    name: string;
    _count: { product: number };
  }[];
};

export default function CategoryTable({ categories }: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Aucune catégorie pour le moment.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Nom</th>
            <th className="px-4 py-3 text-center">Produits</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </tbody>
      </table>
    </div>
  );
}