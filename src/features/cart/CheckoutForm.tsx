"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useStorefront } from "@/features/cart/StorefrontProvider";
import { createOrder } from "@/services/orderService";
import { Address } from "@/types/storefront";

type CheckoutStep = "customer" | "address" | "delivery" | "payment" | "review";

export function CheckoutForm() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartOriginalTotal,
    cartSavings,
    couponDiscount,
    appliedCoupon,
    shippingFee,
    freeShippingThreshold,
    freeShippingRemaining,
    orderTotal,
    hydrated,
    clearCart,
    user,
    updateProfile,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addNewAddress,
    addToast,
  } = useStorefront();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("customer");

  // Customer state
  const [customerName, setCustomerName] = useState(user.fullName || "");
  const [customerEmail, setCustomerEmail] = useState(user.email || "");
  const [customerMobile, setCustomerMobile] = useState(user.mobile || "");

  // Address state
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newFullName, setNewFullName] = useState(user.fullName || "");
  const [newMobile, setNewMobile] = useState(user.mobile || "");
  const [newHouseFlat, setNewHouseFlat] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [newLandmark, setNewLandmark] = useState("");
  const [newAddressType, setNewAddressType] = useState<"Home" | "Work">("Home");

  // Delivery method
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "express">("standard");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash on Delivery" | "UPI" | "Credit / Debit Card"
  >("Cash on Delivery");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const isSubmittingRef = useRef(false);

  if (!hydrated) {
    return (
      <main className="hnl-page">
        <div className="hnl-container hnl-loading-state" role="status">
          <div className="hnl-spinner"></div>
          <p>Loading checkout preview…</p>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="hnl-page">
        <div className="hnl-container hnl-checkout-empty">
          <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/cart">Cart</Link>
            <span aria-hidden="true">/</span>
            <span>Checkout</span>
          </nav>
          <header className="hnl-checkout-heading">
            <h1>Checkout</h1>
            <p>Complete your order with us.</p>
            <span className="hnl-checkout-local-indicator">
              <span className="hnl-checkout-status-dot" aria-hidden="true" />
              Local preview · no payment processed
            </span>
          </header>
          <div className="hnl-empty-state">
            <h2>Your basket is empty</h2>
            <p>Please add products to your bag before checking out.</p>
            <Link className="hnl-button" href="/shop">
              Browse Organic Catalog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Active chosen address
  let activeShippingAddress: Address | undefined;
  if (!useNewAddress && addresses.length > 0) {
    activeShippingAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
  } else {
    activeShippingAddress = {
      id: "temp_addr",
      fullName: newFullName,
      mobile: newMobile,
      houseFlat: newHouseFlat,
      street: newStreet,
      area: newArea,
      city: newCity,
      state: newState,
      pincode: newPincode,
      landmark: newLandmark,
      type: newAddressType,
    };
  }

  // Steps validation & navigation
  const validateCustomer = () => {
    const invalid: string[] = [];
    const digits = customerMobile.replace(/\D/g, "");
    if (!customerName.trim()) invalid.push("customerName");
    if (digits.length < 10 || digits.length > 13) invalid.push("customerMobile");
    if (customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      invalid.push("customerEmail");
    }

    setInvalidFields(invalid);
    if (invalid.length > 0) {
      setValidationError(
        invalid.includes("customerEmail")
          ? "Please enter a valid email address or leave it blank."
          : "Please enter your name and a valid contact phone number.",
      );
      return false;
    }
    return true;
  };

  const validateNewAddress = () => {
    const invalid: string[] = [];
    if (!(newFullName.trim() || customerName.trim())) invalid.push("newFullName");
    const recipientMobile = (newMobile || customerMobile).replace(/\D/g, "");
    if (recipientMobile.length < 10 || recipientMobile.length > 13) invalid.push("newMobile");
    if (!newHouseFlat.trim()) invalid.push("newHouseFlat");
    if (!newStreet.trim()) invalid.push("newStreet");
    if (!newArea.trim()) invalid.push("newArea");
    if (!newCity.trim()) invalid.push("newCity");
    if (!newState.trim()) invalid.push("newState");
    if (!/^\d{6}$/.test(newPincode.trim())) invalid.push("newPincode");

    setInvalidFields(invalid);
    if (invalid.length > 0) {
      setValidationError("Please complete the required delivery address fields. Enter a 6-digit pincode.");
      return false;
    }
    return true;
  };

  const goToAddress = () => {
    if (!validateCustomer()) return;
    setValidationError("");
    updateProfile({ fullName: customerName, email: customerEmail, mobile: customerMobile });
    setCurrentStep("address");
  };

  const goToDelivery = () => {
    if (useNewAddress || addresses.length === 0) {
      if (!validateCustomer() || !validateNewAddress()) return;
      // Save newly created address
      const created = addNewAddress({
        fullName: newFullName || customerName,
        mobile: newMobile || customerMobile,
        houseFlat: newHouseFlat,
        street: newStreet,
        area: newArea,
        city: newCity,
        state: newState,
        pincode: newPincode,
        landmark: newLandmark,
        type: newAddressType,
      });
      setSelectedAddressId(created.id);
      setUseNewAddress(false);
    } else if (!activeShippingAddress) {
      setValidationError("Please select or add a delivery address.");
      return;
    }
    setValidationError("");
    setCurrentStep("delivery");
  };

  const goToPayment = () => {
    if (!validateCustomer()) {
      setCurrentStep("customer");
      return;
    }
    if (useNewAddress || addresses.length === 0) {
      if (!validateNewAddress()) {
        setCurrentStep("address");
        return;
      }
    } else if (!activeShippingAddress) {
      setValidationError("Please select or add a delivery address.");
      setCurrentStep("address");
      return;
    }
    setValidationError("");
    setCurrentStep("payment");
  };

  const goToReview = () => {
    if (!validateCustomer()) {
      setCurrentStep("customer");
      return;
    }
    if (useNewAddress || addresses.length === 0) {
      if (!validateNewAddress()) {
        setCurrentStep("address");
        return;
      }
    } else if (!activeShippingAddress) {
      setValidationError("Please select or add a delivery address.");
      setCurrentStep("address");
      return;
    }
    setValidationError("");
    setCurrentStep("review");
  };

  const handlePlaceOrder = () => {
    if (isSubmittingRef.current) return;
    if (!validateCustomer()) {
      setCurrentStep("customer");
      return;
    }
    if (!activeShippingAddress || !activeShippingAddress.fullName.trim() ||
      !activeShippingAddress.mobile.trim() || !activeShippingAddress.houseFlat.trim() ||
      !activeShippingAddress.street.trim() || !activeShippingAddress.area.trim() ||
      !activeShippingAddress.city.trim() || !activeShippingAddress.state.trim() ||
      !/^\d{6}$/.test(activeShippingAddress.pincode.trim())) {
      setValidationError("Please provide a complete delivery address before placing your order.");
      setCurrentStep("address");
      return;
    }

    isSubmittingRef.current = true;
    setIsPlacingOrder(true);

    const orderItems = cart.map((line) => ({
      productId: line.productId,
      productName: line.product.name,
      variantName: line.variant,
      quantity: line.quantity,
      price: line.price,
      image: line.product.image,
    }));

    const finalShippingFee = deliverySpeed === "express" ? shippingFee + 40 : shippingFee;
    const finalTotal = cartSubtotal - couponDiscount + finalShippingFee;

    let newOrder: ReturnType<typeof createOrder>;
    try {
      newOrder = createOrder({
        customer: {
          fullName: customerName,
          email: customerEmail,
          mobile: customerMobile,
        },
        shippingAddress: activeShippingAddress,
        items: orderItems,
        pricing: {
          subtotal: cartSubtotal,
          discount: 0,
          couponDiscount,
          shippingFee: finalShippingFee,
          total: finalTotal,
        },
        couponCode: appliedCoupon?.code,
        paymentMethod,
      });
    } catch {
      isSubmittingRef.current = false;
      setIsPlacingOrder(false);
      setValidationError("We couldn't save this checkout preview. Please try again.");
      addToast({
        type: "error",
        title: "Checkout preview could not be saved",
        message: "Please review your details and try again.",
      });
      return;
    }

    clearCart();
    addToast({
      type: "success",
      title: "Preview saved locally",
      message: `Reference ${newOrder.orderNumber} was not submitted to the store.`,
    });

    router.push(`/order-success?orderNumber=${newOrder.orderNumber}`);
  };

  return (
    <main className="hnl-page hnl-checkout-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/cart">Cart</Link>
          <span aria-hidden="true">/</span>
          <span>Checkout</span>
        </nav>

        <motion.header
          className="hnl-checkout-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <span className="hnl-eyebrow">ORDER FINALIZATION</span>
            <h1>Checkout</h1>
            <p>Complete your order with us.</p>
          </div>
          <span className="hnl-checkout-local-indicator">
            <span className="hnl-checkout-status-dot" aria-hidden="true" />
            Local preview · no payment processed
          </span>
        </motion.header>

        {/* Multi-step progress bar */}
        <nav className="hnl-checkout-stepper" aria-label="Checkout progress">
          <button
            type="button"
            className={`hnl-step-item ${currentStep === "customer" ? "is-active" : "is-complete"}`}
            onClick={() => setCurrentStep("customer")}
          >
            <span className="hnl-step-num">1</span>
            <span className="hnl-step-text">Contact</span>
          </button>
          <span className="hnl-step-arrow">→</span>

          <button
            type="button"
            className={`hnl-step-item ${currentStep === "address" ? "is-active" : currentStep === "delivery" || currentStep === "payment" || currentStep === "review" ? "is-complete" : ""}`}
            onClick={goToAddress}
          >
            <span className="hnl-step-num">2</span>
            <span className="hnl-step-text">Address</span>
          </button>
          <span className="hnl-step-arrow">→</span>

          <button
            type="button"
            className={`hnl-step-item ${currentStep === "delivery" ? "is-active" : currentStep === "payment" || currentStep === "review" ? "is-complete" : ""}`}
            onClick={goToDelivery}
          >
            <span className="hnl-step-num">3</span>
            <span className="hnl-step-text">Delivery</span>
          </button>
          <span className="hnl-step-arrow">→</span>

          <button
            type="button"
            className={`hnl-step-item ${currentStep === "payment" ? "is-active" : currentStep === "review" ? "is-complete" : ""}`}
            onClick={goToPayment}
          >
            <span className="hnl-step-num">4</span>
            <span className="hnl-step-text">Payment</span>
          </button>
          <span className="hnl-step-arrow">→</span>

          <button
            type="button"
            className={`hnl-step-item ${currentStep === "review" ? "is-active" : ""}`}
            onClick={goToReview}
          >
            <span className="hnl-step-num">5</span>
            <span className="hnl-step-text">Review</span>
          </button>
        </nav>

        {validationError && (
          <div className="hnl-status-message hnl-status-error hnl-checkout-error" role="alert">
            {validationError}
          </div>
        )}

        <motion.div
          className="hnl-checkout-layout"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.05 }}
        >
          {/* Main Step Form */}
          <div className="hnl-checkout-form-col">
            {/* STEP 1: Customer Details */}
            {currentStep === "customer" && (
              <section className="hnl-checkout-card">
                <h2>1. Customer Contact Details</h2>
                <p className="hnl-card-sub">
                  Contact details remain in this browser preview. No confirmation or dispatch messages are sent.
                </p>

                <div className="hnl-form-grid">
                  <div className={`hnl-field ${invalidFields.includes("customerName") ? "is-invalid" : ""}`}>
                    <label htmlFor="cust-name" className="hnl-field-label">Full Name *</label>
                    <input
                      id="cust-name"
                      type="text"
                      className="hnl-input"
                      value={customerName}
                      aria-invalid={invalidFields.includes("customerName")}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setValidationError("");
                        setInvalidFields([]);
                      }}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className={`hnl-field ${invalidFields.includes("customerMobile") ? "is-invalid" : ""}`}>
                    <label htmlFor="cust-phone" className="hnl-field-label">Mobile Number *</label>
                    <input
                      id="cust-phone"
                      type="tel"
                      className="hnl-input"
                      value={customerMobile}
                      aria-invalid={invalidFields.includes("customerMobile")}
                      onChange={(e) => {
                        setCustomerMobile(e.target.value);
                        setValidationError("");
                        setInvalidFields([]);
                      }}
                      placeholder="Mobile number"
                      required
                    />
                  </div>

                  <div className={`hnl-field hnl-field--full ${invalidFields.includes("customerEmail") ? "is-invalid" : ""}`}>
                    <label htmlFor="cust-email" className="hnl-field-label">Email Address (Optional)</label>
                    <input
                      id="cust-email"
                      type="email"
                      className="hnl-input"
                      value={customerEmail}
                      aria-invalid={invalidFields.includes("customerEmail")}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        setValidationError("");
                        setInvalidFields([]);
                      }}
                      placeholder="Email address"
                    />
                  </div>
                </div>

                <div className="hnl-checkout-nav-row">
                  <Link href="/cart" className="hnl-text-button">
                    ← Return to bag
                  </Link>
                  <button type="button" className="hnl-button" onClick={goToAddress}>
                    Continue to Delivery Address →
                  </button>
                </div>
              </section>
            )}

            {/* STEP 2: Address Selection */}
            {currentStep === "address" && (
              <section className="hnl-checkout-card">
                <div className="hnl-card-header-row">
                  <h2>2. Delivery Address</h2>
                  {addresses.length > 0 && <button
                    type="button"
                    className="hnl-button hnl-button--small hnl-button--outline"
                    onClick={() => setUseNewAddress(!useNewAddress)}
                  >
                    {useNewAddress ? "Select Saved Address" : "+ Add New Address"}
                  </button>}
                </div>

                {!useNewAddress && addresses.length > 0 ? (
                  <div className="hnl-saved-addresses-list">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`hnl-address-card ${selectedAddressId === addr.id ? "is-selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="checkout-address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                        <div className="hnl-address-body">
                          <div className="hnl-address-tag-row">
                            <strong>{addr.fullName}</strong>
                            {addr.type && <span className="hnl-addr-type-pill">{addr.type}</span>}
                            {addr.isDefault && <span className="hnl-addr-default-pill">Default</span>}
                          </div>
                          <p className="hnl-address-lines">
                            {addr.houseFlat}, {addr.street}, {addr.area}
                            <br />
                            {addr.city}, {addr.state} – <strong>{addr.pincode}</strong>
                          </p>
                          <p className="hnl-address-phone">Mobile: {addr.mobile}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="hnl-new-address-form">
                    <h3>{addresses.length > 0 ? "Enter New Delivery Address" : "Delivery address"}</h3>
                    <div className="hnl-form-grid">
                      <div className="hnl-field">
                        <label className="hnl-field-label">Recipient Name *</label>
                        <input
                          type="text"
                          className={`hnl-input ${invalidFields.includes("newFullName") ? "is-invalid" : ""}`}
                          value={newFullName}
                          aria-invalid={invalidFields.includes("newFullName")}
                          onChange={(e) => {
                            setNewFullName(e.target.value);
                            setValidationError("");
                            setInvalidFields([]);
                          }}
                          required
                        />
                      </div>
                      <div className="hnl-field">
                        <label className="hnl-field-label">Recipient Mobile *</label>
                        <input
                          type="tel"
                          className={`hnl-input ${invalidFields.includes("newMobile") ? "is-invalid" : ""}`}
                          value={newMobile}
                          aria-invalid={invalidFields.includes("newMobile")}
                          onChange={(e) => {
                            setNewMobile(e.target.value);
                            setValidationError("");
                            setInvalidFields([]);
                          }}
                          required
                        />
                      </div>
                      <div className="hnl-field">
                        <label className="hnl-field-label">Flat / House No. / Building *</label>
                        <input
                          type="text"
                          className={`hnl-input ${invalidFields.includes("newHouseFlat") ? "is-invalid" : ""}`}
                          value={newHouseFlat}
                          aria-invalid={invalidFields.includes("newHouseFlat")}
                          onChange={(e) => {
                            setNewHouseFlat(e.target.value);
                            setValidationError("");
                            setInvalidFields([]);
                          }}
                          placeholder="e.g. Flat 3A, Heritage Court"
                          required
                        />
                      </div>
                      <div className="hnl-field">
                        <label className="hnl-field-label">Street Address *</label>
                        <input
                          type="text"
                          className={`hnl-input ${invalidFields.includes("newStreet") ? "is-invalid" : ""}`}
                          value={newStreet}
                          aria-invalid={invalidFields.includes("newStreet")}
                          onChange={(e) => {
                            setNewStreet(e.target.value);
                            setValidationError("");
                            setInvalidFields([]);
                          }}
                          placeholder="e.g. 5th Cross, Gandhi Road"
                          required
                        />
                      </div>
                      <div className="hnl-field">
                        <label className="hnl-field-label">Area / Locality *</label>
                        <input
                          type="text"
                          className={`hnl-input ${invalidFields.includes("newArea") ? "is-invalid" : ""}`}
                          value={newArea}
                          aria-invalid={invalidFields.includes("newArea")}
                          onChange={(e) => {
                            setNewArea(e.target.value);
                            setValidationError("");
                            setInvalidFields([]);
                          }}
                          placeholder="e.g. Adyar"
                          required
                        />
                      </div>
                      <div className="hnl-field">
                        <label className="hnl-field-label">City *</label>
                        <input
                          type="text"
                          className={`hnl-input ${invalidFields.includes("newCity") ? "is-invalid" : ""}`}
                          value={newCity}
                          aria-invalid={invalidFields.includes("newCity")}
                          onChange={(e) => {
                            setNewCity(e.target.value);
                            setValidationError("");
                            setInvalidFields([]);
                          }}
                          required
                        />
                      </div>
                      <div className="hnl-field">
                        <label className="hnl-field-label">State *</label>
                        <input
                          type="text"
                          className={`hnl-input ${invalidFields.includes("newState") ? "is-invalid" : ""}`}
                          value={newState}
                          aria-invalid={invalidFields.includes("newState")}
                          onChange={(e) => {
                            setNewState(e.target.value);
                            setValidationError("");
                            setInvalidFields([]);
                          }}
                          required
                        />
                      </div>
                      <div className="hnl-field">
                        <label className="hnl-field-label">Pincode *</label>
                        <input
                          type="text"
                          className={`hnl-input ${invalidFields.includes("newPincode") ? "is-invalid" : ""}`}
                          value={newPincode}
                          aria-invalid={invalidFields.includes("newPincode")}
                          onChange={(e) => {
                            setNewPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                            setValidationError("");
                            setInvalidFields([]);
                          }}
                          maxLength={6}
                          inputMode="numeric"
                          pattern="\d{6}"
                          placeholder="e.g. 600020"
                          required
                        />
                      </div>
                      <div className="hnl-field">
                        <label className="hnl-field-label">Landmark (Optional)</label>
                        <input
                          type="text"
                          className="hnl-input"
                          value={newLandmark}
                          onChange={(e) => setNewLandmark(e.target.value)}
                          placeholder="e.g. Opposite Temple or near Post Office"
                        />
                      </div>
                      <div className="hnl-field">
                        <label className="hnl-field-label">Address Tag</label>
                        <select
                          className="hnl-select"
                          value={newAddressType}
                          onChange={(e) => setNewAddressType(e.target.value as "Home" | "Work")}
                        >
                          <option value="Home">Home (Residence)</option>
                          <option value="Work">Work / Office</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="hnl-checkout-nav-row">
                  <button
                    type="button"
                    className="hnl-text-button"
                    onClick={() => setCurrentStep("customer")}
                  >
                    ← Back to customer info
                  </button>
                  <button type="button" className="hnl-button" onClick={goToDelivery}>
                    Continue to Delivery Options →
                  </button>
                </div>
              </section>
            )}

            {/* STEP 3: Delivery Options */}
            {currentStep === "delivery" && (
              <section className="hnl-checkout-card">
                <h2>3. Shipping & Delivery Speed</h2>
                <p className="hnl-card-sub">
                  Delivery selections and charges below are estimates for this frontend preview only.
                </p>

                <div className="hnl-delivery-options">
                  <label
                    className={`hnl-option-card ${deliverySpeed === "standard" ? "is-selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="delivery-speed"
                      checked={deliverySpeed === "standard"}
                      onChange={() => setDeliverySpeed("standard")}
                    />
                    <div className="hnl-option-content">
                      <div className="hnl-option-title-row">
                        <strong>Standard Preview Option</strong>
                        <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                      </div>
                      <p>Delivery timing and availability are not connected to a fulfillment service.</p>
                    </div>
                  </label>

                  <label
                    className={`hnl-option-card ${deliverySpeed === "express" ? "is-selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="delivery-speed"
                      checked={deliverySpeed === "express"}
                      onChange={() => setDeliverySpeed("express")}
                    />
                    <div className="hnl-option-content">
                      <div className="hnl-option-title-row">
                        <strong>Express Preview Option</strong>
                        <span>₹{shippingFee + 40}</span>
                      </div>
                      <p>Express delivery is not available until a fulfillment service is connected.</p>
                    </div>
                  </label>
                </div>

                <div className="hnl-checkout-nav-row">
                  <button
                    type="button"
                    className="hnl-text-button"
                    onClick={() => setCurrentStep("address")}
                  >
                    ← Back to address
                  </button>
                  <button type="button" className="hnl-button" onClick={goToPayment}>
                    Continue to Payment →
                  </button>
                </div>
              </section>
            )}

            {/* STEP 4: Payment Method */}
            {currentStep === "payment" && (
              <section className="hnl-checkout-card">
                <h2>4. Payment Method</h2>
                <p className="hnl-card-sub">
                  Payment options are visual previews only. No payment provider is connected and no transaction will be made.
                </p>

                <div className="hnl-payment-methods">
                  {/* Option 1: Cash on Delivery */}
                  <label
                    className={`hnl-option-card ${paymentMethod === "Cash on Delivery" ? "is-selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={() => setPaymentMethod("Cash on Delivery")}
                    />
                    <div className="hnl-option-content">
                      <div className="hnl-option-title-row">
                        <strong>Cash on Delivery (COD)</strong>
                      </div>
                      <p>Preview selection only; no delivery or cash collection is arranged.</p>
                    </div>
                  </label>

                  {/* Option 2: UPI */}
                  <label
                    className={`hnl-option-card ${paymentMethod === "UPI" ? "is-selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                    />
                    <div className="hnl-option-content">
                      <div className="hnl-option-title-row">
                        <strong>UPI Instant Pay (GPay / PhonePe / Paytm / BHIM)</strong>
                        <span>Fast & Instant</span>
                      </div>
                      <p>Preview only; UPI verification is not connected.</p>
                    </div>
                  </label>

                  {/* Option 3: Card */}
                  <label
                    className={`hnl-option-card ${paymentMethod === "Credit / Debit Card" ? "is-selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="Credit / Debit Card"
                      checked={paymentMethod === "Credit / Debit Card"}
                      onChange={() => setPaymentMethod("Credit / Debit Card")}
                    />
                    <div className="hnl-option-content">
                      <div className="hnl-option-title-row">
                        <strong>Credit / Debit Card</strong>
                        <span>Visa / MasterCard / RuPay</span>
                      </div>
                      <p>Preview only; card processing is not connected and no card details are collected.</p>
                    </div>
                  </label>
                </div>

                <div className="hnl-checkout-nav-row">
                  <button
                    type="button"
                    className="hnl-text-button"
                    onClick={() => setCurrentStep("delivery")}
                  >
                    ← Back to delivery options
                  </button>
                  <button type="button" className="hnl-button" onClick={goToReview}>
                    Review & Confirm Order →
                  </button>
                </div>
              </section>
            )}

            {/* STEP 5: Review & Place Order */}
            {currentStep === "review" && (
              <section className="hnl-checkout-card">
                <h2>5. Review & Confirm Order</h2>
                <p className="hnl-card-sub">
                  Please review your delivery details before placing your order.
                </p>

                <div className="hnl-review-blocks">
                  <div className="hnl-review-block">
                    <h3>Contact & Notification</h3>
                    <p>
                      <strong>{customerName}</strong> ({customerMobile})
                      {customerEmail && <><br />{customerEmail}</>}
                    </p>
                    <button
                      type="button"
                      className="hnl-text-button"
                      onClick={() => setCurrentStep("customer")}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="hnl-review-block">
                    <h3>Delivery Address</h3>
                    {activeShippingAddress ? (
                      <p>
                        {activeShippingAddress.houseFlat}, {activeShippingAddress.street},{" "}
                        {activeShippingAddress.area}, {activeShippingAddress.city},{" "}
                        {activeShippingAddress.state} – {activeShippingAddress.pincode}
                      </p>
                    ) : (
                      <p>No address selected</p>
                    )}
                    <button
                      type="button"
                      className="hnl-text-button"
                      onClick={() => setCurrentStep("address")}
                    >
                      Change
                    </button>
                  </div>

                  <div className="hnl-review-block">
                    <h3>Payment Mode</h3>
                    <p>
                      <strong>{paymentMethod}</strong>
                      {" (not processed in this preview)"}
                    </p>
                    <button
                      type="button"
                      className="hnl-text-button"
                      onClick={() => setCurrentStep("payment")}
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="hnl-checkout-nav-row">
                  <button
                    type="button"
                    className="hnl-text-button"
                    onClick={() => setCurrentStep("payment")}
                  >
                    ← Back to payment
                  </button>

                  <button
                    type="button"
                    className="hnl-button hnl-button--accent hnl-place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? "Saving Preview…" : `Save Preview · ₹${orderTotal + (deliverySpeed === "express" ? 40 : 0)}`}
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Checkout Order Summary Sidebar */}
          <aside className="hnl-checkout-sidebar">
            <div className="hnl-cart-summary-box">
              <div className="hnl-checkout-summary-heading">
                <div>
                  <span className="hnl-eyebrow">YOUR ORDER</span>
                  <h2>Order summary</h2>
                </div>
                <span className="hnl-checkout-item-count">{cartCount} items</span>
              </div>

              <div className="hnl-checkout-items-list">
                {cart.map((line) => (
                  <div
                    key={`${line.productId}-${line.variant}`}
                    className="hnl-checkout-mini-item"
                  >
                    <div className="hnl-mini-thumb">
                      <Image
                        src={line.product.image}
                        alt={line.product.name}
                        width={48}
                        height={48}
                        className="hnl-checkout-item-image"
                      />
                      <span className="hnl-mini-qty">{line.quantity}</span>
                    </div>
                    <div className="hnl-mini-info">
                      <span className="hnl-mini-name">{line.product.name}</span>
                      <span className="hnl-mini-variant">{line.variant}</span>
                    </div>
                    <span className="hnl-mini-price">₹{line.price * line.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="hnl-summary-divider"></div>

              <div className="hnl-summary-row">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>

              {cartSavings > 0 && (
                <div className="hnl-summary-row hnl-coupon-row">
                  <span>
                    Product savings <small>(included in subtotal)</small>
                    <del className="hnl-checkout-original-total">₹{cartOriginalTotal}</del>
                  </span>
                  <span>-₹{cartSavings}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="hnl-summary-row hnl-coupon-row">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              <div className="hnl-summary-row">
                <span>Shipping ({deliverySpeed})</span>
                <span>
                  {deliverySpeed === "express"
                    ? `₹${shippingFee + 40}`
                    : shippingFee === 0
                    ? "FREE"
                    : `₹${shippingFee}`}
                </span>
              </div>

              <div className="hnl-summary-divider"></div>

              <div className="hnl-summary-row hnl-summary-total">
                <span>Grand Total</span>
                <span>
                  ₹{orderTotal + (deliverySpeed === "express" ? 40 : 0)}
                </span>
              </div>

              <div className="hnl-checkout-free-delivery">
                <div className="hnl-free-delivery-copy">
                  {freeShippingRemaining > 0
                    ? <>Add <strong>₹{freeShippingRemaining}</strong> more for free standard delivery.</>
                    : <>Your cart meets the <strong>₹{freeShippingThreshold}</strong> free standard delivery threshold.</>}
                </div>
                <div
                  className="hnl-free-delivery-track"
                  role="progressbar"
                  aria-label="Progress toward free standard delivery"
                  aria-valuemin={0}
                  aria-valuemax={freeShippingThreshold}
                  aria-valuenow={Math.min(cartSubtotal, freeShippingThreshold)}
                >
                  <span style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }} />
                </div>
                <small>Standard delivery preview · threshold from store settings</small>
              </div>

              <div className="hnl-summary-trust-badges">
                <div className="hnl-trust-point">Saved only in this browser</div>
                <div className="hnl-trust-point">No payment or delivery service is connected</div>
              </div>

              <Link href="/shop" className="hnl-checkout-continue-link">← Continue shopping</Link>
            </div>
          </aside>
        </motion.div>
      </div>
    </main>
  );
}
