import { prisma } from "@/lib/prisma";
import ProductTable from "@/components/dashboard/products/productTable";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  return (
    <div className="mt-[26vh] lg:mt-[12vh]">
      <ProductTable
        products={products}
      />
    </div>
  );
}