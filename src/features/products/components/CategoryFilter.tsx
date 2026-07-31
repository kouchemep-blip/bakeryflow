"use client";
import { motion } from "framer-motion";

type Category = {
  id: number;
  name: string;
};

type CategoryFilterProps = {
  categories: Category[];
  activeCategory: number | null;
  onSelect: (id: number | null) => void;
};

export function CategoryFilter({
  categories,
  activeCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer par catégorie"
      className="flex gap-2 flex-wrap"
    >
      {/* Bouton "Tout" */}
      <CategoryPill
        label="Tout"
        isActive={activeCategory === null}
        onClick={() => onSelect(null)}
      />

      {categories.map((cat) => (
        <CategoryPill
          key={cat.id}
          label={cat.name}
          isActive={activeCategory === cat.id}
          onClick={() => onSelect(cat.id)}
        />
      ))}
    </div>
  );
}

// ─── Pill individuelle ────────────────────────────────────────────────────────

type CategoryPillProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

function CategoryPill({ label, isActive, onClick }: CategoryPillProps) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={[
        "relative px-4 py-1.5 rounded-full text-sm font-medium",
        "transition-colors duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
        isActive
          ? "text-white"
          : "text-gray-600 bg-gray-100 hover:bg-gray-200",
      ].join(" ")}
    >
      {/* Fond animé sur la pill active */}
      {isActive && (
        <motion.span
          layoutId="active-category"
          className="absolute inset-0 bg-gray-900 rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}