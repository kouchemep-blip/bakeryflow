import ClientSidebar from "@/components/customers/clientSidebar";
import { MessageNotifier } from "@/components/customers/MessageNotifier";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">

      <ClientSidebar />

      <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-24 md:p-8 md:pb-8">
        {children}
      </main>
      <MessageNotifier />

    </div>
  );
}
