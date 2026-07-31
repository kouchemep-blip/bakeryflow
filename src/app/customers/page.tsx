import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import { ChatWithChef } from "@/features/client-space/components/ChatWithChef";

export default async function ClientPage() {
  // Récupère le token côté serveur pour le passer au composant chat
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) redirect("/");

  let userId: number;
  try {
    const payload = verifyToken(token.value) as { id: number };
    userId = payload.id;
  } catch {
    redirect("/");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Mon espace client
      </h1>
      <ChatWithChef token={token.value} userId={userId} />
    </main>
  );
}