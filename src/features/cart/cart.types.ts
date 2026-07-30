// Types du panier — alignés sur le schéma Prisma (Product, CartItem)
// Pas de variantes dans le schéma actuel → options vide pour l'instant,
// prévu pour extension future

export type CartItemOption = {
  label: string;        // ex: "Taille"
  value: string;        // ex: "Large"
  priceModifier: number; // FCFA additionnel (0 si aucun)
};

export type CartProduct = {
  id: number;           // Product.id Prisma
  name: string;         // Product.name
  image: string;        // Product.image
  price: number;        // Product.price en FCFA
  categoryId: number;   // Product.categoryId
};

export type CartItem = {
  // id unique dans le panier = productId (+ options sérialisées si variantes)
  cartItemId: string;
  product: CartProduct;
  quantity: number;
  options: CartItemOption[]; // [] pour les produits sans variante
  totalPrice: number;        // (product.price + somme options) × quantity
};