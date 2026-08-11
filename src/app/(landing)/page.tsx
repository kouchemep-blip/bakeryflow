import { Hero } from "@/components/landing/hero";
import HowItWorks from "@/components/landing/howItWork";
import WhyChooseUs from "@/components/landing/whyUs";
import { ProductGrid } from "@/features/products/components/ProductsGrid";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <WhyChooseUs />
      <ProductGrid />
    </div>
  );
}
