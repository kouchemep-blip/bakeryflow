const fallbackRedirectUri = "http://localhost:3000/api/auth/google/callback";

export function getGoogleRedirectUri() {
  return process.env.GOOGLE_REDIRECT_URI ?? fallbackRedirectUri;
}

export function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Les identifiants OAuth Google ne sont pas configurés.");
  }

  return { clientId, clientSecret, redirectUri: getGoogleRedirectUri() };
}
