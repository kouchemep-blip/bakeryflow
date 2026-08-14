import { prisma } from "@/lib/prisma";
import CategoryTable from "@/components/dashboard/categories/categoryTable";
import { CategoryFormModal } from "@/components/dashboard/categories/CategoryFormModal";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { product: true } } },
  });

  return (
    <div className="space-y-6 md:mt-[12vh] mt-[19vh]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catégories</h1>
          <p className="mt-1 text-sm text-slate-500">
            {categories.length} catégorie{categories.length > 1 ? "s" : ""}
          </p>
        </div>
        <CategoryFormModal />
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}