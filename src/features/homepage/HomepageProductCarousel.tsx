"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { Product } from "@/types/storefront";
import { ProductImage } from "@/components/storefront/ProductImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useStorefront } from "@/features/cart/StorefrontProvider";

type HomepageProductCarouselProps = {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  sectionId: string;
  sectionClassName?: string;
  exploreHref: string;
  exploreLabel: string;
  autoPlay?: boolean;
};

export function HomepageProductCarousel({
  eyebrow,
  title,
  description,
  products,
  sectionId,
  sectionClassName = "",
  exploreHref,
  exploreLabel,
  autoPlay = false,
}: HomepageProductCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const settleScrollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeAutoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();
  const [isInView, setIsInView] = useState(true);
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const measureLoopWidth = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || !autoPlay || products.length < 2) return;

    const firstCopyStart = viewport.querySelector<HTMLElement>(
      '[data-carousel-copy="0"]',
    );
    const secondCopyStart = viewport.querySelector<HTMLElement>(
      '[data-carousel-copy="1"]',
    );
    if (!firstCopyStart || !secondCopyStart) return;

    const loopWidth =
      secondCopyStart.getBoundingClientRect().left -
      firstCopyStart.getBoundingClientRect().left;
    if (loopWidth <= 0) return;

    const previousLoopWidth = loopWidthRef.current;
    loopWidthRef.current = loopWidth;
    if (previousLoopWidth === 0) viewport.scrollLeft = loopWidth;
    else if (Math.abs(previousLoopWidth - loopWidth) > 1) {
      viewport.scrollLeft = loopWidth;
    }
  }, [autoPlay, products.length]);

  const normalizeLoopPosition = useCallback(() => {
    const viewport = viewportRef.current;
    const loopWidth = loopWidthRef.current;
    if (!viewport || !autoPlay || products.length < 2 || loopWidth <= 0) return;

    const offset = viewport.scrollLeft - loopWidth;
    const normalizedOffset = ((offset % loopWidth) + loopWidth) % loopWidth;
    const normalizedPosition = loopWidth + normalizedOffset;
    if (Math.abs(viewport.scrollLeft - normalizedPosition) > 1) {
      viewport.scrollLeft = normalizedPosition;
    }
  }, [autoPlay, products.length]);

  const updateScrollState = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    if (autoPlay && products.length > 1) {
      setCanScroll((current) =>
        current.left && current.right ? current : { left: true, right: true },
      );
      return;
    }

    const left = viewport.scrollLeft > 1;
    const right =
      viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1;
    setCanScroll((current) =>
      current.left === left && current.right === right
        ? current
        : { left, right },
    );
  }, [autoPlay, products.length]);

  const handleScroll = useCallback(() => {
    updateScrollState();
    if (!autoPlay || products.length < 2) return;

    if (settleScrollRef.current) clearTimeout(settleScrollRef.current);
    settleScrollRef.current = setTimeout(() => {
      normalizeLoopPosition();
      settleScrollRef.current = null;
    }, 140);
  }, [autoPlay, normalizeLoopPosition, products.length, updateScrollState]);

  const pauseAutoPlayBriefly = useCallback(() => {
    if (!autoPlay) return;

    setAutoPlayPaused(true);
    if (resumeAutoPlayRef.current) clearTimeout(resumeAutoPlayRef.current);
    resumeAutoPlayRef.current = setTimeout(() => {
      setAutoPlayPaused(false);
      resumeAutoPlayRef.current = null;
    }, 4500);
  }, [autoPlay]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    measureLoopWidth();
    updateScrollState();
    viewport.addEventListener("scroll", handleScroll, { passive: true });
    viewport.addEventListener("scrollend", normalizeLoopPosition);
    window.addEventListener("resize", measureLoopWidth);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measureLoopWidth);
    resizeObserver?.observe(viewport);

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      viewport.removeEventListener("scrollend", normalizeLoopPosition);
      window.removeEventListener("resize", measureLoopWidth);
      resizeObserver?.disconnect();
      if (settleScrollRef.current) clearTimeout(settleScrollRef.current);
    };
  }, [
    handleScroll,
    measureLoopWidth,
    normalizeLoopPosition,
    products.length,
    updateScrollState,
  ]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (
      !viewport ||
      !autoPlay ||
      !("IntersectionObserver" in window)
    ) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.1 },
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [autoPlay]);

  useEffect(() => {
    if (
      !autoPlay ||
      !isInView ||
      autoPlayPaused ||
      reduceMotion ||
      products.length < 2
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      const viewport = viewportRef.current;
      const firstItem = viewport?.querySelector<HTMLElement>(
        ".hnl-home-carousel-item",
      );
      const secondItem = firstItem?.nextElementSibling;
      if (!viewport || !firstItem || !(secondItem instanceof HTMLElement)) return;

      viewport.scrollBy({
        left:
          secondItem.getBoundingClientRect().left -
          firstItem.getBoundingClientRect().left,
        behavior: "smooth",
      });
    }, 5200);

    return () => window.clearInterval(interval);
  }, [autoPlay, autoPlayPaused, isInView, products.length, reduceMotion]);

  useEffect(
    () => () => {
      if (resumeAutoPlayRef.current) clearTimeout(resumeAutoPlayRef.current);
    },
    [],
  );

  const scroll = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    pauseAutoPlayBriefly();
    viewport.scrollBy({
      left: direction * viewport.clientWidth * 0.85,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section
      className={`hnl-section hnl-home-carousel-section ${sectionClassName}`}
      id={sectionId}
      aria-labelledby={`${sectionId}-heading`}
    >
      <div className="hnl-home-carousel-header">
        <motion.div
          className="hnl-home-carousel-heading"
          initial={reduceMotion ? false : { opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            titleId={`${sectionId}-heading`}
          />
        </motion.div>

        <div className="hnl-home-carousel-actions">
          <Link className="hnl-home-explore-link" href={exploreHref}>
            {exploreLabel} <span aria-hidden="true">→</span>
          </Link>
          <div
            className="hnl-home-carousel-navigation"
            aria-label={`${title} carousel controls`}
          >
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canScroll.left}
              aria-label={`Scroll ${title} left`}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canScroll.right}
              aria-label={`Scroll ${title} right`}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className="hnl-home-carousel-viewport"
        ref={viewportRef}
        role="region"
        aria-label={`${title} products`}
        tabIndex={0}
        onPointerDown={pauseAutoPlayBriefly}
        onTouchStart={pauseAutoPlayBriefly}
        onTouchEnd={pauseAutoPlayBriefly}
        onWheel={pauseAutoPlayBriefly}
        onFocus={() => autoPlay && setAutoPlayPaused(true)}
        onBlur={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            event.currentTarget.contains(event.relatedTarget)
          ) return;
          if (autoPlay) {
            setAutoPlayPaused(false);
          }
        }}
      >
        <div
          className="hnl-home-carousel-track"
          data-count={products.length}
          data-autoplay={autoPlay && products.length > 1 ? "true" : undefined}
          style={{
            justifyContent:
              products.length <= 5 && !autoPlay ? "center" : "flex-start",
          }}
        >
          {(autoPlay && products.length > 1 ? [0, 1, 2] : [1]).flatMap(
            (copyIndex) =>
              products.map((product, index) => {
                const card = (
                  <CompactHomepageProductCard product={product} />
                );

                function CompactHomepageProductCard({ product }: { product: Product }) {
                  const { toggleWishlist, isInWishlist } = useStorefront();
                  const isFavorited = isInWishlist(product.id);
                  const availablePrices = product.variants
                    .filter((variant) => variant.inStock)
                    .map((variant) => variant.price);
                  const startingPrice =
                    availablePrices.length > 0 ? Math.min(...availablePrices) : product.price;

                  return (
                    <article className="hnl-home-compact-product-card" data-product-id={product.id}>
                      <div className="hnl-home-compact-product-media">
                        <Link
                          href={`/products/${product.slug}`}
                          className="hnl-home-compact-product-image-link"
                          aria-label={`View ${product.name}`}
                          tabIndex={-1}
                        >
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 620px) 76vw, (max-width: 900px) 36vw, 23vw"
                            className="hnl-home-compact-product-image"
                          />
                        </Link>
                        <button
                          type="button"
                          className={`hnl-home-compact-product-wishlist${isFavorited ? " is-active" : ""}`}
                          onClick={() => toggleWishlist(product.id)}
                          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                          aria-pressed={isFavorited}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill={isFavorited ? "currentColor" : "none"}
                            aria-hidden="true"
                          >
                            <path
                              d="M20.2 8.8c0 4.3-8.2 10-8.2 10s-8.2-5.7-8.2-10a4.25 4.25 0 0 1 8.2-1.5 4.25 4.25 0 0 1 8.2 1.5Z"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="hnl-home-compact-product-info">
                        <span className="hnl-home-compact-product-category">
                          {product.categoryName}
                        </span>
                        <h3>
                          <Link href={`/products/${product.slug}`}>{product.name}</Link>
                        </h3>
                        <div className="hnl-home-compact-product-footer">
                          <p>From ₹{startingPrice}</p>
                          <Link href={`/products/${product.slug}`}>
                            View Product <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                }

                return (
                  <motion.div
                    className="hnl-home-carousel-item"
                    key={`${copyIndex}-${product.id}`}
                    data-carousel-copy={copyIndex}
                    aria-hidden={copyIndex === 1 ? undefined : true}
                    inert={copyIndex !== 1}
                    initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.25 }}
                    transition={{
                      duration: reduceMotion ? 0.01 : 0.75,
                      delay: reduceMotion ? 0 : (index % 5) * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {card}
                  </motion.div>
                );
              }),
          )}
        </div>
      </div>
    </section>
  );
}
