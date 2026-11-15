"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getOrderByNumber } from "@/services/orderService";
import { Order } from "@/types/storefront";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const orderNumber = searchParams.get("orderNumber");
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrder(orderNumber ? getOrderByNumber(orderNumber) : null);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [orderNumber]);

  if (!loaded) {
    return (
      <main className="hnl-page">
        <div className="hnl-container hnl-loading-state" role="status">
          <div className="hnl-spinner"></div>
          <p>Loading saved preview…</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="hnl-page">
        <div className="hnl-container hnl-empty-state">
          <div className="hnl-empty-state-icon">📦</div>
          <h1>Order Not Found</h1>
          <p>We could not locate this order reference. You can view all your orders in your account.</p>
          <div className="hnl-hero-actions">
            <Link href="/account/orders" className="hnl-button">
              View Order History
            </Link>
            <Link href="/shop" className="hnl-button hnl-button--outline">
              Return to Shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="hnl-page hnl-order-success-page">
      <div className="hnl-container">
        <motion.div
          className="hnl-order-success-card"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="hnl-success-badge-icon"
            aria-hidden="true"
            initial={reduceMotion ? false : { scale: 0.86 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.12 }}
          >
            ✓
          </motion.div>
          <span className="hnl-eyebrow">LOCAL CHECKOUT PREVIEW</span>
          <h1>Preview saved{order.customer.fullName ? `, ${order.customer.fullName}` : ""}.</h1>
          <p className="hnl-order-success-subtitle">
            This record is stored only in this browser. No order was submitted, payment processed or delivery arranged.
          </p>

          <div className="hnl-order-meta-banner">
            <div className="hnl-order-meta-item">
              <span className="hnl-meta-label">Order Number</span>
              <strong>{order.orderNumber}</strong>
            </div>
            <div className="hnl-order-meta-item">
              <span className="hnl-meta-label">Payment Method</span>
              <strong>{order.paymentMethod}</strong>
            </div>
            <div className="hnl-order-meta-item">
              <span className="hnl-meta-label">Payment Status</span>
              <strong>{order.paymentStatus}</strong>
            </div>
            <div className="hnl-order-meta-item">
              <span className="hnl-meta-label">Estimated Delivery</span>
              <strong>{order.estimatedDelivery}</strong>
            </div>
          </div>

          {/* Quick tracker preview */}
          <div className="hnl-order-quick-tracker">
            <p className="hnl-tracker-hint">
              Preview status: <strong>{order.currentStatus}</strong>. This is not a shipment confirmation, and live tracking is unavailable.
            </p>
          </div>

          {/* Order Details Breakdown */}
          <div className="hnl-order-breakdown-grid">
            {/* Items */}
            <div className="hnl-order-items-col">
              <h3>Items Ordered ({order.items.length})</h3>
              <div className="hnl-order-items-list">
                {order.items.map((item, idx) => (
                  <div key={idx} className="hnl-order-item-row">
                    <div className="hnl-order-item-thumb">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        width={60}
                        height={60}
                        className="hnl-rounded-img hnl-order-confirmation-image"
                      />
                    </div>
                    <div className="hnl-order-item-meta">
                      <h4>{item.productName}</h4>
                      <p>Size: {item.variantName} · Qty: {item.quantity}</p>
                    </div>
                    <div className="hnl-order-item-price">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Pricing */}
            <div className="hnl-order-address-col">
              <h3>Delivery Details</h3>
              <div className="hnl-address-preview-box">
                <p>
                  <strong>{order.shippingAddress.fullName}</strong>
                  <br />
                  {order.shippingAddress.houseFlat}, {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.area}, {order.shippingAddress.city}
                  <br />
                  {order.shippingAddress.state} – {order.shippingAddress.pincode}
                  <br />
                  Phone: {order.shippingAddress.mobile}
                </p>
              </div>

              <h3>Payment Summary</h3>
              <div className="hnl-receipt-totals">
                <div className="hnl-summary-row">
                  <span>Subtotal</span>
                  <span>₹{order.pricing.subtotal}</span>
                </div>
                {order.pricing.couponDiscount > 0 && (
                  <div className="hnl-summary-row hnl-coupon-row">
                    <span>Coupon ({order.couponCode})</span>
                    <span>-₹{order.pricing.couponDiscount}</span>
                  </div>
                )}
                <div className="hnl-summary-row">
                  <span>Shipping</span>
                  <span>{order.pricing.shippingFee === 0 ? "FREE" : `₹${order.pricing.shippingFee}`}</span>
                </div>
                <div className="hnl-summary-divider"></div>
                <div className="hnl-summary-row hnl-summary-total">
                  <span>Grand Total</span>
                  <span>₹{order.pricing.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="hnl-order-success-actions">
            <Link
              href={`/account/orders/${order.orderNumber}`}
              className="hnl-button hnl-button--accent"
            >
              View Saved Preview
            </Link>
            <button
              type="button"
              className="hnl-button hnl-button--outline"
              onClick={() => window.print()}
            >
              Print Preview Details
            </button>
            <Link href="/shop" className="hnl-button">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="hnl-page">
          <div className="hnl-container hnl-loading-state">
            <div className="hnl-spinner"></div>
            <p>Loading your order details…</p>
          </div>
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
