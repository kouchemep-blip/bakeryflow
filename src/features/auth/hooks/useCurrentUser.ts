"use client";
import { useState, useEffect, useCallback } from "react";

export type CurrentUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type UseCurrentUserReturn = {
  user: CurrentUser | null;
  isLoading: boolean;
  refetch: () => void;
};

export function useCurrentUser(): UseCurrentUserReturn {
  const [user, setUser]           = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useCallback stable — pas de dépendances changeantes
  const fetchUser = useCallback(() => {
    setIsLoading(true);

    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        // setState dans un callback .then() — pas dans le corps de l'effet
        setUser(data ?? null);
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]); // fetchUser stable → s'exécute une seule fois

  return { user, isLoading, refetch: fetchUser };
}