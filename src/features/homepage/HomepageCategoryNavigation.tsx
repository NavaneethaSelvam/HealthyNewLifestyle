"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { categories } from "@/features/catalog/catalog-data";
import { getProductsByCategory } from "@/features/catalog/products-data";
import { ScrollReveal } from "@/features/homepage/ScrollReveal";

const categoryImages: Record<string, string> = {
  "traditional-rice": "/images/categories/rice.jpg",
  millets: "/images/categories/millets.jpg",
  "flakes-aval-varieties": "/images/grains.jpg",
  "pulses-and-dal": "/images/pulses.jpg",
  "spices-and-seeds": "/images/categories/spices.jpg",
  "spice-powder": "/images/spices.jpg",
  "dried-herbs-leaves": "/images/herbs.jpg",
  "dry-fruits-and-nuts": "/images/categories/nuts-seeds.jpg",
  "natural-sweeteners": "/images/food-table.jpg",
  "home-made-vadagam-appalam": "/images/banners/hero-traditional-pantry.png",
  "pickle-jam-spread": "/images/vegetables.jpg",
  "home-made-value-added-flour": "/images/bread.jpg",
  "health-mix": "/images/categories/health-mixes.jpg",
  "ghee-and-wood-press-oil": "/images/categories/oils.jpg",
  "bath-and-body-care": "/images/brand/brand-quality.jpg",
  "home-cleaners": "/images/brand/brand-packaging.jpg",
  "pooja-items": "/images/brand/brand-story.jpg",
  "traditional-wheat": "/images/banners/hero-organic-millets.png",
  "ready-mix-powder": "/images/products/ragi-health-mix.jpg",
  salts: "/images/banners/hero-healthy-food.png",
  "home-made-cosmetics": "/images/brand/brand-products.jpg",
};

const initialCategory =
  categories.find((category) => getProductsByCategory(category.slug).length > 0) ??
  categories[0]!;

export function HomepageCategoryNavigation() {
  const railRef = useRef<HTMLDivElement>(null);
  const pauseUntilRef = useRef(0);
  const [activeSlug, setActiveSlug] = useState(initialCategory.slug);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeCategory =
    categories.find((category) => category.slug === activeSlug) ?? initialCategory;
  const activeProducts = getProductsByCategory(activeCategory.slug);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);

    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (hovered || focused || reducedMotion) return;

    const intervalId = window.setInterval(() => {
      const rail = railRef.current;
      if (!rail || Date.now() < pauseUntilRef.current) return;

      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll < 12) return;

      const atEnd = rail.scrollLeft >= maxScroll - 12;
      rail.scrollBy({
        left: atEnd ? -rail.scrollLeft : Math.min(rail.clientWidth * 0.72, maxScroll - rail.scrollLeft),
        behavior: "smooth",
      });
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [focused, hovered, reducedMotion]);

  function moveRail(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;

    pauseUntilRef.current = Date.now() + 8000;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    if (maxScroll < 12) return;

    if (direction > 0 && rail.scrollLeft >= maxScroll - 12) {
      rail.scrollTo({ left: 0, behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }

    if (direction < 0 && rail.scrollLeft <= 12) {
      rail.scrollTo({ left: maxScroll, behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }

    rail.scrollBy({
      left: direction * Math.max(180, rail.clientWidth * 0.72),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  function pauseForInteraction() {
    pauseUntilRef.current = Date.now() + 8000;
  }

  return (
    <>
      <ScrollReveal className="hnl-home-category-navigation-reveal">
        <section
          className="hnl-home-category-navigation"
          aria-label="Browse product categories"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
          }}
          onPointerDown={pauseForInteraction}
          onWheel={pauseForInteraction}
        >
          <div className="hnl-home-category-navigation-inner">
            <div className="hnl-home-category-navigation-heading">
              <p className="hnl-eyebrow">Explore the pantry</p>
              <div className="hnl-home-category-navigation-controls">
                <button
                  type="button"
                  onClick={() => moveRail(-1)}
                  aria-label="Scroll categories left"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  onClick={() => moveRail(1)}
                  aria-label="Scroll categories right"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <div
              className="hnl-home-category-navigation-rail"
              ref={railRef}
              role="group"
              aria-label="Choose a product category"
            >
              {categories.map((category) => {
                const image = categoryImages[category.slug];
                if (!image) {
                  throw new Error(`Homepage category thumbnail missing for ${category.slug}`);
                }

                const isActive = category.slug === activeCategory.slug;

                return (
                  <button
                    className={`hnl-home-category-navigation-item${isActive ? " is-active" : ""}`}
                    type="button"
                    key={category.slug}
                    aria-pressed={isActive}
                    onClick={() => {
                      pauseForInteraction();
                      setActiveSlug(category.slug);
                    }}
                  >
                    <span className="hnl-home-category-navigation-image">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(max-width: 620px) 72px, 84px"
                      />
                    </span>
                    <span className="hnl-home-category-navigation-name">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section
        className="hnl-section hnl-home-selected-category"
        aria-labelledby="selected-category-heading"
        aria-live="polite"
      >
        <div className="hnl-home-selected-category-heading">
          <div>
            <p className="hnl-eyebrow">From the {activeCategory.name} collection</p>
            <h2 id="selected-category-heading">{activeCategory.name}</h2>
          </div>
          <Link
            className="hnl-text-link"
            href={`/categories/${activeCategory.slug}`}
          >
            View category <span aria-hidden="true">→</span>
          </Link>
        </div>

        {activeProducts.length > 0 ? (
          <div className="hnl-products-grid">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="hnl-home-selected-category-empty">
            <p>No products are currently listed in this category.</p>
            <Link href={`/categories/${activeCategory.slug}`}>
              Browse {activeCategory.name} <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
