import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "./jwt";

export async function getCurrentUser(request: NextRequest) {

  const token = request.cookies.get("token");

  if (!token) {
    return null;
  }

  try {

    const payload = verifyToken(token.value) as {
      id: number;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    return user;

  } catch {

    return null;

  }

}

export function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export async function requireUser(request: NextRequest) {
  const user = await getCurrentUser(request);
  return user ?? NextResponse.json({ message: "Non authentifié." }, { status: 401 });
}

export async function requireAdmin(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
  if (!isAdmin(user.role)) return NextResponse.json({ message: "Accès administrateur requis." }, { status: 403 });
  return user;
}
