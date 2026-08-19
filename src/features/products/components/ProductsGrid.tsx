
"use client";
import { useState } from "react";
import { flyToCart } from "@/features/cart/components/FlyToCart";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useProducts } from "@/hooks/useProduct";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";
import { CategoryFilter } from "./CategoryFilter";
import { ProductDetailsModal } from "./ProductDetailsModal";
import type { ProductWithCategoryAndReviews } from "@/types/products";

const SKELETON_COUNT = 6;

// Easing "expo-out" doux, cohérent avec le reste du site
const EASE = [0.22, 1, 0.36, 1] as const;

// Orchestration du stagger : chaque enfant du grid apparaît avec un léger décalage
const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

// Chaque carte : entrée en fondu + léger slide/scale, sortie plus rapide (feedback filtre)
const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Conteneur responsive : scroll horizontal snapé sur mobile, grille classique dès sm:
const RESPONSIVE_TRACK_CLASS =
  "flex snap-x snap-mandatory gap-5 overflow-x-auto -mx-6 px-6 pb-4 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none lg:grid-cols-3";

// Chaque carte : largeur fixe sur mobile (scroll horizontal), largeur auto dès sm: (grille)
const RESPONSIVE_ITEM_CLASS = "w-[100%] flex-none snap-start sm:w-auto";

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
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCategoryAndReviews | null>(null);

  const categories = Array.from(
    new Map(
      products.map((p) => [
        p.categoryId,
        { id: p.categoryId, name: p.category.name },
      ]),
    ).values(),
  );

  const handleAddToCart = (sourceEl: HTMLElement, imageSrc: string) => {
    const cartButton = document.getElementById("floating-cart-button");
    if (!cartButton) return;
    flyToCart({
      sourceEl,
      // Cast explicite : HTMLButtonElement est un HTMLElement, flyToCart attend HTMLElement
      targetEl: cartButton,
      imageSrc,
    });
  };

  return (
    // Ajout du fond crème (#f5efe6) et des arrondis pour s'intégrer au Hero
    <section
      id="plats"
      className="my-8 w-full scroll-mt-24 md:rounded-[40px] border border-white/40 md:bg-white/70 px-8 py-16 backdrop-blur-md md:px-12"
    >
      <p
        role="status"
        aria-live="polite"
        className="sr-only"
        id="cart-announcement"
      >
        {/* Contenu injecté via JS après chaque ajout — voir étape suivante */}
      </p>

      <motion.div
        className="mb-10 flex flex-col gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={fadeUp}>
          {/* Titre principal mis en valeur en noir intense */}
          <h2 className="text-4xl font-black text-black tracking-tight">
            Découvrez Notre Carte
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Commandez en quelques clics, livré avec soin chez vous.
          </p>
        </motion.div>

        <AnimatePresence>
          {!isLoading && !error && categories.length > 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onSelect={filterByCategory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center justify-center gap-4 py-24 text-center"
          >
            <AlertCircle size={40} className="text-red-400" />
            <p className="text-gray-600 text-sm">{error}</p>
            <button
              onClick={refetch}
              className="px-5 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-[#EA580C] transition-colors duration-200"
            >
              Réessayer
            </button>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            key="loading"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            variants={gridVariants}
            className={RESPONSIVE_TRACK_CLASS}
          >
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <motion.div key={i} variants={cardVariants} className={RESPONSIVE_ITEM_CLASS}>
                <ProductSkeleton />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && !error && (
          <motion.div key="content">
            {products.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex flex-col items-center justify-center gap-3 py-24 text-center"
              >
                <p className="text-gray-400 text-lg">
                  Aucun produit dans cette catégorie.
                </p>
                <button
                  onClick={() => filterByCategory(null)}
                  className="text-sm text-[#EA580C] hover:underline"
                >
                  Voir tous les produits
                </button>
              </motion.div>
            )}

            <motion.div
              layout
              initial="hidden"
              animate="visible"
              variants={gridVariants}
              className={RESPONSIVE_TRACK_CLASS}
            >
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={RESPONSIVE_ITEM_CLASS}
                  >
                    <ProductCard
                      product={product}
                      // Ref castée pour matcher le type attendu par ProductCard
                      onOpenDetails={setSelectedProduct}
                      onAddToCart={(sourceEl) =>
                        handleAddToCart(sourceEl, product.image)
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} />
    </section>
  );
}
