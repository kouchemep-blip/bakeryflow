// Skeleton d'une carte produit — affiché pendant le chargement
export function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm animate-pulse">
      {/* Image */}
      <div className="w-full h-48 bg-gray-200" />

      {/* Contenu */}
      <div className="flex flex-col gap-3 p-4">
        {/* Catégorie */}
        <div className="h-3 w-16 bg-gray-200 rounded-full" />
        {/* Nom */}
        <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-full bg-gray-200 rounded-full" />
          <div className="h-3 w-5/6 bg-gray-200 rounded-full" />
        </div>
        {/* Prix + bouton */}
        <div className="flex items-center justify-between mt-2">
          <div className="h-5 w-24 bg-gray-200 rounded-full" />
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}