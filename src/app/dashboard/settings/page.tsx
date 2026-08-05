import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { ProfileForm } from "@/features/client-space/components/ProfileForm";

export default async function SettingsPage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");
  let userId: number;
  try { userId = (verifyToken(token) as { id: number }).id; } catch { redirect("/login"); }
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { firstName: true, lastName: true, email: true, phone: true, avatar: true } });
  if (!user) redirect("/login");
  return <section className="space-y-6"><div><h1 className="text-2xl font-bold">Mon profil administrateur</h1><p className="mt-1 text-gray-500">Mettez à jour vos coordonnées, votre avatar et votre mot de passe.</p></div><ProfileForm profile={user} /></section>;
}
