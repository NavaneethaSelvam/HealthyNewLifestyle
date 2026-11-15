import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/features/catalog/ProductListing";
import { categories, getCategoryBySlug } from "@/features/catalog/catalog-data";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return {
    title: category ? `${category.name} | Healthy New Lifestyle` : "Category not found",
    description: category
      ? `Explore the ${category.name} category at HealthyNewLifestyle.`
      : undefined,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <ProductListing
      title={category.name}
      description={`Explore the ${category.name} collection.`}
      collection={category}
      categories={categories.filter((item) => item.slug !== category.slug)}
    />
  );
}
