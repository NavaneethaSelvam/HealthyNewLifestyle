"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { StoreCategory } from "@/features/catalog/catalog-data";
import { getAllProducts } from "@/features/catalog/products-data";
import { ProductCard } from "@/components/storefront/ProductCard";

interface ProductListingProps {
  title: string;
  description?: string;
  categories: StoreCategory[];
  collection?: StoreCategory;
  isShopAll?: boolean;
}

type SortOption = "featured" | "price-asc" | "price-desc" | "name";
type AvailabilityFilter = "all" | "in-stock" | "out-of-stock";

const categoryHeroArtwork: Record<string, string> = {
  "traditional-rice": "/images/banners/hero-traditional-pantry.png",
  millets: "/images/banners/hero-organic-millets.png",
};

const catalogProductImageSizes =
  "(max-width: 620px) 90vw, (max-width: 900px) 33vw, 25vw";

export function ProductListing({
  title,
  description,
  categories: otherCategories,
  collection,
  isShopAll = false,
}: ProductListingProps) {
  const prefersReducedMotion = useReducedMotion();
  const allProducts = useMemo(() => getAllProducts(), []);
  const shopHeroProducts = useMemo(
    () =>
      ["traditional-rice", "millets", "pulses-and-dal", "spice-powder"]
        .map((categorySlug) =>
          allProducts.find((product) => product.categorySlug === categorySlug),
        )
        .filter((product) => product !== undefined),
    [allProducts],
  );
  const collectionProducts = useMemo(
    () =>
      collection
        ? allProducts.filter((product) => product.categorySlug === collection.slug)
        : [],
    [allProducts, collection],
  );
  const collectionHeroImage =
    collection && (categoryHeroArtwork[collection.slug] ?? collection.image);
  const usesTransparentHeroArtwork = Boolean(
    collection && categoryHeroArtwork[collection.slug],
  );

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>(
    collection ? collection.slug : "all"
  );
  const [priceRange, setPriceRange] = useState<string>("all");
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const populatedCategories = otherCategories.filter((category) =>
    allProducts.some((product) => product.categorySlug === category.slug),
  );
  const browseCategories = collection
    ? [collection, ...populatedCategories]
    : populatedCategories;

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
          return false;
        }

        const hasAvailableVariant =
          p.variants.length === 0 || p.variants.some((variant) => variant.inStock);
        const isAvailable = p.inStock && hasAvailableVariant;
        if (availability === "in-stock" && !isAvailable) return false;
        if (availability === "out-of-stock" && isAvailable) return false;

        const query = productSearch.trim().toLowerCase();
        if (
          query &&
          ![
            p.name,
            p.tamilName ?? "",
            p.categoryName,
            p.shortDescription,
            p.description,
          ].some((value) => value.toLowerCase().includes(query))
        ) {
          return false;
        }

        // Price range filter
        const prices = [p.price, ...p.variants.map((variant) => variant.price)];
        if (priceRange === "under-200" && !prices.some((price) => price < 200)) {
          return false;
        }
        if (
          priceRange === "200-400" &&
          !prices.some((price) => price >= 200 && price <= 400)
        ) {
          return false;
        }
        if (priceRange === "above-400" && !prices.some((price) => price > 400)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        // Featured default
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    allProducts,
    selectedCategory,
    productSearch,
    priceRange,
    availability,
    sortBy,
  ]);

  const hasActiveFilters =
    (collection ? selectedCategory !== collection.slug : selectedCategory !== "all") ||
    productSearch.trim() !== "" ||
    priceRange !== "all" ||
    availability !== "all";

  const clearAllFilters = () => {
    setSelectedCategory(collection ? collection.slug : "all");
    setProductSearch("");
    setPriceRange("all");
    setAvailability("all");
    setSortBy("featured");
    setCurrentPage(1);
  };
  const pageCount = Math.ceil(filteredProducts.length / pageSize);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const firstVisibleProduct =
    filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisibleProduct = Math.min(
    currentPage * pageSize,
    filteredProducts.length,
  );

  return (
    <main
      className={`hnl-page hnl-catalog-page${isShopAll ? " hnl-shop-all-page" : ""}${collection ? " hnl-category-page" : ""}`}
    >
      <div className="hnl-container">
        {/* Breadcrumb */}
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          {collection ? (
            <>
              <Link href="/shop">Shop</Link>
              <span aria-hidden="true">/</span>
              <span>{collection.name}</span>
            </>
          ) : (
            <span>Shop All Products</span>
          )}
        </nav>

        {/* Collection banner if single collection */}
        {collection ? (
          <motion.section
            className="hnl-collection-banner"
            aria-labelledby="category-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="hnl-collection-banner-content">
              <span className="hnl-eyebrow">
                COLLECTION&nbsp;·&nbsp;{collection.name.toUpperCase()}
              </span>
              <h1 id="category-title">{collection.name}</h1>
              <p>
                {description ||
                  `Discover our thoughtfully curated ${collection.name} selection — rooted in heritage, crafted for a healthy lifestyle.`}
              </p>
              <div className="hnl-category-banner-meta">
                <span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="6.5" stroke="#173d2b" strokeWidth="1.2"/>
                    <path d="M4 7h6M7 4v6" stroke="#173d2b" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  {collectionProducts.length}{" "}
                  {collectionProducts.length === 1 ? "product" : "products"} in this collection
                </span>
                <a href="#hnl-products-grid">
                  Explore Products <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className="hnl-collection-banner-media" aria-hidden="true">
              <motion.div
                className="hnl-category-hero-artwork"
                animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src={collectionHeroImage ?? collection.image}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 90vw, 42vw"
                  className={`hnl-collection-banner-img${usesTransparentHeroArtwork ? " hnl-collection-banner-img--artwork" : ""}`}
                  priority
                />
              </motion.div>
            </div>
          </motion.section>
        ) : isShopAll ? (
          <section className="hnl-shop-hero" aria-labelledby="shop-all-title">
            <motion.div
              className="hnl-shop-hero-copy"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="hnl-shop-hero-badge">ORGANIC PANTRY</span>
              <h1 id="shop-all-title">{title}</h1>
              <p>{description}</p>
              <span className="hnl-shop-hero-note">
                Thoughtfully sourced. Rooted in tradition.
              </span>
            </motion.div>

            <motion.div
              className="hnl-shop-hero-art"
              aria-hidden="true"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.12, ease: "easeOut" }}
            >
              <span className="hnl-shop-hero-art-halo" />
              <span className="hnl-shop-hero-leaf hnl-shop-hero-leaf--one">
                <svg viewBox="0 0 90 90" fill="none">
                  <path d="M13 72C18 40 39 18 76 13 72 49 51 71 13 72Z" />
                  <path d="M18 72C35 53 49 39 70 21" />
                </svg>
              </span>
              <span className="hnl-shop-hero-leaf hnl-shop-hero-leaf--two">
                <svg viewBox="0 0 90 90" fill="none">
                  <path d="M13 72C18 40 39 18 76 13 72 49 51 71 13 72Z" />
                  <path d="M18 72C35 53 49 39 70 21" />
                </svg>
              </span>
              <div className="hnl-shop-hero-grains">
                <Image
                  src="/images/spice-bowl.jpg"
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 760px) 90vw, 42vw"
                />
              </div>
              <div className="hnl-shop-hero-products">
                {shopHeroProducts.map((product) => (
                  <div className="hnl-shop-hero-product" key={product.id}>
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="(max-width: 760px) 26vw, 12vw"
                    />
                    <span>{product.categoryName}</span>
                  </div>
                ))}
              </div>
              <span className="hnl-shop-hero-stamp">GOOD FOOD<br />GOOD ROOTS</span>
            </motion.div>
          </section>
        ) : (
          <header className="hnl-page-heading">
            <span className="hnl-eyebrow">ORGANIC PANTRY</span>
            <h1>{title}</h1>
            <p className="hnl-catalog-subtitle">
              {description ||
                "Browse rice, millets, oils and other food and household categories listed by OrganicandNutrition."}
            </p>
          </header>
        )}

        {collection && (
          <nav className="hnl-category-collections" aria-label="Browse Heritage and Organic Collections">
            <div className="hnl-category-collections-heading">
              <span className="hnl-eyebrow">BROWSE COLLECTIONS</span>
              <span>Find more from the pantry</span>
            </div>
            <div className="hnl-category-collections-links">
              {browseCategories.map((category) => (
                <Link
                  className={category.slug === collection.slug ? "is-active" : ""}
                  href={`/categories/${category.slug}`}
                  key={category.slug}
                  aria-current={category.slug === collection.slug ? "page" : undefined}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
        )}

        {!collection && (
          <nav className="hnl-shop-category-nav" aria-label="Shop categories">
            <Link
              className={selectedCategory === "all" ? "is-active" : ""}
              href="/shop"
              onClick={() => {
                setSelectedCategory("all");
                setCurrentPage(1);
              }}
            >
              All products
            </Link>
            {populatedCategories.map((category) => (
              <Link
                className={selectedCategory === category.slug ? "is-active" : ""}
                href={`/categories/${category.slug}`}
                key={category.slug}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Catalog Control Bar */}
        <motion.div
          className="hnl-catalog-controls"
          initial={isShopAll ? { opacity: 0, y: 12 } : false}
          whileInView={isShopAll ? { opacity: 1, y: 0 } : undefined}
          viewport={isShopAll ? { once: true, amount: 0.15 } : undefined}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="hnl-catalog-search">
            <label htmlFor="catalog-search">Search products</label>
            <input
              id="catalog-search"
              type="search"
              value={productSearch}
              onChange={(event) => {
                setProductSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Name, category or ingredient"
            />
          </div>

          <div className="hnl-catalog-count" aria-live="polite">
            Showing <strong>{firstVisibleProduct}–{lastVisibleProduct}</strong> of{" "}
            <strong>{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </div>

          <div className="hnl-catalog-actions">
            <button
              type="button"
              className="hnl-button hnl-button--outline hnl-mobile-filter-trigger"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              aria-expanded={mobileFilterOpen}
              aria-controls="catalog-filters"
            >
              Filters {hasActiveFilters && "•"}
            </button>

            <div className="hnl-sort-wrapper">
              <label htmlFor="sort-select" className="hnl-sort-label">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="hnl-select"
              >
                <option value="featured">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="hnl-active-filters" aria-label="Active filters">
            <span className="hnl-active-filters-label">Active filters:</span>
            {selectedCategory !== "all" && (!collection || selectedCategory !== collection.slug) && (
              <span className="hnl-filter-chip">
                Category: {otherCategories.find((category) => category.slug === selectedCategory)?.name ?? selectedCategory}
                <button type="button" onClick={() => { setSelectedCategory("all"); setCurrentPage(1); }}>×</button>
              </span>
            )}
            {productSearch.trim() !== "" && (
              <span className="hnl-filter-chip">
                Search: {productSearch}
                <button type="button" onClick={() => { setProductSearch(""); setCurrentPage(1); }}>×</button>
              </span>
            )}
            {priceRange !== "all" && (
              <span className="hnl-filter-chip">
                Price: {priceRange === "under-200" ? "Under ₹200" : priceRange === "200-400" ? "₹200 - ₹400" : "Above ₹400"}
                <button type="button" onClick={() => { setPriceRange("all"); setCurrentPage(1); }}>×</button>
              </span>
            )}
            {availability !== "all" && (
              <span className="hnl-filter-chip">
                Availability: {availability === "in-stock" ? "In stock" : "Out of stock"}
                <button type="button" onClick={() => { setAvailability("all"); setCurrentPage(1); }}>×</button>
              </span>
            )}
            <button
              type="button"
              className="hnl-text-button hnl-clear-filters-btn"
              onClick={clearAllFilters}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Catalog Main Layout (Sidebar + Grid) */}
        <div className="hnl-catalog-layout">
          {mobileFilterOpen && (
            <button
              type="button"
              className="hnl-filter-backdrop"
              aria-label="Close filters"
              onClick={() => setMobileFilterOpen(false)}
            />
          )}

          {/* Filter Sidebar */}
          <aside
            className={`hnl-filter-sidebar ${mobileFilterOpen ? "is-open" : ""}`}
            id="catalog-filters"
            aria-label="Product filters"
            role={mobileFilterOpen ? "dialog" : undefined}
            aria-modal={mobileFilterOpen ? true : undefined}
          >
            <div className="hnl-filter-sidebar-header">
              <h3>Filters</h3>
              {mobileFilterOpen && (
                <button
                  type="button"
                  className="hnl-modal-close"
                  aria-label="Close filters"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  ×
                </button>
              )}
            </div>

            {/* Category Filter */}
            {!collection && (
              <div className="hnl-filter-group">
                <h4>Category</h4>
                <div className="hnl-filter-options">
                  <label className="hnl-radio-label">
                    <input
                      type="radio"
                      name="catalog-category"
                      value="all"
                      checked={selectedCategory === "all"}
                      onChange={() => { setSelectedCategory("all"); setCurrentPage(1); }}
                    />
                    <span>All Categories</span>
                  </label>
                  {populatedCategories.map((cat) => (
                    <label className="hnl-radio-label" key={cat.slug}>
                      <input
                        type="radio"
                        name="catalog-category"
                        value={cat.slug}
                        checked={selectedCategory === cat.slug}
                        onChange={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div className="hnl-filter-group">
              <h4>Price</h4>
              <div className="hnl-filter-options">
                <label className="hnl-radio-label">
                  <input
                    type="radio"
                    name="catalog-price"
                    value="all"
                    checked={priceRange === "all"}
                    onChange={() => { setPriceRange("all"); setCurrentPage(1); }}
                  />
                  <span>All Prices</span>
                </label>
                <label className="hnl-radio-label">
                  <input
                    type="radio"
                    name="catalog-price"
                    value="under-200"
                    checked={priceRange === "under-200"}
                    onChange={() => { setPriceRange("under-200"); setCurrentPage(1); }}
                  />
                  <span>Under ₹200</span>
                </label>
                <label className="hnl-radio-label">
                  <input
                    type="radio"
                    name="catalog-price"
                    value="200-400"
                    checked={priceRange === "200-400"}
                    onChange={() => { setPriceRange("200-400"); setCurrentPage(1); }}
                  />
                  <span>₹200 – ₹400</span>
                </label>
                <label className="hnl-radio-label">
                  <input
                    type="radio"
                    name="catalog-price"
                    value="above-400"
                    checked={priceRange === "above-400"}
                    onChange={() => { setPriceRange("above-400"); setCurrentPage(1); }}
                  />
                  <span>Above ₹400</span>
                </label>
              </div>
            </div>

            <div className="hnl-filter-group">
              <h4>Availability</h4>
              <div className="hnl-filter-options">
                <label className="hnl-radio-label">
                  <input
                    type="radio"
                    name="catalog-availability"
                    value="all"
                    checked={availability === "all"}
                    onChange={() => { setAvailability("all"); setCurrentPage(1); }}
                  />
                  <span>All products</span>
                </label>
                <label className="hnl-radio-label">
                  <input
                    type="radio"
                    name="catalog-availability"
                    value="in-stock"
                    checked={availability === "in-stock"}
                    onChange={() => { setAvailability("in-stock"); setCurrentPage(1); }}
                  />
                  <span>In stock</span>
                </label>
                <label className="hnl-radio-label">
                  <input
                    type="radio"
                    name="catalog-availability"
                    value="out-of-stock"
                    checked={availability === "out-of-stock"}
                    onChange={() => { setAvailability("out-of-stock"); setCurrentPage(1); }}
                  />
                  <span>Out of stock</span>
                </label>
              </div>
            </div>

            {mobileFilterOpen && (
              <button
                type="button"
                className="hnl-button hnl-button--full"
                onClick={() => setMobileFilterOpen(false)}
                style={{ marginTop: "1rem" }}
              >
                Apply Filters
              </button>
            )}
          </aside>

          {/* Product Grid Area */}
          <section className="hnl-catalog-products" aria-label="Product list">
            {filteredProducts.length > 0 ? (
              <div className="hnl-products-grid" id="hnl-products-grid">
                {visibleProducts.map((product) =>
                  collection ? (
                    <motion.div
                      className="hnl-category-card-reveal"
                      key={product.id}
                    >
                      <ProductCard
                        product={product}
                        imageSizes={catalogProductImageSizes}
                      />
                    </motion.div>
                  ) : (
                    <ProductCard
                      key={product.id}
                      product={product}
                      imageSizes={catalogProductImageSizes}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="hnl-empty-state hnl-catalog-empty">
                {collection ? (
                  <>
                    <h3>No products are currently listed in this collection</h3>
                    <p>Explore the available pantry products and collections.</p>
                    <Link href="/shop" className="hnl-button">
                      Explore all products
                    </Link>
                  </>
                ) : (
                  <>
                    <h3>No products match your filters</h3>
                    <p>Try resetting some filters or explore all categories.</p>
                    <button
                      type="button"
                      className="hnl-button"
                      onClick={clearAllFilters}
                    >
                      Reset all filters
                    </button>
                  </>
                )}
              </div>
            )}
            {pageCount > 1 && (
              <nav className="hnl-pagination" aria-label="Product pages">
                <button
                  type="button"
                  className="hnl-pagination-button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="hnl-pagination-pages" aria-label="Choose a page">
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                    (page) => (
                      <button
                        type="button"
                        key={page}
                        className={`hnl-pagination-page${page === currentPage ? " is-active" : ""}`}
                        aria-label={`Go to page ${page}`}
                        aria-current={page === currentPage ? "page" : undefined}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>
                <span className="hnl-pagination-status" aria-live="polite">
                  Page <strong>{currentPage}</strong> of {pageCount}
                </span>
                <button
                  type="button"
                  className="hnl-pagination-button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(pageCount, page + 1))
                  }
                  disabled={currentPage === pageCount}
                >
                  Next
                </button>
              </nav>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
