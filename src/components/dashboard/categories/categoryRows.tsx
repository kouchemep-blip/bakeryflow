"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type CategoryRowProps = {
  category: {
    id: number;
    name: string;
    _count: {
      product: number;
    };
  };
};

export default function CategoryRow({
  category,
}: CategoryRowProps) {
  const router = useRouter();

  async function handleDelete() {
    if (
      !confirm(
        "Voulez-vous vraiment supprimer cette catégorie ?"
      )
    ) {
      return;
    }

    const response = await fetch(
      `/api/categories/${category.id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    router.refresh();
  }

  return (
    <tr>
      <td className="border px-4 py-3">{category.name}</td>

      <td className="border px-4 py-3 text-center">
        {category._count.product}
      </td>

      <td className="border px-4 py-3">
        <div className="flex justify-center gap-3">
          <Link
            href={`/dashboard/categories/${category.id}/edit`}
            className="rounded bg-blue-500 px-3 py-2 text-white"
          >
            Modifier
          </Link>

          <button
            onClick={handleDelete}
            className="rounded bg-red-500 px-3 py-2 text-white"
          >
            Supprimer
          </button>
        </div>
      </td>
    </tr>
  );
}
