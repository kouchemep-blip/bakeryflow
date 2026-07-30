

import { prisma } from "@/lib/prisma";
import CategoryTable from "@/components/dashboard/categories/categoryTable";
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
        <h1 className="mb-6 text-3xl font-bold">
          Catégories
        </h1>

        <CategoryTable categories={categories} />
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="mb-6 text-2xl font-bold">
          Ajouter une catégorie
        </h2>

        <CategoryForm />
      </div>
    </div>
  );
}