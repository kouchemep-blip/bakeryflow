"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};
type ProductFormProps = {
  categories: Category[];
  product?: Product;
};

import { productSchema, ProductFormData } from "@/schemas/productSchema";
import { Product } from "@prisma/client";

export default function ProductForm({ product, categories }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      categoryId: product?.categoryId ?? undefined,
      status: product?.status ?? "AVAILABLE",
    },
  });

  const router = useRouter();
  const url = product ? `/api/products/${product.id}` : "/api/products";
  const method = product 
    ? "PATCH"
    : "POST"

  async function onSubmit(data: ProductFormData) {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        image: product?.image ?? "default-product.png",
      }),
    });

    if (response.ok) {
      router.push("/dashboard/products");
      router.refresh();
    }

    const result = await response.json();
    console.log(result);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label>Nom</label>

        <input {...register("name")} className="border p-2" />

        <p>{errors.name?.message}</p>
      </div>
      <div>
        <label>Description</label>

        <textarea {...register("description")} className="border p-2" />

        <p>{errors.description?.message}</p>
      </div>
      <div>
        <label>Prix</label>

        <input
          type="number"
          {...register("price", { valueAsNumber: true })}
          className="border p-2"
        />

        <p>{errors.price?.message}</p>
      </div>
      <div>
        <label>Status</label>

        <select {...register("status")} className="border p-2">
          <option value="AVAILABLE">Disponible</option>
          <option value="UNAVAILABLE">Indisponible</option>
        </select>

        <p>{errors.status?.message}</p>
      </div>
      <div>
        <label>Categorie</label>

        <select
          {...register("categoryId", { valueAsNumber: true })}
          className="border p-2"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <p>{errors.status?.message}</p>
      </div>

      <button type="submit">{product ? "Mettre à jour" : "Créer le produit"}</button>
    </form>
  );
}
