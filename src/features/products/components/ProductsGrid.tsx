"use client";
import { useRef } from "react";
import { CartButton } from "@/features/cart/components/cartButton";
import { flyToCart } from "@/features/cart/components/FlyToCart";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useProducts } from "@/hooks/useProduct";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";
import { CategoryFilter } from "./CategoryFilter";

const SKELETON_COUNT = 6;

export function ProductGrid() {
  const {
    products,
    isLoading,
    error,
    refetch,
    filterByCategory,
    activeCategory,
  } = useProducts();

  // Une seule déclaration — HTMLButtonElement pour matcher CartButton + flyToCart
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  const categories = Array.from(
    new Map(
      products.map((p) => [
        p.categoryId,
        { id: p.categoryId, name: p.category.name },
      ]),
    ).values(),
  );

  const handleAddToCart = (sourceEl: HTMLElement, imageSrc: string) => {
    if (!cartButtonRef.current) return;
    flyToCart({
      sourceEl,
      // Cast explicite : HTMLButtonElement est un HTMLElement, flyToCart attend HTMLElement
      targetEl: cartButtonRef.current as HTMLElement,
      imageSrc,
    });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
      <p
        role="status"
        aria-live="polite"
        className="sr-only"
        id="cart-announcement"
      >
        {/* Contenu injecté via JS après chaque ajout — voir étape suivante */}
      </p>
      <div className="flex flex-col gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Notre carte
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Commandez en quelques clics, livré avec soin.
          </p>
        </div>

        {!isLoading && !error && categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelect={filterByCategory}
          />
        )}
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <AlertCircle size={40} className="text-red-400" />
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={refetch}
            className="px-5 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-amber-500 transition-colors duration-200"
          >
            Réessayer
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <p className="text-gray-400 text-lg">
                Aucun produit dans cette catégorie.
              </p>
              <button
                onClick={() => filterByCategory(null)}
                className="text-sm text-amber-500 hover:underline"
              >
                Voir tous les produits
              </button>
            </div>
          )}

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  // Ref castée pour matcher le type attendu par ProductCard
                  cartButtonRef={cartButtonRef as React.RefObject<HTMLElement>}
                  onAddToCart={(sourceEl) =>
                    handleAddToCart(sourceEl, product.image)
                  }
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      <CartButton ref={cartButtonRef} />
    </section>
  );
}
