import { Hero } from "@/components/landing/hero";
import { CartDrawer } from "@/features/cart/components/cartDrawer";
import { ProductGrid } from "@/features/products/components/ProductsGrid";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <ProductGrid />
      <CartDrawer />
    </div>
  );
}
