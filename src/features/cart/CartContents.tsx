"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useStorefront } from "@/features/cart/StorefrontProvider";
import { getProductById, getProductBySlug } from "@/features/catalog/products-data";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SAMPLE_COUPONS } from "@/services/couponService";

export function CartContents({ wishlistOnly = false }: { wishlistOnly?: boolean }) {
  const reduceMotion = useReducedMotion();
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartOriginalTotal,
    cartSavings,
    appliedCoupon,
    couponDiscount,
    shippingFee,
    freeShippingThreshold,
    freeShippingRemaining,
    orderTotal,
    wishlist,
    hydrated,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    clearWishlist,
    addToCart,
    applyCoupon,
    removeCoupon,
  } = useStorefront();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  if (!hydrated) {
    return (
      <main className="hnl-page">
        <div className="hnl-container hnl-loading-state" role="status">
          <div className="hnl-spinner"></div>
          <p>Loading your organic pantry selection…</p>
        </div>
      </main>
    );
  }

  // --- WISHLIST VIEW ---
  if (wishlistOnly) {
    const wishlistedProducts = wishlist
      .map((id) => getProductById(id) || getProductBySlug(id))
      .filter((p): p is NonNullable<typeof p> => p !== null);

    return (
      <main className="hnl-page hnl-wishlist-page">
        <div className="hnl-container">
          <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Wishlist</span>
          </nav>

          <header className="hnl-commerce-page-heading">
            <div>
              <h1>My Wishlist</h1>
              <p>Your favourite products, all in one place.</p>
            </div>
          </header>

          <motion.div
            className="hnl-wishlist-toolbar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.1 }}
          >
            <div className="hnl-wishlist-actions">
              <span className="hnl-commerce-count" aria-live="polite">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "item" : "items"} saved
              </span>
              {wishlistedProducts.length > 0 && (
                <div className="hnl-wishlist-top-actions">
                  <button
                    type="button"
                    className="hnl-button hnl-button--small hnl-button--accent"
                    onClick={() => {
                      wishlistedProducts.forEach((product) => addToCart(product.id, 1));
                    }}
                  >
                    Move All to Cart
                  </button>
                  <button
                    type="button"
                    className="hnl-text-button"
                    onClick={clearWishlist}
                  >
                    Clear Wishlist
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {wishlistedProducts.length > 0 ? (
            <>
              <div
                className="hnl-products-grid hnl-wishlist-products-grid"
                id="wishlist-products"
                data-count={wishlistedProducts.length}
              >
                {wishlistedProducts.map((product, index) => (
                  <motion.div
                    className="hnl-wishlist-gallery-item"
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.42,
                      delay: reduceMotion ? 0 : Math.min(index * 0.055, 0.3),
                      ease: "easeOut",
                    }}
                  >
                    <ProductCard
                      product={product}
                      showRating
                      priority={index === 0}
                      imageSizes="(max-width: 620px) 90vw, (max-width: 900px) 33vw, 25vw"
                    />
                  </motion.div>
                ))}
              </div>
              <div className="hnl-wishlist-continue">
                <Link className="hnl-button hnl-button--outline" href="/shop">
                  Continue Shopping
                </Link>
              </div>
            </>
          ) : (
            <div className="hnl-empty-state hnl-commerce-empty-state hnl-wishlist-empty-state">
              <div className="hnl-empty-state-art" aria-hidden="true">
                <svg viewBox="0 0 160 140" fill="none">
                  <path d="M37 53h86l-7 69H44l-7-69Z" />
                  <path d="M56 57c0-16 8-27 24-27s24 11 24 27" />
                  <path d="M66 79c6-11 20-11 27 0-7 12-21 12-27 0Z" />
                  <path d="M80 76v25" />
                  <path d="M33 124h94" />
                  <circle cx="127" cy="35" r="13" />
                  <path d="M127 28v14M120 35h14" />
                </svg>
              </div>
              <span className="hnl-eyebrow">YOUR NEXT PANTRY FIND</span>
              <h2>Your wishlist is waiting for its first favourite</h2>
              <p>
                Save the grains, oils, and everyday staples you would love to come back to.
              </p>
              <Link className="hnl-button" href="/shop">
                Explore the Pantry <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  // --- SHOPPING CART VIEW ---
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput("");
    }
  };

  const handleApplyQuickCoupon = (code: string) => {
    setCouponError("");
    setCouponInput(code);
    const res = applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput("");
    }
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  return (
    <main className="hnl-page hnl-cart-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Cart</span>
        </nav>

        <header className="hnl-commerce-page-heading">
          <div>
            <span className="hnl-eyebrow">YOUR PANTRY SELECTION</span>
            <h1>Your Shopping Cart</h1>
            <p>Review your items and delivery details before checkout.</p>
          </div>
        </header>

        <motion.div
          className="hnl-cart-toolbar"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.1 }}
        >
          <div className="hnl-cart-actions">
            <span className="hnl-commerce-count" aria-live="polite">
              {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
            </span>
            {cart.length > 0 && (
              <Link href="/shop" className="hnl-text-link hnl-cart-shop-link">
                Continue Shopping <span aria-hidden="true">→</span>
              </Link>
            )}
            {cart.length > 0 && (
              <button
                type="button"
                className="hnl-text-button hnl-clear-cart-btn"
                onClick={clearCart}
              >
                Clear Bag
              </button>
            )}
          </div>
        </motion.div>

        {cart.length > 0 ? (
          <motion.div
            className="hnl-cart-layout"
            id="cart-items"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.46, delay: reduceMotion ? 0 : 0.16 }}
          >
            {/* Left Column: Line items and Free Delivery Meter */}
            <div className="hnl-cart-items-col">
              <div className="hnl-cart-list-heading">
                <div>
                  <span className="hnl-eyebrow">FRESH FROM THE PANTRY</span>
                  <h2>Your items</h2>
                </div>
                <span>{cart.length} {cart.length === 1 ? "selection" : "selections"}</span>
              </div>

              {/* Free Delivery Meter */}
              <div className="hnl-shipping-meter-card">
                <div className="hnl-shipping-meter-header">
                  {freeShippingRemaining > 0 && shippingFee > 0 ? (
                    <p>
                      Add <strong>₹{freeShippingRemaining}</strong> more to qualify for <strong>FREE Delivery</strong>!
                    </p>
                  ) : (
                    <p className="hnl-shipping-unlocked">
                      🎉 <strong>Congratulations!</strong> You have unlocked <strong>Free Standard Delivery</strong>.
                    </p>
                  )}
                  <span className="hnl-meter-percent">{freeShippingProgress}%</span>
                </div>
                <div className="hnl-progress-bar-bg">
                  <div
                    className="hnl-progress-bar-fill"
                    style={{ width: `${freeShippingProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Items List */}
              <section className="hnl-cart-lines" aria-label="Items in your bag">
                {cart.map((line) => {
                  const lineTotal = line.price * line.quantity;
                  const lineOriginalTotal = line.originalPrice * line.quantity;

                  return (
                    <article
                      className="hnl-cart-line-card"
                      key={`${line.productId}-${line.variant}`}
                    >
                      <Link
                        href={`/products/${line.product.slug}`}
                        className="hnl-cart-line-thumb-wrap"
                      >
                        <Image
                          src={line.product.image}
                          alt={line.product.name}
                          width={96}
                          height={96}
                          className="hnl-cart-line-thumb"
                        />
                      </Link>

                      <div className="hnl-cart-line-info">
                        <div className="hnl-cart-line-title-row">
                          <div>
                            <span className="hnl-cart-category">{line.product.categoryName}</span>
                            <h3 className="hnl-cart-line-name">
                              <Link href={`/products/${line.product.slug}`}>
                                {line.product.name}
                              </Link>
                            </h3>
                            {line.product.tamilName && (
                              <p className="hnl-cart-tamil-name">{line.product.tamilName}</p>
                            )}
                          </div>

                          <div className="hnl-cart-line-price-col">
                            <span className="hnl-cart-line-price">₹{lineTotal}</span>
                            {lineOriginalTotal > lineTotal && (
                              <span className="hnl-cart-line-orig-price">
                                ₹{lineOriginalTotal}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="hnl-cart-line-variant-tag">
                          Size: <strong>{line.variant}</strong> (₹{line.price} each)
                        </div>

                        <div className="hnl-cart-line-actions-row">
                          {/* Quantity stepper */}
                          <div className="hnl-qty-stepper hnl-qty-stepper--small">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(line.productId, line.variant, line.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span>{line.quantity}</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(line.productId, line.variant, line.quantity + 1)
                              }
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <div className="hnl-cart-item-links">
                            <button
                              type="button"
                              className="hnl-text-button"
                              onClick={() => {
                                toggleWishlist(line.productId);
                                removeFromCart(line.productId, line.variant);
                              }}
                            >
                              Move to Wishlist
                            </button>
                            <span aria-hidden="true">·</span>
                            <button
                              type="button"
                              className="hnl-text-button hnl-text-button--danger"
                              onClick={() => removeFromCart(line.productId, line.variant)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>

              <aside className="hnl-cart-reassurance" aria-label="Delivery and checkout details">
                <span className="hnl-cart-reassurance-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M4 10h15v14H4zM19 15h5l4 4v5h-9z" />
                    <circle cx="10" cy="25" r="2.5" />
                    <circle cx="24" cy="25" r="2.5" />
                    <path d="M8 14h7M8 18h5" />
                  </svg>
                </span>
                <div className="hnl-cart-reassurance-copy">
                  <span className="hnl-eyebrow">BEFORE YOU CHECK OUT</span>
                  <h3>Clear details, every step of the way</h3>
                  <p>
                    Delivery charges are shown in your summary. This is a local checkout preview; no payment is processed.
                  </p>
                  <Link href="/policies/shipping">Read our shipping information <span aria-hidden="true">→</span></Link>
                </div>
                <a className="hnl-cart-help-link" href="tel:6381243416">
                  Need help? <strong>6381243416</strong>
                </a>
              </aside>

              <div className="hnl-cart-continue">
                <Link className="hnl-text-link" href="/shop">
                  ← Continue shopping for other staples
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary & Coupons */}
            <aside className="hnl-cart-summary-col">
              <div className="hnl-cart-summary-box">
                <div className="hnl-cart-summary-heading">
                  <div>
                    <span className="hnl-eyebrow">AT A GLANCE</span>
                    <h2>Order Summary</h2>
                  </div>
                  <span className="hnl-cart-preview-badge">Local preview</span>
                </div>

                {/* Subtotal breakdown */}
                <div className="hnl-summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>

                {cartSavings > 0 && (
                  <div className="hnl-summary-row hnl-savings-row">
                    <span>Product discount (MRP ₹{cartOriginalTotal})</span>
                    <span>-₹{cartSavings}</span>
                  </div>
                )}

                {/* Applied Coupon Display */}
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="hnl-summary-row hnl-coupon-row">
                    <span className="hnl-coupon-applied-label">
                      Coupon ({appliedCoupon.code})
                      <button
                        type="button"
                        className="hnl-coupon-remove-btn"
                        onClick={removeCoupon}
                        aria-label="Remove coupon"
                      >
                        ✕
                      </button>
                    </span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                {/* Shipping */}
                <div className="hnl-summary-row">
                  <span>Delivery charge</span>
                  <span>{shippingFee === 0 ? <strong className="hnl-free-tag">FREE</strong> : `₹${shippingFee}`}</span>
                </div>

                <div className="hnl-summary-divider"></div>

                {/* Grand Total */}
                <div className="hnl-summary-row hnl-summary-total">
                  <span>Grand Total</span>
                  <span>₹{orderTotal}</span>
                </div>

                <p className="hnl-summary-tax-note">Inclusive of all farm taxes & hygienic packaging</p>

                {/* Checkout CTA */}
                <Link href="/checkout" className="hnl-button hnl-button--full hnl-checkout-cta">
                  Proceed to Checkout · ₹{orderTotal}
                </Link>

                {/* Coupon Input Form */}
                <div className="hnl-coupon-section">
                  <label htmlFor="coupon-code-input" className="hnl-field-label">
                    Have a Promo Code?
                  </label>
                  <form className="hnl-coupon-form" onSubmit={handleApplyCoupon}>
                    <input
                      id="coupon-code-input"
                      type="text"
                      className="hnl-input"
                      placeholder="e.g. WELCOME10, SAVE50"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button type="submit" className="hnl-button hnl-button--small">
                      Apply
                    </button>
                  </form>
                  {couponError && <p className="hnl-field-error">{couponError}</p>}

                  {/* Quick coupon chips */}
                  <div className="hnl-quick-coupons">
                    <span className="hnl-quick-coupons-title">Preview Coupon Codes:</span>
                    <div className="hnl-coupon-chips">
                      {SAMPLE_COUPONS.slice(0, 3).map((cp) => (
                        <button
                          key={cp.code}
                          type="button"
                          className={`hnl-coupon-chip ${appliedCoupon?.code === cp.code ? "is-applied" : ""}`}
                          onClick={() => handleApplyQuickCoupon(cp.code)}
                        >
                          <strong>{cp.code}</strong>: {cp.description}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trust guarantee */}
                <div className="hnl-summary-trust-badges">
                  <div className="hnl-trust-point">Checkout is a local preview only</div>
                  <div className="hnl-trust-point">No payment is processed</div>
                  <div className="hnl-trust-point">📞 Customer Help: 6381243416</div>
                </div>
              </div>
            </aside>
          </motion.div>
        ) : (
          <motion.div
            className="hnl-empty-state hnl-commerce-empty-state hnl-cart-empty-state"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.46, delay: reduceMotion ? 0 : 0.16 }}
          >
            <div className="hnl-empty-state-art" aria-hidden="true">
              <svg viewBox="0 0 160 140" fill="none">
                <path d="M39 52h82l-6 69H45l-6-69Z" />
                <path d="M58 56c0-16 7-26 22-26s22 10 22 26" />
                <path d="M60 83h40M67 98h26" />
                <path d="M30 124h100" />
                <path d="M80 30c-7-10-4-17 1-23 7 8 8 15-1 23Z" />
                <path d="M82 28c6-9 13-9 19-6-4 9-10 12-19 6Z" />
              </svg>
            </div>
            <span className="hnl-eyebrow">A FRESH START</span>
            <h2>Your shopping bag is ready for something good</h2>
            <p>
              Explore traditional South Indian rice, native millets, and pantry staples when you are ready.
            </p>
            <Link className="hnl-button" href="/shop">
              Continue Shopping <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}
