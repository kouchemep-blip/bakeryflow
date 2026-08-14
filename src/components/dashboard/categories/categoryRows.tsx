"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

type CategoryRowProps = {
  category: {
    id: number;
    name: string;
    _count: { product: number };
  };
};

export default function CategoryRow({ category }: CategoryRowProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;

    const response = await fetch(`/api/categories/${category.id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    router.refresh();
  }

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80">
      <td className="px-4 py-3 font-medium text-slate-900">{category.name}</td>
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {category._count.product}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashboard/categories/${category.id}/edit`}
            aria-label={`Modifier ${category.name}`}
            title="Modifier"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            aria-label={`Supprimer ${category.name}`}
            title="Supprimer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}