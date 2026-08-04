import { prisma } from "@/lib/prisma";
import { CustomerStatusButton } from "@/components/dashboard/customers/customerStatusButton";

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({ where: { role: "CLIENT" }, select: { id: true, firstName: true, lastName: true, email: true, phone: true, isActive: true, createdAt: true }, orderBy: { createdAt: "desc" } });
  return <section className="space-y-6"><h1 className="text-2xl font-bold">Clients</h1><div className="overflow-x-auto rounded-xl border"><table className="w-full"><thead><tr className="bg-gray-50"><th className="p-3 text-left">Client</th><th className="p-3 text-left">Contact</th><th className="p-3">Statut</th><th className="p-3">Inscription</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id} className="border-t"><td className="p-3">{customer.firstName} {customer.lastName}</td><td className="p-3">{customer.email}<br />{customer.phone}</td><td className="p-3 text-center"><CustomerStatusButton id={customer.id} isActive={customer.isActive} /></td><td className="p-3 text-center">{customer.createdAt.toLocaleDateString("fr-FR")}</td></tr>)}</tbody></table></div></section>;
}
