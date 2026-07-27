import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function proxy(request: NextRequest) {

  const token = request.cookies.get("token");

  const pathname = request.nextUrl.pathname;


  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }


  let payload;

  try {

    payload = verifyToken(token.value) as {
      id: number;
      role: string;
    };

  } catch {

    return NextResponse.redirect(
      new URL("/login", request.url)
    );

  }


  // Protection dashboard admin

  if (pathname.startsWith("/dashboard")) {

    if (
      payload.role !== "ADMIN" &&
      payload.role !== "SUPER_ADMIN"
    ) {

      return NextResponse.redirect(
        new URL("/", request.url)
      );

    }

  }


  return NextResponse.next();
}


export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};