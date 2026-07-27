import { prisma } from "@/lib/prisma";
import ProductTable from "@/components/dashboard/products/productTable";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  return (
    <ProductTable
      products={products}
    />
  );
}