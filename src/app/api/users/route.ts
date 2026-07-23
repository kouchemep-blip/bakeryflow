import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json(users);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Erreur lors de la récupération de l'utilisateur.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            message: "Email ou téléphone déjà utilisé.",
          },
          {
            status: 409,
          },
        );
      }
    }

    console.log(error);

    return NextResponse.json(
      {
        message: "Erreur serveur.",
      },
      {
        status: 500,
      },
    );
  }
}
