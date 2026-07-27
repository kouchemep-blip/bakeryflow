import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/jwt";

export async function GET() {
  return Response.json({
    message: "API Login OK"
  });
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json({ message: "Compte désactivé" }, { status: 403 });
    }

    const token = generateToken({ id: user.id, role: user.role });
    const response = NextResponse.json({
      message: "Connexion réussie",
      user: { id: user.id, firstName: user.firstName, role: user.role },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
