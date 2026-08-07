"use client";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";

type DeleteProductButtonProps = {
  productId: number;
};

export default function DeleteProductButton({
  productId,
}: DeleteProductButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce produit ?",
    );

    if (!confirmed) return;

    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <button onClick={handleDelete} className="cursor-pointer">
      <FaTrash className="h-4 w-4 text-[#EA580C] transition hover:text-black" />
    </button>
  );
}
