import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token");

  if (!token) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token.value, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  } catch {
    return NextResponse.json({ message: "Token invalide" }, { status: 401 });
  }
}
