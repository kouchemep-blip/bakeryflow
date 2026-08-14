
"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Star,
  Flame,
  Leaf,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useCartStore } from "@/features/cart/store/cart.store";
import { getAverageRating } from "@/types/products";
import type { ProductWithCategoryAndReviews } from "@/types/products";
import { FaShoppingCart } from "react-icons/fa";

type Tag = {
  label: string;
  color: string;
  icon: React.ReactNode;
};

type ProductCardProps = {
  product: ProductWithCategoryAndReviews;
  cartButtonRef?: React.RefObject<HTMLElement | null>;
  onAddToCart?: (productEl: HTMLElement) => void;
  onOpenDetails?: (product: ProductWithCategoryAndReviews) => void;
  className?: string;
};

function resolveTags(product: ProductWithCategoryAndReviews): Tag[] {
  const tags: Tag[] = [];
  const averageRating = getAverageRating(product.review);

  const isNew =
    new Date(product.createdAt).getTime() >
    Date.now() - 7 * 24 * 60 * 60 * 1000;

  const isPopular =
    averageRating !== null &&
    averageRating >= 4.5 &&
    product.review.length >= 3;

  const searchableText = `${product.name} ${product.description}`;

  const isVegetarian = /salade|végé|vegan|légume|legume/i.test(searchableText);

  const isSpicy = /épicé|epice|pimenté|pimente|harissa|spicy/i.test(
    searchableText,
  );

  if (isNew) {
    tags.push({
      label: "Nouveau",
      color: "bg-blue-500",
      icon: <Sparkles size={10} />,
    });
  }

  if (isPopular) {
    tags.push({
      label: "Populaire",
      color: "bg-orange-500",
      icon: <TrendingUp size={10} />,
    });
  }

  if (isVegetarian) {
    tags.push({
      label: "Végé",
      color: "bg-green-500",
      icon: <Leaf size={10} />,
    });
  }

  if (isSpicy) {
    tags.push({
      label: "Épicé",
      color: "bg-red-500",
      icon: <Flame size={10} />,
    });
  }

  return tags;
}

export function ProductCard({
  product,
  onAddToCart,
  onOpenDetails,
  className = "",
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const [buttonState, setButtonState] = useState<"idle" | "added">("idle");
  const productRef = useRef<HTMLElement | null>(null);

  const isUnavailable = product.status === "UNAVAILABLE";
  const averageRating = getAverageRating(product.review);
  const tags = resolveTags(product);

  const titleId = `product-${product.id}-title`;
  const cardId = `product-card-${product.id}`;

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (isUnavailable || buttonState === "added") {
      return;
    }

    addItem({
      product: {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        categoryId: product.categoryId,
      },
    });

    setButtonState("added");

    window.setTimeout(() => {
      setButtonState("idle");
    }, 1500);

    if (onAddToCart && productRef.current) {
      onAddToCart(productRef.current);
    }
  };

  return (
    <>
      <style>{`
        #${cardId} .product-card-title {
          background-image: linear-gradient(currentColor, currentColor);
          background-position: 0% 100%;
          background-repeat: no-repeat;
          background-size: 0% 1px;
          text-decoration: none;
          transition-property: background-size;
          transition-duration: 0.3s;
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }

        #${cardId}:hover .product-card-title,
        #${cardId}:focus-visible .product-card-title {
          background-size: 100% 1px;
        }

        #${cardId}:hover .product-card-btn-icon,
        #${cardId}:focus-visible .product-card-btn-icon {
          transform: scale(0.875);
        }
      `}</style>

      <motion.article
        ref={(element) => {
          productRef.current = element;
        }}
        id={cardId}
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
        aria-labelledby={titleId}
        onClick={() => onOpenDetails?.(product)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenDetails?.(product);
          }
        }}
        role={onOpenDetails ? "button" : undefined}
        tabIndex={onOpenDetails ? 0 : undefined}
        className={[
          "group relative flex min-h-[460px] w-full flex-col overflow-hidden border-none",
          "rounded-[20px] bg-transparent",
          "text-[#222f30] shadow-sm",
          isUnavailable ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          className,
        ].join(" ")}
      >
        {/* Fond crème avec la même forme découpée que le composant initial (derrière le contenu bas) */}
        <figure
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 m-0 rounded-[20px_20px_0_20px] bg-[#F5EFE6]"
          style={{
            clipPath:
              "polygon(100% 0, 100% calc(100% - 75px), calc(100% - 75px) calc(100% - 75px), calc(100% - 75px) 100%, 0 100%, 0 0)",
          }}
        />

        {/* Image — plein bord, mise en valeur, hauteur responsive */}
        <div className="relative z-10 h-60 w-full flex-none overflow-hidden bg-[#f7f7f5] sm:h-64 md:h-72">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 82vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-amber-50 text-4xl">
              🍞
            </div>
          )}

          {isUnavailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800">
                Rupture de stock
              </span>
            </div>
          )}

          {tags.length > 0 && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag.label}
                  className={[
                    "flex items-center gap-1 rounded-full px-2.5 py-1",
                    "text-[10px] font-semibold text-white",
                    tag.color,
                  ].join(" ")}
                >
                  {tag.icon}
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Contenu, padding uniquement ici (pas sur l'image) */}
        <div className="relative z-10 flex flex-1 flex-col gap-3 px-6 py-5">
          <div className="flex items-center justify-between gap-2 font-mono text-[0.7rem] uppercase leading-none tracking-normal text-[#222f30]/50">
            <span>{product.category.name}</span>
            <time dateTime={new Date(product.createdAt).toISOString()}>
              {new Intl.DateTimeFormat("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(product.createdAt))}
            </time>
          </div>

          <h3
            id={titleId}
            className="m-0 line-clamp-2 font-[Aspekta,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[1.375rem] font-normal leading-[1.3em] tracking-[-0.02em]"
          >
            <span className="product-card-title">{product.name}</span>
          </h3>

          <p className="line-clamp-3 m-0 text-sm leading-relaxed text-[#222f30]/65">
            {product.description}
          </p>

          {averageRating !== null && (
            <div className="flex items-center gap-1 font-mono">
              <Star size={13} className="fill-amber-400 text-amber-400" />

              <span className="text-sm font-medium text-[#222f30]">
                {averageRating}
              </span>

              <span className="text-xs text-[#222f30]/50">
                ({product.review.length} avis)
              </span>
            </div>
          )}

          {/* Pied de carte */}
          <div className="mt-auto flex items-end justify-between gap-2 pr-[55px]">
            <div className="flex flex-wrap items-end gap-1 font-mono text-[0.8125rem] uppercase leading-none tracking-[-0.02em]">
              <span className="font-semibold text-[#222f30]">
                {product.price.toLocaleString("fr-FR")} FCFA
              </span>
            </div>

            <span className="font-mono text-[0.8125rem] uppercase leading-none tracking-[-0.02em] text-[#222f30]/70">
              Ajouter
            </span>
          </div>
        </div>

        {/* Bouton décoratif intégré dans l'angle inférieur droit */}
        <div className="absolute bottom-0 right-0 z-20 h-[90px] w-[87px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="87"
            height="90"
            viewBox="0 0 87 90"
            fill="#fff"
            className="absolute bottom-0 right-0 h-full w-full"
            aria-hidden="true"
          >
            <path
              fill="#F5EFE6"
              d="M35.43 45.104 23.71 81.57A12.146 12.146 0 0 1 12.145 90C5.438 90 0 84.562 0 77.854V16C0 7.163 7.163 0 16 0h55c8.837 0 16 7.163 16 16v2c0 8.837-7.163 16-16 16H50.663a16 16 0 0 0-15.232 11.104Z"
            />
          </svg>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isUnavailable}
            aria-label={`Ajouter ${product.name} au panier`}
            className={[
              "absolute bottom-0 right-0 z-30 flex h-12 w-[51px]",
              "items-center justify-center bg-transparent p-0",
              isUnavailable
                ? "cursor-not-allowed text-gray-300"
                : "cursor-pointer text-[#222f30]",
            ].join(" ")}
          >
            <span
              className={[
                "product-card-btn-icon relative block h-full w-full p-2.5 bg-[#222f30] hover:bg-[#222f30]/90 text-white]",
                "origin-center transition-transform duration-500 ease-in-out",
              ].join(" ")}
              style={{
                WebkitMaskImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='51' height='48' viewBox='0 0 51 48' fill='none'%3E%3Cpath fill='%23000' d='M6.728 9.09A12 12 0 0 1 18.369 0H39c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12.37C4.561 48-1.167 40.663.727 33.09l6-24Z'/%3E%3C/svg%3E\")",
                maskImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='51' height='48' viewBox='0 0 51 48' fill='none'%3E%3Cpath fill='%23000' d='M6.728 9.09A12 12 0 0 1 18.369 0H39c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12.37C4.561 48-1.167 40.663.727 33.09l6-24Z'/%3E%3C/svg%3E\")",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            >
              <span
                className={[
                  "absolute inset-[10px] flex items-center justify-center",
                  "rounded-[12px] transition-colors duration-200",
                  isUnavailable
                    ? "bg-gray-100 text-gray-300"
                    : buttonState === "added"
                      ? "bg-green-500 text-white"
                      : "bg-transparent text-[#222f30] ]",
                ].join(" ")}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {buttonState === "added" ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check size={16} strokeWidth={2.5} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="cart"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaShoppingCart size={16} className="text-[#F5EFE6]" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </span>
          </button>
        </div>
      </motion.article>
    </>
  );
}
