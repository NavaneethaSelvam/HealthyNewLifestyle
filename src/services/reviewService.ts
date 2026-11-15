import { ProductReview } from "@/types/storefront";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "./storage";

export function getAllReviews(): ProductReview[] {
  const stored = getStorageItem<ProductReview[]>(STORAGE_KEYS.REVIEWS, []);
  if (!Array.isArray(stored)) return [];

  const reviews = stored.filter((review) => !/^rev_0[1-5]$/.test(review.id));
  if (reviews.length !== stored.length) setStorageItem(STORAGE_KEYS.REVIEWS, reviews);
  return reviews;
}

export function getReviewsForProduct(productId: string): ProductReview[] {
  const all = getAllReviews();
  return all.filter((r) => r.productId === productId);
}

export function addReview(
  reviewData: Omit<ProductReview, "id" | "date" | "verifiedPurchase">
): ProductReview {
  const all = getAllReviews();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const newReview: ProductReview = {
    ...reviewData,
    id: `rev_${Date.now()}`,
    date: dateStr,
    verifiedPurchase: false,
  };

  const updated = [newReview, ...all];
  setStorageItem(STORAGE_KEYS.REVIEWS, updated);
  return newReview;
}
