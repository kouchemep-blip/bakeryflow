import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/dashboard/categories/categoryForm";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-6 text-3xl font-bold">Catégories</h1>

        <table className="w-full border-collapse rounded-lg border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Nom</th>
              <th className="border p-3 text-center">Produits</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="border p-3">{category.name}</td>

                <td className="border p-3 text-center">
                  {category._count.products}
                </td>

                {/* <td className="border p-3">
                  <div className="flex justify-center gap-3">
                    <Link
                      href={`/dashboard/categories/${category.id}/edit`}
                      className="rounded bg-blue-500 px-3 py-1 text-white"
                    >
                      Modifier
                    </Link>

                    <button className="rounded bg-red-500 px-3 py-1 text-white">
                      Supprikkkmer
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-5 text-2xl font-bold">
          Ajouter une catégorie
        </h2>

        <CategoryForm />
      </div>
    </div>
  );
}