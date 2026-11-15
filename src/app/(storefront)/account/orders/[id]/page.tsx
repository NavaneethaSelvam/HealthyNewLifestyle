"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getOrderByNumber } from "@/services/orderService";
import { Order } from "@/types/storefront";

function OrderTrackingDetailContent() {
  const params = useParams();
  const orderId = (params?.id as string) || "";
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrder(orderId ? getOrderByNumber(orderId) : null);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [orderId]);

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
          <div className="hnl-empty-state-icon">🔍</div>
          <h2>Shipment Record Not Found</h2>
          <p>We could not find an order matching &quot;{orderId}&quot;.</p>
          <div className="hnl-hero-actions">
            <Link href="/account/orders" className="hnl-button">
              View All Orders
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
    <main className="hnl-page hnl-tracking-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/account">My Account</Link>
          <span aria-hidden="true">/</span>
          <Link href="/account/orders">Orders</Link>
          <span aria-hidden="true">/</span>
          <span>{order.orderNumber}</span>
        </nav>

        {/* Tracking Header */}
        <header className="hnl-tracking-header">
          <div>
            <span className="hnl-eyebrow">LOCAL ORDER PREVIEW</span>
            <h1>Preview {order.orderNumber}</h1>
            <p className="hnl-tracking-eta">
              Status: <strong>{order.currentStatus}</strong> · {order.estimatedDelivery}
            </p>
          </div>

          <div className="hnl-tracking-header-actions">
            <button
              type="button"
              className="hnl-button hnl-button--small hnl-button--outline"
              onClick={() => window.print()}
            >
              Print Receipt
            </button>
            <a href="tel:6381243416" className="hnl-button hnl-button--small">
              Help: 6381243416
            </a>
          </div>
        </header>

        {/* Visual Timeline Section */}
        <section className="hnl-timeline-card">
          <h2>Saved Preview Record</h2>
          <div className="hnl-tracking-timeline">
            {order.trackingSteps.map((step, idx) => (
              <div
                key={step.status + idx}
                className={`hnl-timeline-step ${step.completed ? "is-completed" : "is-pending"}`}
              >
                <div className="hnl-timeline-marker">
                  <div className="hnl-marker-circle">
                    {step.completed ? "✓" : idx + 1}
                  </div>
                  {idx < order.trackingSteps.length - 1 && (
                    <div className="hnl-timeline-connector"></div>
                  )}
                </div>

                <div className="hnl-timeline-content">
                  <div className="hnl-timeline-title-row">
                    <h4>{step.label}</h4>
                    <span className="hnl-timeline-time">{step.timestamp}</span>
                  </div>
                  <p className="hnl-timeline-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Details Two-Column Layout */}
        <div className="hnl-tracking-details-grid">
          {/* Items */}
          <section className="hnl-tracking-items-col">
            <h2>Package Contents ({order.items.length})</h2>
            <div className="hnl-tracking-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="hnl-tracking-item-row">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    width={72}
                    height={72}
                    className="hnl-rounded-img"
                  />
                  <div className="hnl-tracking-item-meta">
                    <h4>{item.productName}</h4>
                    <p>Package size: {item.variantName}</p>
                    <p>Qty: {item.quantity} · Price: ₹{item.price}</p>
                  </div>
                  <span className="hnl-tracking-item-subtotal">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping Address & Pricing Summary */}
          <aside className="hnl-tracking-sidebar">
            <div className="hnl-tracking-aside-box">
              <h3>Shipping Destination</h3>
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

              <div className="hnl-summary-divider"></div>

              <h3>Payment & Invoicing</h3>
              <div className="hnl-summary-row">
                <span>Method</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="hnl-summary-row">
                <span>Status</span>
                <span className="hnl-status-paid">{order.paymentStatus}</span>
              </div>
              <div className="hnl-summary-row">
                <span>Items Subtotal</span>
                <span>₹{order.pricing.subtotal}</span>
              </div>
              {order.pricing.couponDiscount > 0 && (
                <div className="hnl-summary-row hnl-coupon-row">
                  <span>Coupon Discount</span>
                  <span>-₹{order.pricing.couponDiscount}</span>
                </div>
              )}
              <div className="hnl-summary-row">
                <span>Delivery Charge</span>
                <span>{order.pricing.shippingFee === 0 ? "FREE" : `₹${order.pricing.shippingFee}`}</span>
              </div>
              <div className="hnl-summary-divider"></div>
              <div className="hnl-summary-row hnl-summary-total">
                <span>Total Billed</span>
                <span>₹{order.pricing.total}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function OrderTrackingDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="hnl-page">
          <div className="hnl-container hnl-loading-state">
            <div className="hnl-spinner"></div>
            <p>Loading tracking timeline…</p>
          </div>
        </main>
      }
    >
      <OrderTrackingDetailContent />
    </Suspense>
  );
}
