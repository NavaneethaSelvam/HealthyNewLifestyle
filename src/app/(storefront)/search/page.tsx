import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getAllProducts } from "@/features/catalog/products-data";
import { categories } from "@/features/catalog/catalog-data";
import { ProductCard } from "@/components/storefront/ProductCard";

export const metadata: Metadata = {
  title: "Search Results | Healthy New Lifestyle",
  description: "Search traditional rice, millets, cold pressed oils and organic staples.",
};

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const allProducts = getAllProducts();

  const matchedProducts = query
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.categoryName.toLowerCase().includes(query) ||
          (p.tamilName && p.tamilName.includes(query)) ||
          p.description.toLowerCase().includes(query) ||
          p.benefits.some((b) => b.toLowerCase().includes(query))
      )
    : [];

  const matchedCategories = query
    ? categories.filter((c) => c.name.toLowerCase().includes(query))
    : [];

  return (
    <main className="hnl-page hnl-search-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Search</span>
          {query && (
            <>
              <span aria-hidden="true">/</span>
              <span>&quot;{q}&quot;</span>
            </>
          )}
        </nav>

        <header className="hnl-page-heading">
          <span className="hnl-eyebrow">CATALOG SEARCH</span>
          <h1>
            {query ? `Results for "${q}"` : "Search Organic & Traditional Staples"}
          </h1>
          <p>
            {matchedProducts.length > 0
              ? `Found ${matchedProducts.length} matching products and ${matchedCategories.length} categories.`
              : query
              ? `No exact matches found for "${q}". Try popular searches like "Rice", "Millet", "Oil", or "Health Mix".`
              : "Search products and categories in the current catalog."}
          </p>
        </header>

        {/* Matched Category Chips */}
        {matchedCategories.length > 0 && (
          <div className="hnl-search-cats-bar">
            <span className="hnl-search-cats-label">Related Categories:</span>
            <div className="hnl-category-chips">
              {matchedCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="hnl-category-chip"
                >
                  {c.name} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Matched Products Grid */}
        {matchedProducts.length > 0 ? (
          <section className="hnl-search-results-section">
            <div className="hnl-products-grid">
              {matchedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ) : (
          <div className="hnl-empty-state">
            <div className="hnl-empty-state-icon">🔍</div>
            <h2>Looking for something specific?</h2>
            <p>
              Browse catalog categories and products:
            </p>
            <div className="hnl-popular-search-tags">
              <Link href="/search?q=Rice" className="hnl-search-tag">Karuppu Kavuni Rice</Link>
              <Link href="/search?q=Millet" className="hnl-search-tag">Organic Foxtail Millet</Link>
              <Link href="/search?q=Oil" className="hnl-search-tag">Wood Pressed Sesame Oil</Link>
              <Link href="/search?q=Health+Mix" className="hnl-search-tag">Sprouted Ragi Mix</Link>
              <Link href="/search?q=Jaggery" className="hnl-search-tag">Palm Karupatti</Link>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <Link href="/shop" className="hnl-button">
                Browse All Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="hnl-page">
          <div className="hnl-container hnl-loading-state">
            <div className="hnl-spinner"></div>
            <p>Searching traditional farm catalog…</p>
          </div>
        </main>
      }
    >
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}
