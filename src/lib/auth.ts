import { NextRequest } from "next/server";
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
