import { allowedTransitions, canChangeStatus } from "@/lib/orderStatus";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { order_status } from "@prisma/client";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: Props) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;
  try {
    const { id } = await params;

    const body = await request.json();

    const order = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!order) {
      return NextResponse.json(
        {
          message: "Commande introuvable.",
        },
        {
          status: 404,
        },
      );
    }


    const nextStatus = body.status as order_status;
    if (!Object.values(order_status).includes(nextStatus)) {
      return NextResponse.json({ message: "Statut invalide." }, { status: 400 });
    }

    const currentStatus = order.status;

    if (!allowedTransitions[currentStatus].includes(nextStatus)) {
      return NextResponse.json(
        {
          message: "Transition de statut interdite.",
        },
        {
          status: 400,
        },
      );
    }

    if (!canChangeStatus(order.status, nextStatus)) {
      return NextResponse.json(
        {
          message: "Transition interdite.",
        },
        {
          status: 400,
        },
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        status: nextStatus,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Erreur lors de la modification du statut.",
      },
      {
        status: 500,
      },
    );
  }
}
