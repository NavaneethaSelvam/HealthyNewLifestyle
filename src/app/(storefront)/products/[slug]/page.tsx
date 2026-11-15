import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/features/catalog/ProductDetails";
import { getAllProducts, getProductBySlug } from "@/features/catalog/products-data";

export function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Healthy New Lifestyle",
    };
  }

  const tamil = product.tamilName ? ` (${product.tamilName})` : "";
  return {
    title: `${product.name}${tamil} | Healthy New Lifestyle`,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
