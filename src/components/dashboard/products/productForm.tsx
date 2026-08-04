"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ImagePicker from "./imagePicker";

import { productSchema, ProductFormData } from "@/schemas/productSchema";

import { product } from "@prisma/client";

type Category = {
  id: number;
  name: string;
};

type ProductFormProps = {
  categories: Category[];
  product?: product;
};

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  async function onSubmit(data: ProductFormData) {
    console.log("Le formulaire est soumis");
    console.log(image);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("categoryId", String(data.categoryId));
    formData.append("status", data.status);

    if (image) {
      formData.append("image", image);
    }
    console.log("Envoi de la requête...");
    const response = await fetch(
      product ? `/api/products/${product.id}` : "/api/products",
      {
        method: product ? "PATCH" : "POST",
        body: formData,
      },
    );

    console.log(response.status);

    if (!response.ok) {
      const error = await response.json();

      alert(error.message);

      return;
    }

    router.push("/dashboard/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label>Nom</label>

        <input {...register("name")} className="w-full rounded border p-3" />

        <p className="text-red-500">{errors.name?.message}</p>
      </div>

      <div>
        <label>Description</label>

        <textarea
          {...register("description")}
          className="w-full rounded border p-3"
        />

        <p className="text-red-500">{errors.description?.message}</p>
      </div>

      <div>
        <label>Prix</label>

        <input
          type="number"
          {...register("price", {
            valueAsNumber: true,
          })}
          className="w-full rounded border p-3"
        />

        <p className="text-red-500">{errors.price?.message}</p>
      </div>

      <div>
        <label>Catégorie</label>

        <select
          {...register("categoryId", {
            valueAsNumber: true,
          })}
          className="w-full rounded border p-3"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Statut</label>

        <select {...register("status")} className="w-full rounded border p-3">
          <option value="AVAILABLE">Disponible</option>

          <option value="UNAVAILABLE">Indisponible</option>
        </select>
      </div>

      <ImagePicker onChange={setImage} initialImage={product?.image} />

      <button
        disabled={isSubmitting}
        className="rounded bg-orange-500 px-6 py-3 text-white"
      >
        {product ? "Mettre à jour" : "Créer le produit"}
      </button>
    </form>
  );
}
