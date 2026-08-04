"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export default function ClientPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) return;

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Bonjour {user ? user.firstName : "..."} 
      </h1>

      <p className="mt-2 text-gray-600">
        Bienvenue dans votre espace client.
      </p>
    </div>
  );
}