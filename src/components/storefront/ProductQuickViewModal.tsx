"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useStorefront } from "@/features/cart/StorefrontProvider";
import { Product } from "@/types/storefront";
import { ProductImage } from "@/components/storefront/ProductImage";

function QuickViewDialogContent({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart } = useStorefront();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const activeVariant =
    product.variants[selectedVariantIndex] || {
      name: "Standard",
      weight: "",
      price: product.price,
      originalPrice: product.originalPrice,
      inStock: product.inStock,
    };

  const discountPct = Math.round(
    ((activeVariant.originalPrice - activeVariant.price) / activeVariant.originalPrice) * 100
  );
  const isAvailable =
    product.availabilityConfirmed !== false &&
    product.inStock &&
    activeVariant.inStock;

  const handleAdd = () => {
    if (!isAvailable) return;
    addToCart(product.id, quantity, activeVariant.name);
    onClose();
  };

  return (
    <div
      className="hnl-modal-panel hnl-quickview-panel"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="hnl-modal-close"
        onClick={onClose}
        aria-label="Close modal"
      >
        ✕
      </button>

      <div className="hnl-quickview-grid">
        <div className="hnl-quickview-media">
          <div className="hnl-quickview-image-wrap">
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="hnl-quickview-image"
            />
          </div>
        </div>

        <div className="hnl-quickview-content">
          <span className="hnl-product-category">{product.categoryName}</span>
          <h2 id="quickview-title" className="hnl-quickview-title">
            {product.name}
          </h2>

          {product.tamilName && (
            <p className="hnl-product-tamil-name">{product.tamilName}</p>
          )}

          <div className="hnl-quickview-pricing">
            <span className="hnl-product-price">₹{activeVariant.price * quantity}</span>
            {activeVariant.originalPrice > activeVariant.price && (
              <span className="hnl-product-original-price">
                ₹{activeVariant.originalPrice * quantity}
              </span>
            )}
            {discountPct > 0 && (
              <span className="hnl-discount-tag">Save {discountPct}%</span>
            )}
          </div>

          <p className="hnl-quickview-description">
            {product.shortDescription || product.description}
          </p>

          {/* Variant choices */}
          {product.variants.length > 0 && (
            <div className="hnl-quickview-variants">
              <label className="hnl-field-label">Select Package Size</label>
              <div className="hnl-variant-buttons">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.name}
                    type="button"
                    className={`hnl-variant-btn ${idx === selectedVariantIndex ? "is-selected" : ""}`}
                    onClick={() => setSelectedVariantIndex(idx)}
                  >
                    <span className="hnl-vbtn-name">{v.name}</span>
                    <span className="hnl-vbtn-price">₹{v.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="hnl-quickview-qty-row">
            <div className="hnl-qty-stepper">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="hnl-button hnl-button--full"
              onClick={handleAdd}
              disabled={!isAvailable}
            >
              {isAvailable
                ? `Add ${quantity} to Bag · ₹${activeVariant.price * quantity}`
                : product.availabilityConfirmed === false
                  ? "Availability pending"
                  : "Unavailable"}
            </button>
          </div>

          <div className="hnl-quickview-footer-link">
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="hnl-text-link"
            >
              View full nutritional info, origin & reviews →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductQuickViewModal() {
  const { quickViewProduct, closeQuickView } = useStorefront();

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeQuickView();
    }
    if (quickViewProduct) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [quickViewProduct, closeQuickView]);

  if (!quickViewProduct) return null;

  return (
    <div
      className="hnl-modal-backdrop"
      onClick={closeQuickView}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      <QuickViewDialogContent
        key={quickViewProduct.id}
        product={quickViewProduct}
        onClose={closeQuickView}
      />
    </div>
  );
}
