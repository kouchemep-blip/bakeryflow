"use server";
// Server Action — crée la commande en base depuis le panier Zustand
// Appelée depuis CartDrawer après auth confirmée

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import type { CartItem } from "@/features/cart/cart.types";

type CreateOrderResult =
  | { success: true; orderId: number; totalPrice: number }
  | { success: false; error: string };

export async function createOrder(
  items: CartItem[],
): Promise<CreateOrderResult> {
  // ── 1. Récupère et vérifie le token depuis le cookie ────────────────────
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return { success: false, error: "Non authentifié." };
  }

  let userId: number;
  try {
    const payload = verifyToken(token.value) as { id: number; role: string };
    if (payload.role !== "CLIENT") return { success: false, error: "Seuls les clients peuvent passer commande." };
    userId = payload.id;
  } catch {
    return { success: false, error: "Session invalide." };
  }

  // ── 2. Vérifie que le panier n'est pas vide ──────────────────────────────
  if (!items || items.length === 0) {
    return { success: false, error: "Le panier est vide." };
  }

  // ── 3. Vérifie que tous les produits existent et sont disponibles ────────
  if (items.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1 || item.options.some((option) => option.priceModifier !== 0))) {
    return { success: false, error: "Le contenu du panier est invalide." };
  }
  const productIds = [...new Set(items.map((i) => i.product.id))];
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      status: "AVAILABLE",
    },
  });

  if (products.length !== productIds.length) {
    return {
      success: false,
      error: "Un ou plusieurs produits ne sont plus disponibles.",
    };
  }

  // ── 4. Calcule le prix total côté serveur (ne jamais faire confiance au client) ──
  const priceMap = new Map(products.map((p) => [p.id, p.price]));

  const totalPrice = items.reduce((sum, item) => {
    const serverPrice = priceMap.get(item.product.id) ?? 0;
    return sum + serverPrice * item.quantity;
  }, 0);

  // ── 5. Crée la commande + les OrderItems en transaction ──────────────────
  try {
    const order = await prisma.$transaction(async (tx) => {
      // Crée la commande
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: "PENDING",
        },
      });

      // Crée les lignes de commande
      await tx.orderitem.createMany({
        data: items.map((item) => ({
          orderId: newOrder.id,
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: priceMap.get(item.product.id) ?? 0,
        })),
      });

      // Crée la conversation liée à la commande
      const existingConversation = await tx.conversation.findUnique({
        where: {
          userId,
        },
      });

      if (!existingConversation) {
        await tx.conversation.create({
          data: {
            userId,
          },
        });
      }

      // Vide le CartItem Prisma de l'utilisateur si existant
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
      await tx.cartitem.deleteMany({ where: { cartId: cart.id } });
      }

      return newOrder;
    });

    return { success: true, orderId: order.id, totalPrice };
  } catch (error) {
    console.error("createOrder error:", error);
    return {
      success: false,
      error: "Erreur lors de la création de la commande.",
    };
  }
}
