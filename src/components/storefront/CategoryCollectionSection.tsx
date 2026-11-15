import { categories } from "@/features/catalog/catalog-data";
import { getAllProducts } from "@/features/catalog/products-data";
import { HomepageProductCarousel } from "@/features/homepage/HomepageProductCarousel";

type CategoryCollectionSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  categorySlugs: string[];
  sectionId?: string;
  excludeProductIds?: string[];
  autoPlay?: boolean;
};

export function CategoryCollectionSection({
  eyebrow,
  title,
  description,
  categorySlugs,
  sectionId,
  excludeProductIds = [],
  autoPlay = false,
}: CategoryCollectionSectionProps) {
  const collection = categorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category) => category !== undefined);
  const leadCategory = collection[0];
  const excludedIds = new Set(excludeProductIds);
  const products = getAllProducts().filter(
    (product) =>
      categorySlugs.includes(product.categorySlug) &&
      !excludedIds.has(product.id),
  );

  if (!leadCategory || products.length === 0) return null;

  return (
    <HomepageProductCarousel
      eyebrow={eyebrow}
      title={title}
      description={description}
      products={products}
      sectionId={sectionId ?? leadCategory.slug}
      sectionClassName="hnl-collection-section"
      exploreHref={`/categories/${leadCategory.slug}`}
      exploreLabel="Explore collection"
      autoPlay={autoPlay}
    />
  );
}
