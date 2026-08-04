"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderSearch() {
  const router = useRouter();
  const params = useSearchParams();

  const [value, setValue] = useState(params.get("search") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const url = new URLSearchParams(params.toString());

      if (value.trim()) {
        url.set("search", value);
      } else {
        url.delete("search");
      }

      router.push(`/dashboard/orders?${url.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, params, router]);

  return (
    <div className="flex items-center gap-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher une commande..."
        className="w-96 rounded-lg border p-3"
      />
    </div>
  );
}
