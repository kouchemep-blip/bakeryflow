"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTrash, FaImage, FaPen } from "react-icons/fa";

import ImagePicker from "./imagePicker";
import { productSchema, ProductFormData } from "@/schemas/productSchema";
import { product } from "@prisma/client";
import { ArrowLeft } from "lucide-react";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    product?.image ?? null,
  );

  const {
    register,
    handleSubmit,
    watch,
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

  useEffect(() => {
    if (!image) {
      setPreviewUrl(product?.image ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image, product?.image]);

  async function onSubmit(data: ProductFormData) {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("categoryId", String(data.categoryId));
    formData.append("status", data.status);

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(
      product ? `/api/products/${product.id}` : "/api/products",
      {
        method: product ? "PATCH" : "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
      return;
    }

    router.push("/dashboard/products");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Link
        href="/dashboard/products"
        className="inline-flex items-center mb-2.5 gap-2 text-sm font-medium text-[#807A72] transition-colors hover:text-[#EA580C]"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux produits
      </Link>
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            {product ? "Modifier le produit" : "Créer un produit"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Remplis les informations ci-dessous pour enregistrer le produit.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Nom
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus-visible:ring-4 focus-visible:ring-orange-100"
                    placeholder="Nom du produit"
                  />
                  {errors.name?.message && (
                    <p className="mt-2 text-sm text-rose-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register("description")}
                    rows={6}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus-visible:ring-4 focus-visible:ring-orange-100"
                    placeholder="Description du produit"
                  />
                  {errors.description?.message && (
                    <p className="mt-2 text-sm text-rose-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Prix
                  </label>
                  <input
                    id="price"
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus-visible:ring-4 focus-visible:ring-orange-100"
                    placeholder="0"
                  />
                  {errors.price?.message && (
                    <p className="mt-2 text-sm text-rose-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="categoryId"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Catégorie
                  </label>
                  <select
                    id="categoryId"
                    {...register("categoryId", { valueAsNumber: true })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-orange-400 focus-visible:ring-4 focus-visible:ring-orange-100"
                  >
                    <option value="">Choisir une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId?.message && (
                    <p className="mt-2 text-sm text-rose-600">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Statut
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700 transition has-[:checked]:border-orange-400 has-[:checked]:bg-orange-50 has-[:checked]:text-orange-700">
                      <input
                        type="radio"
                        value="AVAILABLE"
                        {...register("status")}
                        className="sr-only"
                      />
                      Disponible
                    </label>

                    <label className="cursor-pointer rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700 transition has-[:checked]:border-orange-400 has-[:checked]:bg-orange-50 has-[:checked]:text-orange-700">
                      <input
                        type="radio"
                        value="UNAVAILABLE"
                        {...register("status")}
                        className="sr-only"
                      />
                      Indisponible
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Image du produit
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Ajoute une image claire pour mieux présenter le produit.
                </p>

                <div className="mt-5 overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white">
                  <div className="relative aspect-square w-full bg-slate-100">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt={product?.name ?? "Aperçu du produit"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-center">
                        <div className="space-y-2 p-6">
                          <FaImage className="mx-auto h-10 w-10 text-slate-300" />
                          <p className="text-sm text-slate-500">
                            Aucun aperçu disponible
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-600">
                      <FaPen className="h-4 w-4" />
                      <span>
                        {previewUrl ? "Changer l’image" : "Ajouter une image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
            <Link
              href="/dashboard/products"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Annuler
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Enregistrement..."
                : product
                  ? "Mettre à jour"
                  : "Créer le produit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
