import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/dashboard/products/productForm";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany();

  return (
    <ProductForm
      product={product}
      categories={categories}
    />
  );
}