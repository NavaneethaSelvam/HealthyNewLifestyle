"use client";

export const STORAGE_KEYS = {
  CART: "hnl-cart",
  WISHLIST: "hnl-wishlist",
  USER: "hnl-user",
  ADDRESSES: "hnl-addresses",
  ORDERS: "hnl-orders",
  RECENTLY_VIEWED: "hnl-recently-viewed",
  COUPONS: "hnl-coupons",
  REVIEWS: "hnl-reviews",
  PREFERENCES: "hnl-preferences",
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getStorageItem<T>(key: StorageKey, defaultValue: T): T {
  if (!isClient()) return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: StorageKey, value: T): void {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event for cross-component synchronisation
    window.dispatchEvent(
      new CustomEvent("hnl-storage-change", {
        detail: { key, value },
      })
    );
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
  }
}

export function removeStorageItem(key: StorageKey): void {
  if (!isClient()) return;
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(
      new CustomEvent("hnl-storage-change", {
        detail: { key, value: null },
      })
    );
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
}

export function clearAllStorefrontData(): void {
  if (!isClient()) return;
  Object.values(STORAGE_KEYS).forEach((k) => {
    try {
      window.localStorage.removeItem(k);
    } catch {}
  });
  window.dispatchEvent(new CustomEvent("hnl-storage-reset"));
}
