import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    // 1. Chercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 },
      );
    }

    // 2. Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Email ou mot de passe incorrect" },
        { status: 401 },
      );
    }

    // 3. Vérifier si le compte est actif
    if (!user.isActive) {
      return NextResponse.json(
        { message: "Compte désactivé" },
        { status: 403 },
      );
    }

    // 4. Créer le token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    const response = NextResponse.json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        firstName: user.firstName,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    });

    return (
      NextResponse.json({
        message: "Connexion réussie",
        user: {
          id: user.id,
          firstName: user.firstName,
          role: user.role,
        },
      }),
      response
    );  
  }
  
  catch (error) {
    return NextResponse.json(
      {
        message: "Erreur serveur",
      },
      {
        status: 500,
      },
    );
  }
}
