"use client";

import type { Product } from "@/types/storefront";
import { HomepageProductCarousel } from "@/features/homepage/HomepageProductCarousel";

export function BestSellersSection({ products }: { products: Product[] }) {
  return (
    <HomepageProductCarousel
      eyebrow="FEATURED PRODUCTS"
      title="Best Sellers"
      description="A selection of products from the current catalog."
      products={products}
      sectionId="best-sellers"
      sectionClassName="hnl-bestsellers-section"
      exploreHref="/shop"
      exploreLabel="Explore all products"
    />
  );
}
