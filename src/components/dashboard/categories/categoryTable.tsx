import CategoryRow from "./categoryRows";

type CategoryTableProps = {
  categories: {
    id: number;
    name: string;
    _count: {
      product: number;
    };
  }[];
};

export default function CategoryTable({
  categories,
}: CategoryTableProps) {
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-3 text-left">
            Nom
          </th>

          <th className="border px-4 py-3">
            Produits
          </th>

          <th className="border px-4 py-3">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
          />
        ))}
      </tbody>
    </table>
  );
}
