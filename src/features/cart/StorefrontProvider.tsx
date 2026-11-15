"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Product, Coupon, Address, CustomerProfile, ToastMessage } from "@/types/storefront";
import { getProductById, getProductBySlug } from "@/features/catalog/products-data";
import { getStorageItem, setStorageItem, clearAllStorefrontData, STORAGE_KEYS } from "@/services/storage";
import { validateCoupon } from "@/services/couponService";
import {
  DEFAULT_CUSTOMER,
  getCustomerProfile,
  updateCustomerProfile,
  getAddresses,
  addAddress as svcAddAddress,
  updateAddress as svcUpdateAddress,
  deleteAddress as svcDeleteAddress,
  setDefaultAddress as svcSetDefaultAddress,
} from "@/services/customerService";

export interface CartLine {
  productId: string;
  variant: string;
  quantity: number;
  price: number;
  originalPrice: number;
  product: Product;
}

interface StoredCartItem {
  productId: string;
  variant: string;
  quantity: number;
}

export interface StorefrontContextValue {
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  cartOriginalTotal: number;
  cartSavings: number;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  orderTotal: number;
  wishlist: string[];
  wishlistCount: number;
  storageWarning: string;
  hydrated: boolean;

  // Cart actions
  addToCart: (productId: string, quantity?: number, variant?: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  removeFromCart: (productId: string, variant: string) => void;
  clearCart: () => void;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;

  // Coupon actions
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // User & Address
  user: CustomerProfile;
  updateProfile: (updates: Partial<CustomerProfile>) => void;
  clearProfile: () => void;
  addresses: Address[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  addNewAddress: (address: Omit<Address, "id">) => Address;
  editAddress: (id: string, updates: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddressId: (id: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id"> | string) => void;
  removeToast: (id: string) => void;

  // Quick View
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Demo reset
  resetAllDemoData: () => void;
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 60;

function resolveCartLine(item: StoredCartItem): CartLine | null {
  const product = getProductById(item.productId) || getProductBySlug(item.productId);
  if (!product) return null;

  const matchedVariant =
    product.variants.find((v) => v.name === item.variant || v.weight === item.variant) ||
    product.variants[0];

  const price = matchedVariant ? matchedVariant.price : product.price;
  const originalPrice = matchedVariant ? matchedVariant.originalPrice : product.originalPrice;

  return {
    productId: product.id,
    variant: matchedVariant ? matchedVariant.name : (item.variant || "Standard"),
    quantity: Math.max(1, item.quantity),
    price,
    originalPrice,
    product,
  };
}

const emptySubscribe = () => () => {};

export function StorefrontProvider({ children }: { children: ReactNode }) {
  // `hydrated` is false during SSR and the first synchronous client render,
  // then flips to true after the browser has taken over. We use this to ensure
  // the initial render tree is identical on server and client (no mismatch).
  const hydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [storageWarning] = useState("");

  const [rawCart, setRawCart] = useState<StoredCartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [user, setUser] = useState<CustomerProfile>(DEFAULT_CUSTOMER);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!hydrated) return;

    const hydrationTimer = window.setTimeout(() => {
      const storedCart = getStorageItem<StoredCartItem[]>(STORAGE_KEYS.CART, []);
      const storedWishlist = getStorageItem<string[]>(STORAGE_KEYS.WISHLIST, []);
      const storedAddresses = getAddresses();
      const isLegacySampleCart =
        Array.isArray(storedCart) &&
        storedCart.length === 2 &&
        storedCart.some(
          (item) =>
            item.productId === "traditional-black-rice-karuppu-kavuni" &&
            item.variant === "1 kg" &&
            item.quantity === 1,
        ) &&
        storedCart.some(
          (item) =>
            item.productId === "wood-pressed-sesame-oil" &&
            item.variant === "1 Litre" &&
            item.quantity === 1,
        );
      const initialCart =
        isLegacySampleCart || !Array.isArray(storedCart) ? [] : storedCart;

      setRawCart(initialCart);
      if (isLegacySampleCart) setStorageItem(STORAGE_KEYS.CART, []);
      setWishlist(Array.isArray(storedWishlist) ? storedWishlist : []);
      setAppliedCoupon(getStorageItem<Coupon | null>(STORAGE_KEYS.COUPONS, null));
      setUser(getCustomerProfile());
      setAddresses(storedAddresses);
      setSelectedAddressId(
        storedAddresses.find((address) => address.isDefault)?.id ??
          storedAddresses[0]?.id ??
          "",
      );
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, [hydrated]);

  // Hydrate CartLines with full Product objects
  const cart: CartLine[] = rawCart
    .map(resolveCartLine)
    .filter((line): line is CartLine => line !== null);

  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);
  const cartSubtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const cartOriginalTotal = cart.reduce(
    (sum, line) => sum + line.originalPrice * line.quantity,
    0
  );
  const cartSavings = Math.max(0, cartOriginalTotal - cartSubtotal);

  // Coupon calculations
  let couponDiscount = 0;
  if (appliedCoupon && cartSubtotal > 0) {
    const validation = validateCoupon(appliedCoupon.code, cartSubtotal);
    if (validation.valid) {
      couponDiscount = validation.discountAmount;
    } else {
      setAppliedCoupon(null);
      setStorageItem(STORAGE_KEYS.COUPONS, null);
    }
  }

  // Shipping logic: free if cart >= 999 or coupon is FREESHIP or cart is empty
  const isFreeShipping =
    cart.length === 0 ||
    cartSubtotal >= FREE_SHIPPING_THRESHOLD ||
    (appliedCoupon && appliedCoupon.discountType === "free_shipping");

  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const orderTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  // Toast dispatcher
  const addToast = useCallback((toast: Omit<ToastMessage, "id"> | string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage =
      typeof toast === "string"
        ? { id, type: "success", message: toast }
        : { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Persist raw cart helper
  const persistCart = (updated: StoredCartItem[]) => {
    setRawCart(updated);
    setStorageItem(STORAGE_KEYS.CART, updated);
  };

  // Cart actions
  const addToCart = (productId: string, quantity = 1, variant?: string) => {
    const prod = getProductById(productId) || getProductBySlug(productId);
    const chosenVariant = variant || (prod?.variants[0]?.name ?? "Standard");

    const existingIndex = rawCart.findIndex(
      (line) => line.productId === productId && line.variant === chosenVariant
    );

    let updatedCart: StoredCartItem[];
    if (existingIndex > -1) {
      updatedCart = rawCart.map((line, idx) =>
        idx === existingIndex ? { ...line, quantity: line.quantity + quantity } : line
      );
    } else {
      updatedCart = [...rawCart, { productId, variant: chosenVariant, quantity }];
    }

    persistCart(updatedCart);
    const title = prod ? prod.name : "Product";
    addToast({
      type: "success",
      title: "Added to Cart",
      message: `${quantity}× ${title} (${chosenVariant}) added.`,
    });
  };

  const updateQuantity = (productId: string, variant: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    const updated = rawCart.map((line) =>
      line.productId === productId && line.variant === variant
        ? { ...line, quantity }
        : line
    );
    persistCart(updated);
  };

  const removeFromCart = (productId: string, variant: string) => {
    const updated = rawCart.filter(
      (line) => !(line.productId === productId && line.variant === variant)
    );
    persistCart(updated);
    addToast({
      type: "info",
      message: "Item removed from cart.",
    });
  };

  const clearCart = () => {
    persistCart([]);
    setAppliedCoupon(null);
    setStorageItem(STORAGE_KEYS.COUPONS, null);
    addToast({
      type: "info",
      message: "Your shopping cart was cleared.",
    });
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    const prod = getProductById(productId) || getProductBySlug(productId);
    const title = prod ? prod.name : "Product";

    setWishlist((prev) => {
      let next: string[];
      if (prev.includes(productId)) {
        next = prev.filter((id) => id !== productId);
        addToast({ type: "info", message: `Removed ${title} from wishlist.` });
      } else {
        next = [...prev, productId];
        addToast({
          type: "success",
          title: "Saved to Wishlist",
          message: `${title} added to your wishlist.`,
        });
      }
      setStorageItem(STORAGE_KEYS.WISHLIST, next);
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.filter((id) => id !== productId);
      setStorageItem(STORAGE_KEYS.WISHLIST, next);
      return next;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    setStorageItem(STORAGE_KEYS.WISHLIST, []);
    addToast({ type: "info", message: "Wishlist cleared." });
  };

  // Coupon actions
  const applyCoupon = (code: string) => {
    const validation = validateCoupon(code, cartSubtotal);
    if (!validation.valid || !validation.coupon) {
      return { success: false, message: validation.error || "Invalid coupon" };
    }
    setAppliedCoupon(validation.coupon);
    setStorageItem(STORAGE_KEYS.COUPONS, validation.coupon);
    addToast({
      type: "success",
      title: "Coupon Applied!",
      message: `Code ${validation.coupon.code} applied. You saved ₹${validation.discountAmount}!`,
    });
    return { success: true, message: `Applied coupon ${validation.coupon.code}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setStorageItem(STORAGE_KEYS.COUPONS, null);
    addToast({ type: "info", message: "Coupon removed." });
  };

  // Customer & Address
  const updateProfile = (updates: Partial<CustomerProfile>) => {
    const updated = updateCustomerProfile(updates);
    setUser(updated);
    addToast({ type: "success", message: "Profile updated successfully." });
  };

  const clearProfile = () => {
    const cleared = updateCustomerProfile(DEFAULT_CUSTOMER);
    setUser(cleared);
    addToast({
      type: "info",
      title: "Local profile cleared",
      message: "You are signed out on this device. Your cart and wishlist were kept.",
    });
  };

  const addNewAddress = (addr: Omit<Address, "id">): Address => {
    const newAddr = svcAddAddress(addr);
    const updated = getAddresses();
    setAddresses(updated);
    if (newAddr.isDefault) setSelectedAddressId(newAddr.id);
    addToast({ type: "success", message: "New address added." });
    return newAddr;
  };

  const editAddress = (id: string, updates: Partial<Address>) => {
    svcUpdateAddress(id, updates);
    const updated = getAddresses();
    setAddresses(updated);
    addToast({ type: "success", message: "Address updated." });
  };

  const removeAddress = (id: string) => {
    svcDeleteAddress(id);
    const updated = getAddresses();
    setAddresses(updated);
    if (selectedAddressId === id && updated.length > 0) {
      setSelectedAddressId(updated[0].id);
    }
    addToast({ type: "info", message: "Address removed." });
  };

  const setDefaultAddressId = (id: string) => {
    svcSetDefaultAddress(id);
    const updated = getAddresses();
    setAddresses(updated);
    setSelectedAddressId(id);
    addToast({ type: "success", message: "Default delivery address updated." });
  };

  // Reset demo
  const resetAllDemoData = () => {
    clearAllStorefrontData();
    persistCart([]);
    setWishlist([]);
    setAppliedCoupon(null);
    setUser(getCustomerProfile());
    const addrs = getAddresses();
    setAddresses(addrs);
    setSelectedAddressId(addrs.find((address) => address.isDefault)?.id ?? addrs[0]?.id ?? "");
    addToast({
      type: "success",
      title: "Local storefront data cleared",
      message: "Your local cart, wishlist and profile data have been reset.",
    });
  };

  const value: StorefrontContextValue = {
    cart,
    cartCount,
    cartSubtotal,
    cartOriginalTotal,
    cartSavings,
    appliedCoupon,
    couponDiscount,
    shippingFee,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    freeShippingRemaining,
    orderTotal,
    wishlist,
    wishlistCount: wishlist.length,
    storageWarning,
    hydrated,

    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,

    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    clearWishlist,

    applyCoupon,
    removeCoupon,

    user,
    updateProfile,
    clearProfile,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addNewAddress,
    editAddress,
    removeAddress,
    setDefaultAddressId,

    toasts,
    addToast,
    removeToast,

    quickViewProduct,
    openQuickView: setQuickViewProduct,
    closeQuickView: () => setQuickViewProduct(null),

    resetAllDemoData,
  };

  return (
    <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>
  );
}

export function useStorefront(): StorefrontContextValue {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error("useStorefront must be used within StorefrontProvider");
  }
  return context;
}
