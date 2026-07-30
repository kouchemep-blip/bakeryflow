"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { ProductWithCategoryAndReviews } from "@/types/products";

type UseProductsReturn = {
  products: ProductWithCategoryAndReviews[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  filterByCategory: (categoryId: number | null) => void;
  activeCategory: number | null;
};

export function useProducts(): UseProductsReturn {
  const [allProducts, setAllProducts] = useState<ProductWithCategoryAndReviews[]>([]);
  const [products, setProducts]       = useState<ProductWithCategoryAndReviews[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // Ref pour accéder à activeCategory dans fetchProducts sans en faire une dépendance
  const activeCategoryRef = useRef(activeCategory);
  activeCategoryRef.current = activeCategory;

  // fetchProducts stable — ne change jamais de référence
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/product");

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Erreur de chargement des produits.");
      }

      const data: ProductWithCategoryAndReviews[] = await res.json();

      setAllProducts(data);

      // Applique le filtre actif via ref (pas de dépendance → pas de boucle)
      setProducts(
        activeCategoryRef.current
          ? data.filter((p) => p.categoryId === activeCategoryRef.current)
          : data
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setIsLoading(false);
    }
  }, []); // [] = référence stable

  // Chargement initial uniquement
  useEffect(() => {
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtre côté client — pas d'appel API, juste un filtre sur allProducts
  const filterByCategory = useCallback(
    (categoryId: number | null) => {
      setActiveCategory(categoryId);
      setProducts(
        categoryId
          ? allProducts.filter((p) => p.categoryId === categoryId)
          : allProducts
      );
    },
    [allProducts]
  );

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    filterByCategory,
    activeCategory,
  };
}