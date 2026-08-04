"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CustomerStatusButton({ id, isActive }: { id: number; isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function toggle() {
    setLoading(true);
    const response = await fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) });
    setLoading(false);
    if (response.ok) router.refresh();
  }
  return <button disabled={loading} onClick={toggle} className="rounded bg-gray-900 px-3 py-1 text-sm text-white disabled:opacity-50">{isActive ? "Désactiver" : "Activer"}</button>;
}
