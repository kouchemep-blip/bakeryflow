"use client";

import { category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormData } from "@/schemas/categorySchema";
import { useRouter } from "next/navigation";

type CategoryFormProps = {
  category?: category;
};

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
    },
  });

  async function onSubmit(data: CategoryFormData) {
    const url = category ? `/api/categories/${category.id}` : "/api/categories";

    const method = category ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      if (category) {
        router.push("/dashboard/categories");
      }

      router.refresh();
      return;
    }

    const error = await response.json();

    alert(error.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="mb-2 block font-medium">Nom</label>

        <input
          {...register("name")}
          className="w-full rounded-lg border p-3"
          placeholder="Ex : Desserts"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-orange-500 px-5 py-3 text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {category ? "Mettre à jour" : "Créer la catégorie"}
      </button>
    </form>
  );
}
