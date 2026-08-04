import { Prisma, order_status } from "@prisma/client";

export type OrderWithUserAndItems = Prisma.orderGetPayload<{
  include: { user: true; orderitem: { include: { product: true } } };
}>;

export type OrderItemWithProduct = Prisma.orderitemGetPayload<{
  include: { product: true };
}>;

export type OrderStatus = order_status;
