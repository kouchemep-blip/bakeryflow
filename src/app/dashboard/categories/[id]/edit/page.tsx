import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/dashboard/categories/categoryForm";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: Props) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Modifier la catégorie
      </h1>

      <CategoryForm category={category} />
    </div>
  );
}