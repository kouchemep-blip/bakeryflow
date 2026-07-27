import ProductForm from "@/components/dashboard/products/productForm";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage () {
    const categories = await prisma.category.findMany();
    return(
        <div>
            <h1 className="mb-6 text-2xl font-bold">
                Ajouter un produit
            </h1>
            <ProductForm categories={categories} />
        </div>
    )
}