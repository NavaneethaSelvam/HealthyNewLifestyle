import { BestSellersSection } from "@/features/homepage/BestSellersSection";
import { CategoryCarousel } from "@/features/homepage/CategoryCarousel";
import { CategoryCollectionSection } from "@/components/storefront/CategoryCollectionSection";
import { FarmerStoriesSection } from "@/features/homepage/FarmerStoriesSection";
import { HeroCarousel } from "@/features/homepage/HeroCarousel";
import { NewsletterSection } from "@/features/homepage/NewsletterSection";
import { RecipesSection } from "@/features/homepage/RecipesSection";
import { TrustSection } from "@/features/homepage/TrustSection";
import { getFeaturedProducts } from "@/features/catalog/products-data";

export function Homepage() {
  const bestSellerProducts = getFeaturedProducts();
  const bestSellerIds = bestSellerProducts.slice(0, 4).map((product) => product.id);

  return (
    <main className="hnl-home" id="main">
      <HeroCarousel />
      <CategoryCarousel />

      <BestSellersSection products={bestSellerProducts} />

      <CategoryCollectionSection
        eyebrow="HERITAGE GRAINS"
        title="Traditional Rice & Native Millets"
        description="Discover heirloom rice and native millets for everyday South Indian cooking."
        categorySlugs={["traditional-rice", "millets"]}
        sectionId="rice-and-millets"
        autoPlay
      />
      <CategoryCollectionSection
        eyebrow="TRADITIONAL PANTRY"
        title="Cold-Pressed Oils & Ghee"
        description="Explore wood-pressed oils and traditional ghee from the pantry range."
        categorySlugs={["ghee-and-wood-press-oil"]}
        sectionId="cold-pressed-oils"
        autoPlay
      />
      <CategoryCollectionSection
        eyebrow="PANTRY ESSENTIALS"
        title="Spices, Masalas & Pantry Essentials"
        description="Build flavour into everyday meals with pantry staples from the current collection."
        categorySlugs={[
          "natural-sweeteners",
          "pulses-and-dal",
          "spice-powder",
          "dried-herbs-leaves",
        ]}
        sectionId="spices-and-pantry"
        excludeProductIds={bestSellerIds}
        autoPlay
      />
      <CategoryCollectionSection
        eyebrow="GOOD FOOD, EVERY DAY"
        title="Healthy Food & Everyday Essentials"
        description="Find easy-to-use traditional favourites for breakfast, snacks and everyday meals."
        categorySlugs={[
          "flakes-aval-varieties",
          "pickle-jam-spread",
          "health-mix",
          "natural-sweeteners",
        ]}
        sectionId="everyday-essentials"
        autoPlay
      />

      <FarmerStoriesSection />
      <RecipesSection />
      <TrustSection />
      <NewsletterSection />
    </main>
  );
}
