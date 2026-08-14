"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import CategoryForm from "./categoryForm";

export function CategoryFormModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
      >
        <Plus className="h-4 w-4" />
        Nouvelle catégorie
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Nouvelle catégorie">
        <CategoryForm onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}