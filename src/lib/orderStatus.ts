import { OrderStatus } from "@prisma/client";

export const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],

  CONFIRMED: ["PREPARING", "CANCELLED"],

  PREPARING: ["READY"],

  READY: ["DELIVERED"],

  DELIVERED: [],

  CANCELLED: [],
};

export function canChangeStatus(
  current: OrderStatus,
  next: OrderStatus
) {
  return allowedTransitions[current].includes(next);
}