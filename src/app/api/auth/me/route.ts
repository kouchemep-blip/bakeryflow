import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);

  if (!user) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  });
}
