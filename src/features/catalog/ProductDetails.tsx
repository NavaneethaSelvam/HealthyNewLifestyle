"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Product, ProductReview } from "@/types/storefront";
import { useStorefront } from "@/features/cart/StorefrontProvider";
import { StarRating } from "@/components/storefront/StarRating";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductImage } from "@/components/storefront/ProductImage";
import { getRelatedProducts } from "@/features/catalog/products-data";
import { getReviewsForProduct } from "@/services/reviewService";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "@/services/storage";
import { submitCustomerForm } from "@/services/customerForms";

export function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, addToast } = useStorefront();

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "benefits" | "nutrition" | "origin" | "reviews"
  >("description");

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewNotificationSent, setReviewNotificationSent] = useState(true);
  const reviewRequestRef = useRef<{ signature: string; id: string } | null>(null);

  useEffect(() => {
    const reviewTimer = window.setTimeout(
      () => setReviews(getReviewsForProduct(product.id)),
      0,
    );
    const recent = getStorageItem<string[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
    const updated = [product.id, ...recent.filter((id) => id !== product.id)].slice(0, 6);
    setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, updated);
    return () => window.clearTimeout(reviewTimer);
  }, [product.id]);

  const activeVariant =
    product.variants[selectedVariantIndex] || {
      name: "Standard",
      weight: "",
      price: product.price,
      originalPrice: product.originalPrice,
      inStock: product.inStock,
    };

  const isFavorited = isInWishlist(product.id);
  const discountPct = Math.round(
    ((activeVariant.originalPrice - activeVariant.price) / activeVariant.originalPrice) * 100
  );

  const relatedProducts = getRelatedProducts(product);
  const averageReviewRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
      : 0;
  const selectedVariantInStock =
    product.availabilityConfirmed !== false &&
    product.inStock &&
    activeVariant.inStock;

  const handleAddToCart = () => {
    addToCart(product.id, quantity, activeVariant.name);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity, activeVariant.name);
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (reviewSubmitting || !e.currentTarget.reportValidity()) return;
    if (!reviewName.trim() || !reviewComment.trim()) {
      addToast({ type: "error", message: "Please provide your name and review comment." });
      return;
    }

    const submission = {
      operation: "review" as const,
      productId: product.id,
      productName: product.name,
      rating: reviewRating,
      name: reviewName.trim(),
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
    };
    const signature = JSON.stringify(submission);
    const submissionId =
      reviewRequestRef.current?.signature === signature
        ? reviewRequestRef.current.id
        : window.crypto.randomUUID();
    reviewRequestRef.current = { signature, id: submissionId };
    setReviewSubmitting(true);
    setReviewError("");

    try {
      const result = await submitCustomerForm({ ...submission, submissionId });
      setReviewSubmitted(true);
      setReviewNotificationSent(result.notificationSent !== false);
      setReviewName("");
      setReviewTitle("");
      setReviewComment("");
      reviewRequestRef.current = null;
      addToast({
        type: result.notificationSent === false ? "info" : "success",
        title: result.notificationSent === false ? "Review recorded" : "Review received",
        message:
          result.notificationSent === false
            ? "Your review was recorded, but the moderation email could not be sent."
            : "Your review was sent for moderation and has not been published.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Your review could not be sent. Please try again.";
      setReviewError(errorMessage);
      addToast({ type: "error", message: errorMessage });
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <main className="hnl-page hnl-product-detail-page">
      <div className="hnl-container">
        {/* Breadcrumb */}
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/shop">Shop</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/categories/${product.categorySlug}`}>{product.categoryName}</Link>
          <span aria-hidden="true">/</span>
          <span>{product.name}</span>
        </nav>

        {/* Product Hero Section */}
        <section className="hnl-pdp-hero">
          {/* Gallery Column */}
          <div className="hnl-pdp-gallery">
            <div className="hnl-pdp-main-image-wrap">
              <ProductImage
                src={selectedImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 520px"
                className="hnl-pdp-main-image"
              />
            </div>

            {/* Thumbnails */}
            {product.gallery.length > 1 && (
              <div className="hnl-pdp-thumbnails" role="tablist" aria-label="Product thumbnails">
                {product.gallery.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    className={`hnl-pdp-thumb-btn ${selectedImage === img ? "is-active" : ""}`}
                    onClick={() => setSelectedImage(img)}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <ProductImage src={img} alt="" width={72} height={72} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details / Purchasing Column */}
          <div className="hnl-pdp-details">
            <div className="hnl-pdp-meta">
              <Link
                href={`/categories/${product.categorySlug}`}
                className="hnl-product-category"
              >
                {product.categoryName}
              </Link>
              <span className="hnl-pdp-sku">SKU: {activeVariant.sku || product.sku}</span>
            </div>

            <h1 className="hnl-pdp-title">{product.name}</h1>

            {product.tamilName && (
              <p className="hnl-pdp-tamil-title">{product.tamilName}</p>
            )}

            <div className="hnl-pdp-rating-row">
              {reviews.length > 0 ? (
                <StarRating rating={averageReviewRating} reviewCount={reviews.length} />
              ) : (
                <span className="hnl-no-reviews">No customer reviews yet.</span>
              )}
              <button
                type="button"
                className="hnl-text-button"
                onClick={() => setActiveTab("reviews")}
              >
                Read reviews
              </button>
            </div>

            <div className="hnl-pdp-pricing">
              <div className="hnl-pdp-price-wrap">
                <span className="hnl-pdp-current-price">₹{activeVariant.price * quantity}</span>
                {activeVariant.originalPrice > activeVariant.price && (
                  <span className="hnl-pdp-original-price">
                    ₹{activeVariant.originalPrice * quantity}
                  </span>
                )}
              </div>
              {discountPct > 0 && (
                <span className="hnl-discount-tag">Save {discountPct}% OFF</span>
              )}
            </div>

            <p className="hnl-pdp-short-desc">{product.shortDescription || product.description}</p>

            <div className="hnl-stock-status">
              <span className={`hnl-stock-dot${selectedVariantInStock ? "" : " is-unavailable"}`}></span>
              <span>
                {product.availabilityConfirmed === false
                  ? "Availability pending"
                  : selectedVariantInStock
                    ? "In stock"
                    : "Currently unavailable"}
              </span>
            </div>

            {/* Variant / Weight Selector */}
            {product.variants.length > 0 && (
              <div className="hnl-pdp-variants">
                <label className="hnl-field-label">
                  Choose Package Size: <strong>{activeVariant.name}</strong>
                </label>
                <div className="hnl-variant-buttons" role="radiogroup">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.name}
                      type="button"
                      className={`hnl-variant-btn ${idx === selectedVariantIndex ? "is-selected" : ""}`}
                      onClick={() => setSelectedVariantIndex(idx)}
                      aria-pressed={idx === selectedVariantIndex}
                    >
                      <span className="hnl-vbtn-name">{v.name}</span>
                      <span className="hnl-vbtn-price">₹{v.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="hnl-pdp-actions-row">
              <div className="hnl-qty-stepper" aria-label="Select quantity">
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
                className="hnl-button hnl-button--accent hnl-pdp-add-btn"
                onClick={handleAddToCart}
                disabled={!selectedVariantInStock}
              >
                {selectedVariantInStock
                  ? `Add to Bag · ₹${activeVariant.price * quantity}`
                  : product.availabilityConfirmed === false
                    ? "Availability pending"
                    : "Unavailable"}
              </button>

              <button
                type="button"
                className="hnl-button hnl-pdp-buynow-btn"
                onClick={handleBuyNow}
                disabled={!selectedVariantInStock}
              >
                Buy Now
              </button>

              <button
                type="button"
                className={`hnl-pdp-wishlist-btn ${isFavorited ? "is-active" : ""}`}
                onClick={() => toggleWishlist(product.id)}
                aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} width="24" height="24">
                  <path
                    d="M20.2 8.8c0 4.3-8.2 10-8.2 10s-8.2-5.7-8.2-10a4.25 4.25 0 0 1 8.2-1.5 4.25 4.25 0 0 1 8.2 1.5Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  />
                </svg>
              </button>
            </div>

            {/* Product information */}
            <div className="hnl-pdp-badges-grid">
              <div className="hnl-badge-item">
                <span className="hnl-badge-icon">ℹ</span>
                <span className="hnl-badge-text">Product details listed below</span>
              </div>
              <div className="hnl-badge-item">
                <span className="hnl-badge-icon">⚖</span>
                <span className="hnl-badge-text">Available package sizes shown above</span>
              </div>
              <div className="hnl-badge-item">
                <span className="hnl-badge-icon">🚚</span>
                <span className="hnl-badge-text">Delivery charges shown at checkout</span>
              </div>
              <div className="hnl-badge-item">
                <span className="hnl-badge-icon">⌕</span>
                <span className="hnl-badge-text">See ingredients and storage information below</span>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Tabs Section */}
        <section className="hnl-pdp-tabs-section">
          <div className="hnl-tabs-nav" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "description"}
              className={`hnl-tab-btn ${activeTab === "description" ? "is-active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description & Uses
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "benefits"}
              className={`hnl-tab-btn ${activeTab === "benefits" ? "is-active" : ""}`}
              onClick={() => setActiveTab("benefits")}
            >
              Health Benefits
            </button>
            {product.nutrition && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "nutrition"}
                className={`hnl-tab-btn ${activeTab === "nutrition" ? "is-active" : ""}`}
                onClick={() => setActiveTab("nutrition")}
              >
                Nutritional Facts
              </button>
            )}
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "origin"}
              className={`hnl-tab-btn ${activeTab === "origin" ? "is-active" : ""}`}
              onClick={() => setActiveTab("origin")}
            >
              Origin & Storage
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "reviews"}
              className={`hnl-tab-btn ${activeTab === "reviews" ? "is-active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          <div className="hnl-tab-content">
            {/* Tab 1: Description */}
            {activeTab === "description" && (
              <div className="hnl-tab-pane">
                <h2>About {product.name}</h2>
                <p className="hnl-prose">{product.description}</p>
                <div className="hnl-how-to-use-box">
                  <h3>How to prepare & use</h3>
                  <p>{product.howToUse}</p>
                </div>
              </div>
            )}

            {/* Tab 2: Health Benefits */}
            {activeTab === "benefits" && (
              <div className="hnl-tab-pane">
                <h2>Health & Wellness Benefits</h2>
                <p className="hnl-prose">
                  Rooted in traditional South Indian food wisdom and corroborated by modern nutrition science:
                </p>
                <ul className="hnl-benefits-list">
                  {product.benefits.map((b, idx) => (
                    <li key={idx}>
                      <span className="hnl-benefit-check">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tab 3: Nutritional Facts */}
            {activeTab === "nutrition" && product.nutrition && (
              <div className="hnl-tab-pane">
                <h2>Nutritional Profile (per {product.nutrition.servingSize})</h2>
                <div className="hnl-nutrition-table-wrap">
                  <table className="hnl-nutrition-table">
                    <tbody>
                      <tr>
                        <th>Energy</th>
                        <td>{product.nutrition.energy}</td>
                      </tr>
                      <tr>
                        <th>Protein</th>
                        <td>{product.nutrition.protein}</td>
                      </tr>
                      <tr>
                        <th>Carbohydrates</th>
                        <td>{product.nutrition.carbohydrates}</td>
                      </tr>
                      <tr>
                        <th>Dietary Fiber</th>
                        <td>{product.nutrition.dietaryFiber}</td>
                      </tr>
                      <tr>
                        <th>Total Fat</th>
                        <td>{product.nutrition.fat}</td>
                      </tr>
                      {product.nutrition.iron && (
                        <tr>
                          <th>Iron</th>
                          <td>{product.nutrition.iron}</td>
                        </tr>
                      )}
                      {product.nutrition.calcium && (
                        <tr>
                          <th>Calcium</th>
                          <td>{product.nutrition.calcium}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: Origin & Storage */}
            {activeTab === "origin" && (
              <div className="hnl-tab-pane">
                <h2>Origin & Storage</h2>
                <div className="hnl-provenance-grid">
                  <div className="hnl-provenance-card">
                    <h3>Product Origin</h3>
                    <p>{product.origin}</p>
                  </div>
                  <div className="hnl-provenance-card">
                    <h3>🏺 Storage Recommendation</h3>
                    <p>{product.storage}</p>
                  </div>
                  <div className="hnl-provenance-card">
                    <h3>🌱 Clean Ingredients</h3>
                    <p>{product.ingredients.join(", ")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Reviews */}
            {activeTab === "reviews" && (
              <div className="hnl-tab-pane">
                <div className="hnl-reviews-layout">
                  <div className="hnl-reviews-list-col">
                    <h2>Customer Feedback ({reviews.length})</h2>
                    {reviews.length > 0 ? (
                      <div className="hnl-reviews-list">
                        {reviews.map((rev) => (
                          <article key={rev.id} className="hnl-review-item">
                            <div className="hnl-review-header">
                              <div>
                                <span className="hnl-reviewer-name">{rev.userName}</span>
                              </div>
                              <span className="hnl-review-date">{rev.date}</span>
                            </div>
                            <StarRating rating={rev.rating} showCount={false} />
                            <h4 className="hnl-review-title">{rev.title}</h4>
                            <p className="hnl-review-text">{rev.comment}</p>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="hnl-no-reviews">No customer reviews are available yet.</p>
                    )}
                  </div>

                  {/* Write a review form */}
                  <div className="hnl-review-form-col">
                    <form className="hnl-review-form" onSubmit={handleReviewSubmit}>
                      <h3>Write a Review</h3>
                      <p>Reviews are sent to our team for moderation and are not published or verified as a purchase.</p>

                      <div className="hnl-field">
                        <label className="hnl-field-label">Overall Rating</label>
                        <StarRating
                          rating={reviewRating}
                          interactive
                          onChange={setReviewRating}
                          showCount={false}
                        />
                      </div>

                      <div className="hnl-field">
                        <label htmlFor="rev-name" className="hnl-field-label">Your Name</label>
                        <input
                          id="rev-name"
                          type="text"
                          className="hnl-input"
                          maxLength={100}
                          value={reviewName}
                          onChange={(e) => {
                            setReviewName(e.target.value);
                            setReviewSubmitted(false);
                          }}
                          placeholder="Your name"
                          required
                        />
                      </div>

                      <div className="hnl-field">
                        <label htmlFor="rev-title" className="hnl-field-label">Review Title</label>
                        <input
                          id="rev-title"
                          type="text"
                          className="hnl-input"
                          maxLength={120}
                          value={reviewTitle}
                          onChange={(e) => {
                            setReviewTitle(e.target.value);
                            setReviewSubmitted(false);
                          }}
                          placeholder="A short summary (optional)"
                        />
                      </div>

                      <div className="hnl-field">
                        <label htmlFor="rev-comment" className="hnl-field-label">Your Review</label>
                        <textarea
                          id="rev-comment"
                          rows={4}
                          className="hnl-textarea"
                          maxLength={5000}
                          value={reviewComment}
                          onChange={(e) => {
                            setReviewComment(e.target.value);
                            setReviewSubmitted(false);
                          }}
                          placeholder="Share your experience"
                          required
                        />
                      </div>

                      <button type="submit" className="hnl-button hnl-button--full" disabled={reviewSubmitting} aria-busy={reviewSubmitting}>
                        {reviewSubmitting ? "Sending review…" : "Submit Review"}
                      </button>

                      {reviewSubmitted && (
                        <p className="hnl-review-success-msg" role="status">
                          {reviewNotificationSent
                            ? "Your review was sent for moderation. It has not been published."
                            : "Your review was recorded, but the moderation email could not be sent."}
                        </p>
                      )}
                      {reviewError && (
                        <p className="hnl-review-error-msg" role="alert">{reviewError}</p>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Products Rail */}
        {relatedProducts.length > 0 && (
          <section className="hnl-section hnl-related-section">
            <header className="hnl-section-header">
              <span className="hnl-eyebrow">YOU MAY ALSO ENJOY</span>
              <h2>Pairs Well with Traditional Pantries</h2>
            </header>
            <div className="hnl-products-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
