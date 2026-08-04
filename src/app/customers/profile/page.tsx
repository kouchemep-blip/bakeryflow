import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");

  let id: number;
  try {
    id = (verifyToken(token) as { id: number }).id;
  } catch {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({ where: { id }, select: { firstName: true, lastName: true, email: true, phone: true, createdAt: true } });
  if (!user) redirect("/login");
  return <section className="space-y-6"><h1 className="text-3xl font-bold">Mon profil</h1><div className="rounded-xl border bg-white p-6 space-y-3"><p><strong>Nom :</strong> {user.firstName} {user.lastName}</p><p><strong>Email :</strong> {user.email}</p><p><strong>Téléphone :</strong> {user.phone}</p><p><strong>Membre depuis :</strong> {user.createdAt.toLocaleDateString("fr-FR")}</p></div></section>;
}
