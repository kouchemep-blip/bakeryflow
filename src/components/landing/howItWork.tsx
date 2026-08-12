import ImmersiveScrollShowcase from "@/components/common/Immersivescrollshowcase ";

const ITEMS = [
  {
    index: "01",
    title: "Découvrez",
    description:
      "Parcourez notre sélection de produits, découvrez ce qui vous fait envie et prenez le temps de choisir vos favoris.",
    actionLabel: "Voir les produits",
    href: "/#plats",
    icon: "search",
  },
  {
    index: "02",
    title: "Choisissez",
    description:
      "Ajoutez simplement vos produits au panier, ajustez les quantités et vérifiez votre sélection avant de passer commande.",
    actionLabel: "Voir mon panier",
    href: "/#cart",
    icon: "shopping-bag",
  },
  {
    index: "03",
    title: "Commandez",
    description:
      "Validez votre commande en quelques instants et retrouvez toutes les informations nécessaires directement dans votre espace.",
    actionLabel: "Passer commande",
    // Remplace uniquement cette valeur par la route protégée déjà utilisée
    // par ton bouton ou ta page de commande.
    href: "/#cart",
    icon: "check",
  },
  {
    index: "04",
    title: "Suivez",
    description:
      "Gardez un œil sur votre commande à chaque étape et échangez directement avec nous grâce à la messagerie intégrée.",
    actionLabel: "Suivre ma commande",
    // Cette route doit être la route client existante et protégée.
    href: "/customers/orders",
    icon: "package",
  },
];

export default function HowItWorks() {
  return (
    <main>
      <ImmersiveScrollShowcase
        eyebrow="Le parcours"
        title="Comment ça marche ?"
        items={ITEMS}
      />
    </main>
  );
}