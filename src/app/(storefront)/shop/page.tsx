import type { Metadata } from "next";
import { ProductListing } from "@/features/catalog/ProductListing";
import { categories } from "@/features/catalog/catalog-data";
import { getAllProducts } from "@/features/catalog/products-data";

export const metadata: Metadata = {
  title: "Shop All | Healthy New Lifestyle",
  description: "Shop traditional rice, native millets, oils and pantry essentials.",
};

export default function ShopPage() {
  const productCategorySlugs = new Set(
    getAllProducts().map((product) => product.categorySlug),
  );

  return (
    <ProductListing
      title="Shop All"
      description="Explore traditional ingredients, pantry favourites and everyday essentials, thoughtfully brought together."
      categories={categories.filter((category) =>
        productCategorySlugs.has(category.slug),
      )}
      isShopAll
    />
  );
}
