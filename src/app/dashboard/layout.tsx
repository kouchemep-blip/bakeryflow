import Hearder from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/sidebar"

export default function DashboardLayout ({
  children,
}: {
  children : React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardNav />
      <div className="min-w-0 flex flex-1 flex-col">
        <Hearder />
        <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-24 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
