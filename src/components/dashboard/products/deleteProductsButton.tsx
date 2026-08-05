"use client";
import { SimpleBtn } from "@/components/ui/SimpleBtn";
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
    <button onClick={handleDelete}>
      <SimpleBtn icon={FaTrash} />
    </button>
  );
}
