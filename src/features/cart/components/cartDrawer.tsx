"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Loader2 } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cart.store";
import { CartItem } from "./cartItems";
import { CartEmpty } from "./cartEmpty";
import { AuthGate } from "@/features/auth/components/authGate";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { createOrder } from "@/features/checkout/actions/createOrder";
import { OrderConfirmation } from "@/features/checkout/components/orderConfirmation";
import { FaShoppingCart } from "react-icons/fa";

// ─── Hook : trap focus dans le drawer (accessibilité) ─────────────────────────
function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    el.addEventListener("keydown", handleKeyDown);
    first?.focus();
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [active, ref]);
}

// ─── Composant ────────────────────────────────────────────────────────────────

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());
  const isOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const clearCart = useCartStore((state) => state.clearCart);

  const { user } = useCurrentUser();
  const [showAuthGate, setShowAuthGate] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  // Ajoute ces états dans CartDrawer
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderId: number;
    totalPrice: number;
    itemCount: number;
  } | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  useFocusTrap(drawerRef, isOpen);

  // Fermeture sur Échap
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeDrawer]);

  // Bloque le scroll body quand drawer ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Une seule déclaration — gère les deux cas (connecté / non connecté)
  // Remplace handleCheckout
  const submitOrder = async () => {
    try {
      setIsSubmitting(true);
      setOrderError(null);

      const result = await createOrder(items);

      if (!result.success) {
        setOrderError(result.error);
        return;
      }

      // Commande créée → affiche l'écran de confirmation
      setOrderResult({
        orderId: result.orderId,
        totalPrice: result.totalPrice,
        itemCount: totalItems,
      });
    } catch {
      setOrderError("Une erreur est survenue. Réessaie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      setShowAuthGate(true);
      return;
    }

    void submitOrder();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            key="drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Votre panier"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={[
              "fixed right-0 top-0 z-50",
              "h-full w-full max-w-md",
              "bg-white shadow-2xl",
              "flex flex-col",
              "max-sm:top-auto max-sm:bottom-0 max-sm:h-[90vh] max-sm:rounded-t-3xl",
            ].join(" ")}
          >
            {/* Header */}
            <div id="cart" className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FaShoppingCart size={20} className="text-gray-700" />
                <h2 className="text-base font-bold text-gray-900">
                  Mon panier
                </h2>
                {totalItems > 0 && (
                  <span className="text-xs font-semibold text-white bg-[#EA580C] px-2 py-0.5 rounded-full">
                    {totalItems} article{totalItems > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-400 cursor-pointer hover:text-red-400 transition-colors duration-150"
                  >
                    Tout supprimer
                  </button>
                )}
                <button
                  onClick={closeDrawer}
                  aria-label="Fermer le panier"
                  className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-150"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Liste items */}
            <div
              className="flex-1 overflow-y-auto px-6 py-2"
              aria-live="polite"
              aria-label="Contenu du panier"
            >
              {items.length === 0 ? (
                <CartEmpty onClose={closeDrawer} />
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item, index) => (
                    <CartItem key={`${item.product.id}-${index}`} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-5 border-t border-gray-100 flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Sous-total ({totalItems} article
                        {totalItems > 1 ? "s" : ""})
                      </span>
                      <span>{totalPrice.toLocaleString("fr-FR")} FCFA</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Livraison</span>
                      <span className="text-green-500 font-medium">
                        Gratuite
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>{totalPrice.toLocaleString("fr-FR")} FCFA</span>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    className={[
                      "w-full py-3.5 rounded-full cursor-pointer",
                      "bg-gray-900 text-white text-sm font-semibold",
                      "hover:bg-[#EA580C] transition-colors duration-200",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                      "flex items-center justify-center gap-2",
                    ].join(" ")}
                  >
                    {isSubmitting && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    {isSubmitting ? "Traitement..." : "Valider ma commande"}
                  </motion.button>
                  <p className="text-xs text-gray-400 text-center">
                    Connexion requise avant validation si non connecté
                  </p>
                </motion.div>
              )}

              {/* Erreur commande */}
              {orderError && (
                <p className="text-xs text-red-500 text-center">{orderError}</p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* AuthGate — par-dessus le drawer, panier intact */}
          {showAuthGate && (
            <AuthGate
              onAuthSuccess={() => {
                setShowAuthGate(false);
                void submitOrder();
              }}
              onClose={() => setShowAuthGate(false)}
            />
          )}

          {orderResult && (
            <OrderConfirmation
              orderId={orderResult.orderId}
              totalPrice={orderResult.totalPrice}
              itemCount={orderResult.itemCount}
              onClose={() => {
                setOrderResult(null);
                closeDrawer();
              }}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
