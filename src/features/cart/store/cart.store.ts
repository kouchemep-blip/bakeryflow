import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartItemOption, CartProduct } from "../cart.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Id unique par combinaison produit + options choisies
// Produit sans option → id = "42"
// Produit avec options → id = "42__Taille:Large|Sup:Fromage"
function buildCartItemId(
  productId: number,
  options: CartItemOption[]
): string {
  const suffix = options.map((o) => `${o.label}:${o.value}`).join("|");
  return suffix ? `${productId}__${suffix}` : String(productId);
}

// Prix total d'une ligne : (base + modificateurs) × quantité
function computeLineTotal(
  basePrice: number,
  options: CartItemOption[],
  quantity: number
): number {
  const extra = options.reduce((sum, o) => sum + o.priceModifier, 0);
  return (basePrice + extra) * quantity;
}

// ─── Payload d'ajout ──────────────────────────────────────────────────────────

export type AddItemPayload = {
  product: CartProduct;
  options?: CartItemOption[]; // optionnel, [] par défaut
};

// ─── State ────────────────────────────────────────────────────────────────────

type CartState = {
  items: CartItem[];
  isDrawerOpen: boolean;

  // Actions
  addItem: (payload: AddItemPayload) => void;
  removeOne: (cartItemId: string) => void;
  removeLine: (cartItemId: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;

  // Sélecteurs (fonctions car recalculés depuis items à chaque appel)
  totalItems: () => number;
  totalPrice: () => number;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      // ── Ajouter / incrémenter ────────────────────────────────────────────
      addItem: ({ product, options = [] }) => {
        const cartItemId = buildCartItemId(product.id, options);
        const existing = get().items.find((i) => i.cartItemId === cartItemId);

        if (existing) {
          // Ligne déjà présente → incrémente
          set((state) => ({
            items: state.items.map((i) =>
              i.cartItemId === cartItemId
                ? {
                    ...i,
                    quantity: i.quantity + 1,
                    totalPrice: computeLineTotal(
                      i.product.price,
                      i.options,
                      i.quantity + 1
                    ),
                  }
                : i
            ),
          }));
        } else {
          // Nouveau produit → nouvelle ligne
          const newItem: CartItem = {
            cartItemId,
            product,
            options,
            quantity: 1,
            totalPrice: computeLineTotal(product.price, options, 1),
          };
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },

      // ── Retire 1 quantité (supprime la ligne si quantity = 1) ────────────
      removeOne: (cartItemId) => {
        set((state) => ({
          items: state.items
            .map((i) =>
              i.cartItemId === cartItemId
                ? {
                    ...i,
                    quantity: i.quantity - 1,
                    totalPrice: computeLineTotal(
                      i.product.price,
                      i.options,
                      i.quantity - 1
                    ),
                  }
                : i
            )
            .filter((i) => i.quantity > 0),
        }));
      },

      // ── Supprime toute la ligne ──────────────────────────────────────────
      removeLine: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },

      // ── Vide le panier ───────────────────────────────────────────────────
      clearCart: () => set({ items: [] }),

      // ── Drawer ──────────────────────────────────────────────────────────
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      // ── Sélecteurs ──────────────────────────────────────────────────────

      // Nombre total d'articles (somme des quantités)
      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      // Prix total du panier en FCFA
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.totalPrice, 0),
    }),

    {
      name: "bakeryflow-cart",             // clé localStorage
      storage: createJSONStorage(() => localStorage),
      // Persiste uniquement les items — drawer toujours fermé au refresh
      partialize: (state) => ({ items: state.items }),
    }
  )
);