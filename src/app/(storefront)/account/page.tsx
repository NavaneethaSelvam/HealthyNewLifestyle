"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useStorefront } from "@/features/cart/StorefrontProvider";
import { getOrders } from "@/services/orderService";
import type { Address, Order } from "@/types/storefront";

type AddressFormValues = Omit<Address, "id">;

const EMPTY_ADDRESS: AddressFormValues = {
  fullName: "",
  mobile: "",
  houseFlat: "",
  street: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  isDefault: false,
  type: "Home",
};

function AccountDashboard() {
  const reduceMotion = useReducedMotion();
  const {
    user,
    updateProfile,
    clearProfile,
    addresses,
    wishlist,
    resetAllDemoData,
    addNewAddress,
    removeAddress,
    setDefaultAddressId,
    hydrated,
  } = useStorefront();

  const [editingProfile, setEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user.fullName);
  const [emailInput, setEmailInput] = useState(user.email);
  const [mobileInput, setMobileInput] = useState(user.mobile);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [managingAddresses, setManagingAddresses] = useState(false);
  const [addressInput, setAddressInput] = useState<AddressFormValues>(EMPTY_ADDRESS);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => setOrders(getOrders()), 0);
    return () => window.clearTimeout(timer);
  }, [hydrated]);

  const recentOrders = orders.slice(0, 5);
  const hasProfile = Boolean(user.fullName || user.email || user.mobile);
  const profileStatus = hasProfile ? "Saved locally" : "Guest profile";

  const handleSaveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile({
      fullName: nameInput.trim(),
      email: emailInput.trim(),
      mobile: mobileInput.trim(),
    });
    setEditingProfile(false);
  };

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    clearProfile();
    setEditingProfile(false);
  };

  const handleAddressSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addNewAddress({
      ...addressInput,
      fullName: addressInput.fullName.trim(),
      mobile: addressInput.mobile.trim(),
      houseFlat: addressInput.houseFlat.trim(),
      street: addressInput.street.trim(),
      area: addressInput.area.trim(),
      city: addressInput.city.trim(),
      state: addressInput.state.trim(),
      pincode: addressInput.pincode.trim(),
      landmark: addressInput.landmark?.trim(),
    });
    setAddressInput(EMPTY_ADDRESS);
    setAddressFormOpen(false);
  };

  const updateAddressText = (
    field: "fullName" | "mobile" | "houseFlat" | "street" | "area" | "city" | "state" | "pincode" | "landmark",
    value: string,
  ) => {
    setAddressInput((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="hnl-page hnl-account-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>My Account</span>
        </nav>

        <header className="hnl-commerce-page-heading">
          <div>
            <span className="hnl-eyebrow">YOUR ACCOUNT</span>
            <h1>My Account</h1>
          </div>
          <p>Your account, your journey with us. Manage your profile, orders, and delivery addresses in one place.</p>
        </header>

        <div className="hnl-account-dashboard-layout" id="dashboard">
          <motion.nav
            className="hnl-account-sidebar"
            aria-label="Account navigation"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.08 }}
          >
            <p className="hnl-account-sidebar-title">My Account</p>
            <Link href="#dashboard" className="is-active" aria-current="page">
              <span aria-hidden="true">⌂</span> Dashboard
            </Link>
            <Link href="/account/orders">
              <span aria-hidden="true">▤</span> Orders
            </Link>
            <Link href="/wishlist">
              <span aria-hidden="true">♡</span> Wishlist
            </Link>
            <Link href="#account-addresses">
              <span aria-hidden="true">⌖</span> Addresses
            </Link>
            <Link href="#account-settings">
              <span aria-hidden="true">⚙</span> Account Settings
            </Link>
            <Link href="/login" onClick={handleLogout}>
              <span aria-hidden="true">↪</span> Log Out
            </Link>
          </motion.nav>

          <motion.div
            className="hnl-account-main"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : 0.12 }}
          >
            <section className="hnl-account-welcome" id="account-settings">
              <div className="hnl-account-avatar" aria-hidden="true">
                {user.fullName ? (
                  user.fullName.trim().charAt(0).toUpperCase()
                ) : (
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M4.5 20c.7-3.8 3.2-5.8 7.5-5.8s6.8 2 7.5 5.8" />
                  </svg>
                )}
              </div>
              <div className="hnl-account-welcome-copy">
                <span className="hnl-eyebrow">YOUR DASHBOARD</span>
                <h2>
                  Welcome back{user.fullName ? `, ${user.fullName}` : ""}
                </h2>
                <p>{user.email || "No email address saved"}</p>
                {user.mobile && (
                  <span className="hnl-account-mobile">
                    <span aria-hidden="true">☎</span> {user.mobile}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="hnl-button hnl-button--outline hnl-button--small"
                onClick={() => {
                  if (editingProfile) {
                    setEditingProfile(false);
                    return;
                  }
                  setNameInput(user.fullName);
                  setEmailInput(user.email);
                  setMobileInput(user.mobile);
                  setEditingProfile(true);
                }}
              >
                {editingProfile ? "Cancel" : "Edit Profile"}
              </button>
            </section>

            {editingProfile && (
              <section className="hnl-account-edit-box" aria-labelledby="hnl-account-edit-title">
                <h2 id="hnl-account-edit-title">Update Profile Details</h2>
                <form onSubmit={handleSaveProfile} className="hnl-form-grid">
                  <div className="hnl-field">
                    <label className="hnl-field-label" htmlFor="account-full-name">Full Name</label>
                    <input
                      id="account-full-name"
                      type="text"
                      className="hnl-input"
                      value={nameInput}
                      onChange={(event) => setNameInput(event.target.value)}
                      required
                    />
                  </div>
                  <div className="hnl-field">
                    <label className="hnl-field-label" htmlFor="account-mobile">Mobile Number</label>
                    <input
                      id="account-mobile"
                      type="tel"
                      className="hnl-input"
                      value={mobileInput}
                      onChange={(event) => setMobileInput(event.target.value)}
                      required
                    />
                  </div>
                  <div className="hnl-field hnl-field--full">
                    <label className="hnl-field-label" htmlFor="account-email">Email Address</label>
                    <input
                      id="account-email"
                      type="email"
                      className="hnl-input"
                      value={emailInput}
                      onChange={(event) => setEmailInput(event.target.value)}
                    />
                  </div>
                  <div className="hnl-field hnl-field--full hnl-account-form-actions">
                    <button type="submit" className="hnl-button">Save Changes</button>
                    <button
                      type="button"
                      className="hnl-button hnl-button--outline"
                      onClick={() => setEditingProfile(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="hnl-account-stats-grid" aria-label="Account summary">
              <Link href="/account/orders" className="hnl-stat-card">
                <span className="hnl-stat-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 8.5h14l1 12H4l1-12Z" />
                    <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                  </svg>
                </span>
                <span className="hnl-stat-num">{orders.length}</span>
                <span className="hnl-stat-title">Total Orders</span>
                <span className="hnl-stat-link">View order history →</span>
              </Link>
              <Link href="/wishlist" className="hnl-stat-card">
                <span className="hnl-stat-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20.2 8.8c0 4.3-8.2 10-8.2 10s-8.2-5.7-8.2-10a4.25 4.25 0 0 1 8.2-1.5 4.25 4.25 0 0 1 8.2 1.5Z" />
                  </svg>
                </span>
                <span className="hnl-stat-num">{wishlist.length}</span>
                <span className="hnl-stat-title">Wishlist Items</span>
                <span className="hnl-stat-link">View saved items →</span>
              </Link>
              <div className="hnl-stat-card hnl-account-status-card">
                <span className="hnl-stat-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M19.5 4.5c-8.2 0-13 3.2-13 8.3a5.4 5.4 0 0 0 5.4 5.4c5.1 0 7.6-5.6 7.6-13.7Z" />
                    <path d="M5 21c1.8-4.4 5-7.5 10-10" />
                  </svg>
                </span>
                <span className="hnl-stat-title">Account Status</span>
                <span className="hnl-account-status-value">{profileStatus}</span>
              </div>
            </section>

            <section className="hnl-account-panel hnl-account-orders" aria-labelledby="hnl-recent-orders-title">
              <div className="hnl-account-panel-heading">
                <div>
                  <span className="hnl-eyebrow">YOUR PURCHASES</span>
                  <h2 id="hnl-recent-orders-title">Recent Orders</h2>
                </div>
                <Link href="/account/orders" className="hnl-text-link">View all orders →</Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="hnl-account-orders-table-wrap">
                  <table className="hnl-account-orders-table">
                    <thead>
                      <tr>
                        <th scope="col">Order</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Total</th>
                        <th scope="col"><span className="hnl-visually-hidden">Details</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.orderNumber}>
                          <td data-label="Order">
                            <strong>{order.orderNumber}</strong>
                          </td>
                          <td data-label="Date">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td data-label="Status">
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
                          </td>
                          <td data-label="Total">₹{order.pricing.total}</td>
                          <td data-label="Details">
                            <Link
                              href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
                              className="hnl-account-order-link"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="hnl-account-empty">
                  <span className="hnl-account-empty-icon" aria-hidden="true">
                    <svg viewBox="0 0 48 48" fill="none">
                      <path d="M10 16h28l2 25H8l2-25Z" />
                      <path d="M17 17V12a7 7 0 0 1 14 0v5" />
                      <path d="M19 27c2 2 8 2 10 0" />
                    </svg>
                  </span>
                  <div className="hnl-account-empty-copy">
                    <strong>No recent orders yet</strong>
                    <p>Your order history will appear here after checkout.</p>
                  </div>
                  <Link href="/shop" className="hnl-button hnl-button--outline hnl-button--small">
                    Explore the shop
                  </Link>
                </div>
              )}
              {orders.some((order) => order.currentStatus === "Preview Only") && (
                <p className="hnl-account-local-note">
                  Order history shown here is saved in this browser; checkout is a local preview.
                </p>
              )}
            </section>

            <section
              className="hnl-account-panel hnl-account-addresses"
              id="account-addresses"
              aria-labelledby="hnl-account-addresses-title"
            >
              <div className="hnl-account-panel-heading">
                <div>
                  <span className="hnl-eyebrow">DELIVERY DETAILS</span>
                  <h2 id="hnl-account-addresses-title">Your Addresses</h2>
                </div>
                <div className="hnl-account-address-actions">
                  <button
                    type="button"
                    className="hnl-button hnl-button--outline hnl-button--small"
                    onClick={() => setManagingAddresses((current) => !current)}
                  >
                    {managingAddresses ? "Done" : "Manage Addresses"}
                  </button>
                  <button
                    type="button"
                    className="hnl-button hnl-button--small"
                    onClick={() => {
                      setAddressInput({
                        ...EMPTY_ADDRESS,
                        fullName: user.fullName,
                        mobile: user.mobile,
                        isDefault: addresses.length === 0,
                      });
                      setAddressFormOpen((current) => !current);
                    }}
                  >
                    {addressFormOpen ? "Close Form" : "Add Address"}
                  </button>
                </div>
              </div>

              {addressFormOpen && (
                <form className="hnl-account-address-form" onSubmit={handleAddressSubmit}>
                  <h3>Add a delivery address</h3>
                  <div className="hnl-account-address-form-grid">
                    <div className="hnl-field">
                      <label className="hnl-field-label" htmlFor="address-name">Full Name</label>
                      <input id="address-name" className="hnl-input" value={addressInput.fullName} onChange={(event) => updateAddressText("fullName", event.target.value)} required />
                    </div>
                    <div className="hnl-field">
                      <label className="hnl-field-label" htmlFor="address-mobile">Mobile Number</label>
                      <input id="address-mobile" className="hnl-input" type="tel" value={addressInput.mobile} onChange={(event) => updateAddressText("mobile", event.target.value)} required />
                    </div>
                    <div className="hnl-field">
                      <label className="hnl-field-label" htmlFor="address-house">House / Flat</label>
                      <input id="address-house" className="hnl-input" value={addressInput.houseFlat} onChange={(event) => updateAddressText("houseFlat", event.target.value)} required />
                    </div>
                    <div className="hnl-field">
                      <label className="hnl-field-label" htmlFor="address-street">Street</label>
                      <input id="address-street" className="hnl-input" value={addressInput.street} onChange={(event) => updateAddressText("street", event.target.value)} required />
                    </div>
                    <div className="hnl-field">
                      <label className="hnl-field-label" htmlFor="address-area">Area</label>
                      <input id="address-area" className="hnl-input" value={addressInput.area} onChange={(event) => updateAddressText("area", event.target.value)} required />
                    </div>
                    <div className="hnl-field">
                      <label className="hnl-field-label" htmlFor="address-city">City</label>
                      <input id="address-city" className="hnl-input" value={addressInput.city} onChange={(event) => updateAddressText("city", event.target.value)} />
                    </div>
                    <div className="hnl-field">
                      <label className="hnl-field-label" htmlFor="address-state">State</label>
                      <input id="address-state" className="hnl-input" value={addressInput.state} onChange={(event) => updateAddressText("state", event.target.value)} />
                    </div>
                    <div className="hnl-field">
                      <label className="hnl-field-label" htmlFor="address-pincode">PIN Code</label>
                      <input id="address-pincode" className="hnl-input" inputMode="numeric" value={addressInput.pincode} onChange={(event) => updateAddressText("pincode", event.target.value)} required />
                    </div>
                    <div className="hnl-field">
                      <label className="hnl-field-label" htmlFor="address-type">Address Type</label>
                      <select
                        id="address-type"
                        className="hnl-input"
                        value={addressInput.type ?? "Home"}
                        onChange={(event) => setAddressInput((current) => ({
                          ...current,
                          type: event.target.value as AddressFormValues["type"],
                        }))}
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="hnl-field hnl-account-address-default">
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(addressInput.isDefault)}
                          onChange={(event) => setAddressInput((current) => ({
                            ...current,
                            isDefault: event.target.checked,
                          }))}
                        />
                        Set as default address
                      </label>
                    </div>
                  </div>
                  <div className="hnl-account-form-actions">
                    <button type="submit" className="hnl-button">Save Address</button>
                    <button type="button" className="hnl-button hnl-button--outline" onClick={() => setAddressFormOpen(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {addresses.length > 0 ? (
                <div className="hnl-saved-addresses-list">
                  {addresses.map((address) => (
                    <article key={address.id} className="hnl-address-snippet">
                      <div className="hnl-address-snippet-top">
                        <div>
                          <strong>{address.fullName}</strong>
                          <span className="hnl-account-address-type">{address.type || "Address"}</span>
                        </div>
                        {address.isDefault && <span className="hnl-addr-default-pill">Default</span>}
                      </div>
                      <p>
                        {[address.houseFlat, address.street, address.area].filter(Boolean).join(", ")}
                        <br />
                        {[address.city, address.state, address.pincode].filter(Boolean).join(", ")}
                      </p>
                      {address.landmark && <p className="hnl-account-address-landmark">Near {address.landmark}</p>}
                      <p className="hnl-address-phone">Phone: {address.mobile}</p>
                      {managingAddresses && (
                        <div className="hnl-account-address-manage-actions">
                          {!address.isDefault && (
                            <button type="button" onClick={() => setDefaultAddressId(address.id)}>
                              Set as default
                            </button>
                          )}
                          <button
                            type="button"
                            className="is-danger"
                            onClick={() => removeAddress(address.id)}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="hnl-account-empty hnl-account-address-empty">
                  <span className="hnl-account-empty-icon" aria-hidden="true">
                    <svg viewBox="0 0 48 48" fill="none">
                      <path d="M38 20c0 10-14 22-14 22S10 30 10 20a14 14 0 1 1 28 0Z" />
                      <circle cx="24" cy="20" r="5" />
                    </svg>
                  </span>
                  <div className="hnl-account-empty-copy">
                    <strong>No saved addresses yet</strong>
                    <p>Add a delivery address to keep it ready for your next checkout.</p>
                  </div>
                </div>
              )}

              <p className="hnl-account-support-note">
                Need assistance? Contact OrganicandNutrition in Vellore at{" "}
                <a href="tel:6381243416">6381243416</a> · Mon–Sat, 9:00 AM–7:00 PM.
              </p>
            </section>

            <details className="hnl-account-reset">
              <summary>Reset local preview data</summary>
              <p>This clears locally saved cart, wishlist, addresses, coupons, order previews, and profile information.</p>
              <button
                type="button"
                className="hnl-text-button hnl-text-button--danger"
                onClick={resetAllDemoData}
              >
                Clear Local Data
              </button>
            </details>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function AccountPage() {
  return <AccountDashboard />;
}
