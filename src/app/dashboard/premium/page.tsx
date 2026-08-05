import Link from "next/link";

export default function PremiumPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-amber-100 bg-white p-8 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">BakeryFlow Premium</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Fonctionnalités Premium</h1>
        <p className="mt-3 text-gray-600">Les statistiques avancées et les rapports détaillés seront bientôt disponibles dans votre espace administrateur.</p>
      </div>
      <Link href="/dashboard/settings" className="inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600">
        Gérer les paramètres
      </Link>
    </section>
  );
}
