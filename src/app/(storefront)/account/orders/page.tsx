"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getOrders } from "@/services/orderService";
import { useStorefront } from "@/features/cart/StorefrontProvider";
import { Order } from "@/types/storefront";

export default function OrdersPage() {
  const { addToCart, addToast, hydrated } = useStorefront();
  const [filterTab, setFilterTab] = useState<"all" | "preview" | "delivered">("all");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => setOrders(getOrders()), 0);
    return () => window.clearTimeout(timer);
  }, [hydrated]);

  const filteredOrders = orders.filter((o) => {
    if (filterTab === "preview") return o.currentStatus === "Preview Only";
    if (filterTab === "delivered") return o.currentStatus === "Delivered";
    return true;
  });

  const handleReorder = (order: Order) => {
    order.items.forEach((it) => {
      addToCart(it.productId, it.quantity, it.variantName);
    });
    addToast({
      type: "success",
      title: "Items Added to Bag",
      message: `All ${order.items.length} items from preview ${order.orderNumber} added to your cart.`,
    });
  };

  return (
    <main className="hnl-page hnl-orders-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/account">My Account</Link>
          <span aria-hidden="true">/</span>
          <span>Order History</span>
        </nav>

        <header className="hnl-page-heading">
          <span className="hnl-eyebrow">LOCAL ORDER RECORDS</span>
          <h1>Order History</h1>
          <p>Records saved by this browser preview. Live shipping updates and payment processing are not connected.</p>
        </header>

        {/* Filter Tabs */}
        <div className="hnl-tabs-nav" role="tablist">
          <button
            type="button"
            className={`hnl-tab-btn ${filterTab === "all" ? "is-active" : ""}`}
            onClick={() => setFilterTab("all")}
          >
            All Previews ({orders.length})
          </button>
          <button
            type="button"
            className={`hnl-tab-btn ${filterTab === "preview" ? "is-active" : ""}`}
            onClick={() => setFilterTab("preview")}
          >
            Saved previews ({orders.filter((o) => o.currentStatus === "Preview Only").length})
          </button>
          <button
            type="button"
            className={`hnl-tab-btn ${filterTab === "delivered" ? "is-active" : ""}`}
            onClick={() => setFilterTab("delivered")}
          >
            Delivered ({orders.filter((o) => o.currentStatus === "Delivered").length})
          </button>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="hnl-orders-list">
            {filteredOrders.map((order) => (
              <article key={order.orderNumber} className="hnl-order-history-card">
                <div className="hnl-order-header-bar">
                  <div className="hnl-order-head-item">
                    <span className="hnl-head-label">Preview Saved</span>
                    <span className="hnl-head-val">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="hnl-order-head-item">
                    <span className="hnl-head-label">Order Reference</span>
                    <span className="hnl-head-val">{order.orderNumber}</span>
                  </div>

                  <div className="hnl-order-head-item">
                    <span className="hnl-head-label">Total Amount</span>
                    <span className="hnl-head-val">₹{order.pricing.total}</span>
                  </div>

                  <div className="hnl-order-head-item">
                    <span className="hnl-head-label">Ship To</span>
                    <span className="hnl-head-val">{order.shippingAddress.fullName}</span>
                  </div>

                  <div className="hnl-order-head-status">
                    <span
                      className={`hnl-status-pill ${
                        order.currentStatus === "Delivered"
                          ? "is-delivered"
                          : order.currentStatus === "Preview Only"
                            ? "is-preview"
                            : "is-in-transit"
                      }`}
                    >
                      {order.currentStatus}
                    </span>
                  </div>
                </div>

                <div className="hnl-order-card-body">
                  <div className="hnl-order-items-grid">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="hnl-order-item-detail">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          width={72}
                          height={72}
                          className="hnl-order-item-img"
                        />
                        <div className="hnl-order-item-text">
                          <h4>{item.productName}</h4>
                          <p>Variant: {item.variantName}</p>
                          <p>
                            Quantity: {item.quantity} · Price: ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hnl-order-card-actions">
                    <Link
                      href={`/account/orders/${order.orderNumber}`}
                      className="hnl-button hnl-button--small hnl-button--accent"
                    >
                      View Preview
                    </Link>
                    <button
                      type="button"
                      className="hnl-button hnl-button--small hnl-button--outline"
                      onClick={() => handleReorder(order)}
                    >
                      Reorder Items
                    </button>
                    <Link
                      href={`/order-success?orderNumber=${order.orderNumber}`}
                      className="hnl-text-button"
                    >
                      View Receipt
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="hnl-empty-state">
            <div className="hnl-empty-state-icon">📦</div>
            <h2>No orders found in this view</h2>
            <p>Explore the catalog and save a checkout preview in this browser.</p>
            <Link href="/shop" className="hnl-button">
              Explore Catalog
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
