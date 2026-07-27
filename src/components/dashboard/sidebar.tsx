const NAV_LINK = [
  {
    name : "Tableau de bord", href : "/dashboard"
  },
  {
    name : "Produits", href : "/dashboard/products"
  },
  {
    name : "Commandes", href : "/dashboard/orders"
  },
  {
    name : "Messages", href : "/dashboard/messages"
  },
  {
    name : "Clients", href : "/dashboard/customers"
  },
  {
    name : "Avis", href : "/dashboard/reviews"
  },
  {
    name : "Paramètres", href : "/dashboard/settings"
  },
];

export function DashboardNav() {
  return (
    <div className="relative w-[15vw] bg-amber-400">
      <div className="relative bg-white/10 backdrop-blur-xl backdrop-saturate-150 border-b border-white/15 shadow-[0_4px_30px_rgba(0,0,0,0.1)] w-[0%] h-full left-[25%] rounded-full flex items-center justify-center">
        <ul className="relative flex flex-col gap-20 w-full items-center justify-center">
          {NAV_LINK.map((item) => (
            <li key={item.href} className="text-ls inline-block">
              <div className="nav_light mt-6"></div>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
