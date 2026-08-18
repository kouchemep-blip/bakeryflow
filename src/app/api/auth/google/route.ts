import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { getGoogleCredentials } from "@/lib/googleAuth";

export async function GET() {
  try {
    const { clientId, clientSecret, redirectUri } = getGoogleCredentials();
    const client = new OAuth2Client(clientId, clientSecret, redirectUri);
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      prompt: "select_account",
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Google OAuth configuration error:", error);
    return NextResponse.json(
      { message: "Authentification Google indisponible." },
      { status: 503 },
    );
  }
}
