import ImmersiveScrollShowcase from "@/components/common/Immersivescrollshowcase ";
const ITEMS = [
  {
    index: "01",
    title: "Découvrez",
    description:
      "Parcourez notre sélection de produits, découvrez ce qui vous fait envie et prenez le temps de choisir vos favoris.",
  },
  {
    index: "02",
    title: "Choisissez",
    description:
      "Ajoutez simplement vos produits au panier, ajustez les quantités et vérifiez votre sélection avant de passer commande.",
  },
  {
    index: "03",
    title: "Commandez",
    description:
      "Validez votre commande en quelques instants et retrouvez toutes les informations nécessaires directement dans votre espace.",
  },
  {
    index: "04",
    title: "Suivez",
    description:
      "Gardez un œil sur votre commande à chaque étape et échangez directement avec nous grâce à la messagerie intégrée.",
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
