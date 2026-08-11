"use client";
import ClientHeader from "@/components/customers/clientHeader";
import ClientSidebar from "@/components/customers/clientSidebar";
import { MessageNotifier } from "@/components/customers/MessageNotifier";
import { useEffect, useState } from "react";

type UserData = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
  };
  pageTitle?: string;
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
        console.log("User data:", data);
      } catch {}

      setLoading(false);
    }

    loadUser();
  }, []);
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      <ClientSidebar />
       <ClientHeader user={user?.user} pageTitle={user?.pageTitle} />
      <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-24 md:p-8 md:pb-8">
        {children}
      </main>
      <MessageNotifier />
    </div>
  );
}
