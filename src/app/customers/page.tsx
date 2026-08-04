"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Home,
  ShoppingBag,
  MessageCircle,
  User,
  ShieldCheck,
} from "lucide-react";

type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export default function ClientPage() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) return;

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Bonjour {user?.firstName ?? "..."} 
          </h1>

          <p className="mt-2 text-gray-500 font-merienda">
            Heureux de vous retrouver sur votre espace client.
            Retrouvez ici vos commandes, vos discussions avec notre équipe
            ainsi que les informations liées à votre compte.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-white font-medium hover:bg-orange-600 transition"
        >
          <Home size={20} />
          Retour à l&apos;accueil
        </Link>

      </div>

      {/* Cartes */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
          <User className="text-orange-500" size={32} />

          <h2 className="mt-4 text-lg font-semibold">
            Mon compte
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Consultez et modifiez vos informations personnelles.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
          <ShoppingBag className="text-green-600" size={32} />

          <h2 className="mt-4 text-lg font-semibold">
            Mes commandes
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Suivez facilement toutes vos commandes et leur statut.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
          <MessageCircle className="text-blue-600" size={32} />

          <h2 className="mt-4 text-lg font-semibold">
            Messagerie
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Discutez directement avec notre équipe en cas de besoin.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
          <ShieldCheck className="text-purple-600" size={32} />

          <h2 className="mt-4 text-lg font-semibold">
            Statut du compte
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Connecté en tant que{" "}
            <span className="font-semibold text-gray-700">
              {user?.role ?? "..."}
            </span>
          </p>
        </div>

      </div>

      {/* Bannière */}

      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 p-8 text-white">

        <h2 className="text-2xl font-bold">
          Merci pour votre confiance 
        </h2>

        <p className="mt-3 max-w-2xl opacity-95">
          Nous mettons tout en œuvre pour vous proposer des repas
          savoureux et un service rapide. N&apos;hésitez pas à passer
          une nouvelle commande ou à nous contacter via la messagerie.
        </p>

      </div>

    </div>
  );
}