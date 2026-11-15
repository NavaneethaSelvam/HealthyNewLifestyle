"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/storefront";
import { useStorefront } from "@/features/cart/StorefrontProvider";
import { ProductImage } from "@/components/storefront/ProductImage";

export function ProductCard({
  product,
  priority = false,
  showRating = false,
  imageSizes = "(max-width: 620px) 50vw, (max-width: 900px) 33vw, 25vw",
}: {
  product: Product;
  priority?: boolean;
  showRating?: boolean;
  imageSizes?: string;
}) {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useStorefront();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const activeVariant = product.variants[selectedVariantIndex] || {
    name: "Standard",
    weight: "",
    price: product.price,
    originalPrice: product.originalPrice,
    inStock: product.inStock,
  };

  const isFavorited = isInWishlist(product.id);
  const isAvailable =
    product.availabilityConfirmed !== false &&
    product.inStock &&
    activeVariant.inStock;
  const discountPct = Math.round(
    ((activeVariant.originalPrice - activeVariant.price) / activeVariant.originalPrice) * 100
  );

  return (
    <article className="hnl-product-card" data-product-id={product.id}>
      <div className="hnl-product-card-media">
        <Link href={`/products/${product.slug}`} className="hnl-product-card-link" tabIndex={-1}>
          <div className="hnl-product-card-img-wrapper">
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              sizes={imageSizes}
              priority={priority}
              className="hnl-product-card-img"
            />
          </div>
        </Link>

        {discountPct > 0 && (
          <span className="hnl-product-badge hnl-product-badge--discount">
            -{discountPct}%
          </span>
        )}

        <button
          type="button"
          className={`hnl-product-wishlist-btn ${isFavorited ? "is-active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"}>
            <path
              d="M20.2 8.8c0 4.3-8.2 10-8.2 10s-8.2-5.7-8.2-10a4.25 4.25 0 0 1 8.2-1.5 4.25 4.25 0 0 1 8.2 1.5Z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        <button
          type="button"
          className="hnl-product-quickview-btn"
          onClick={(e) => {
            e.preventDefault();
            openQuickView(product);
          }}
          aria-label={`Quick view ${product.name}`}
        >
          Quick View
        </button>
      </div>

      <div className="hnl-product-card-info">
        <span className="hnl-product-category">{product.categoryName}</span>

        <h3 className="hnl-product-title">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {showRating && product.rating > 0 && (
          <p
            className="hnl-product-card-rating"
            aria-label={`${product.rating} out of 5 stars from ${product.reviewCount} reviews`}
          >
            <span aria-hidden="true">★</span>
            <span>{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </p>
        )}

        <p className="hnl-product-card-description">{product.shortDescription}</p>

        {product.tamilName && (
          <span className="hnl-product-tamil-name">{product.tamilName}</span>
        )}

        {/* Variants pill list if multiple */}
        {product.variants.length > 1 && (
          <div className="hnl-product-variant-pills" role="radiogroup" aria-label="Available weights">
            {product.variants.map((v, idx) => (
              <button
                key={v.name}
                type="button"
                className={`hnl-variant-pill ${idx === selectedVariantIndex ? "is-selected" : ""}`}
                onClick={() => setSelectedVariantIndex(idx)}
                aria-pressed={idx === selectedVariantIndex}
              >
                {v.weight || v.name}
              </button>
            ))}
          </div>
        )}

        <div className="hnl-product-card-footer">
          <div className="hnl-product-price-block">
            <div className="hnl-product-card-price">
              <span className="hnl-product-price">₹{activeVariant.price}</span>
              <span
                className={`hnl-product-stock${isAvailable ? " is-available" : ""}`}
              >
                {product.availabilityConfirmed === false
                  ? "Availability pending"
                  : isAvailable
                    ? "In stock"
                    : "Out of stock"}
              </span>
            </div>
            {activeVariant.originalPrice > activeVariant.price && (
              <span className="hnl-product-original-price">
                ₹{activeVariant.originalPrice}
              </span>
            )}
          </div>

          <button
            type="button"
            className="hnl-button hnl-button--small hnl-product-add-btn"
            onClick={() => addToCart(product.id, 1, activeVariant.name)}
            disabled={!isAvailable}
            aria-label={`Add ${product.name} (${activeVariant.name}) to cart`}
          >
            {isAvailable ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </article>
  );
}
