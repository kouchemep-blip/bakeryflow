import { order_status } from "@prisma/client";

export const allowedTransitions: Record<order_status, order_status[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],

  CONFIRMED: ["PREPARING", "CANCELLED"],

  PREPARING: ["READY"],

  READY: ["DELIVERED"],

  DELIVERED: [],

  CANCELLED: [],
};

export function canChangeStatus(
  current: order_status,
  next: order_status
) {
  return allowedTransitions[current].includes(next);
}
