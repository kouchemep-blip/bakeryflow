import ClientSidebar from "@/components/customers/clientSidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">

      <ClientSidebar />

      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}