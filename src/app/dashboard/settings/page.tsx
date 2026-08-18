import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { ProfileForm } from "@/features/client-space/components/ProfileForm";
import { User2, ShieldCheck } from "lucide-react";

export default async function SettingsPage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");

  let userId: number;
  try {
    userId = (verifyToken(token) as { id: number }).id;
  } catch {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatar: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 mt-[26vh] lg:mt-[12vh]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
            <User2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Compte
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Mon profil administrateur
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Mettez à jour vos coordonnées, votre avatar et votre mot de passe.
            </p>
          </div>

          <div className="ml-auto hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </div>
        </div>
      </div>

      <ProfileForm profile={{ ...user, phone: user.phone ?? "" }} />
    </section>
  );
}
