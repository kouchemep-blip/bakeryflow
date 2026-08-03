import { allowedTransitions, canChangeStatus } from "@/lib/orderStatus";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: Props) {
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


    const nextStatus = body.status;

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

    const existingOrder = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        {
          message: "Commande introuvable.",
        },
        {
          status: 404,
        },
      );
    }

    if (!canChangeStatus(existingOrder.status, body.status)) {
      return NextResponse.json(
        {
          message: "Transition interdite.",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(order);
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
