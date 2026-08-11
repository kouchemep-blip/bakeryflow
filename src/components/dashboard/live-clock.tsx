// components/dashboard/live-clock.tsx
"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const timer = setInterval(update, 1000 * 30);
    update(); // Initial call
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const date = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex items-center gap-2 text-sm ">
      <span className="capitalize">{date}</span>
      <span className="h-1 w-1 rounded-full bg-[#F5F1EA]/40" />
      <span className="font-medium text-black">{time}</span>
    </div>
  );
}