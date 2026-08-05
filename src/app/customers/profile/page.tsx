import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { ProfileForm } from "@/features/client-space/components/ProfileForm";

export default async function ProfilePage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");
  let id: number; try { id = (verifyToken(token) as { id: number }).id; } catch { redirect("/login"); }
  const user = await prisma.user.findUnique({ where: { id }, select: { firstName: true, lastName: true, email: true, phone: true, avatar: true, createdAt: true } });
  if (!user) redirect("/login");
  return <section className="space-y-6"><div><h1 className="text-3xl font-bold">Mon profil</h1><p className="mt-2 text-gray-500">Membre depuis le {user.createdAt.toLocaleDateString("fr-FR")}</p></div><ProfileForm profile={user} /></section>;
}
