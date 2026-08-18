import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/jwt";
import { getGoogleCredentials } from "@/lib/googleAuth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { message: "Code Google manquant." },
      { status: 400 },
    );
  }

  try {
    const { clientId, clientSecret, redirectUri } = getGoogleCredentials();
    const client = new OAuth2Client(clientId, clientSecret, redirectUri);
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return NextResponse.json(
        { message: "Jeton d'identité Google manquant." },
        { status: 401 },
      );
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.sub) {
      return NextResponse.json(
        { message: "Informations Google invalides." },
        { status: 400 },
      );
    }

    const googleId = payload.sub;
    const email = payload.email;
    const firstName = payload.given_name ?? "";
    const lastName = payload.family_name ?? "";
    const avatar = payload.picture ?? null;

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          googleId,
          avatar,
          password: null,
          phone: null,
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          avatar: avatar ?? user.avatar,
        },
      });
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "Compte désactivé." },
        { status: 403 },
      );
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    const destination =
      user.role === "CLIENT" ? "/customers" : "/dashboard";
    const response = NextResponse.redirect(new URL(destination, request.url));

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);

    return NextResponse.json(
      { message: "Authentification Google impossible." },
      { status: 500 },
    );
  }
}
