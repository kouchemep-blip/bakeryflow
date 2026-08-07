import { prisma } from "@/lib/prisma";
import { CustomerStatusButton } from "@/components/dashboard/customers/customerStatusButton";
import { Users, Mail, Phone, CalendarDays } from "lucide-react";

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CLIENT" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 mt-[26vh] lg:mt-[12vh]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Clients
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {customers.length} clients
          </div>
        </div>
      </div>

      <div className="overflow<-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-x-hidden">
          <table className="min-w-[900px] w-full border-collapse">
            <thead className="bg-slate-50 text-left text-sm text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 text-center font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">Inscription</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => {
                const initials =
                  `${customer.firstName?.[0] ?? ""}${customer.lastName?.[0] ?? ""}`.toUpperCase();

                return (
                  <tr key={customer.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-sm font-bold uppercase text-slate-700">
                          {initials || "CL"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {customer.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <CustomerStatusButton
                        id={customer.id}
                        isActive={customer.isActive}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                        {customer.createdAt.toLocaleDateString("fr-FR")}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
