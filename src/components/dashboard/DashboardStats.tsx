import StatCard from "./statcard";
const stats = [
  {
    title: "Produits",
    value: 25,
    description: "Produits enregistrés",
  },
  {
    title: "Commandes",
    value: 12,
    description: "Commandes aujourd'hui",
  },
  {
    title: "Messages",
    value: 5,
    description: "Messages non lus",
  },
  {
    title: "Avis",
    value: 18,
    description: "Avis publiés",
  },
];

export default function DashboardStats() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
        />
      ))}
    </section>
  );
}
