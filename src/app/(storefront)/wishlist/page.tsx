import type { Metadata } from "next";
import { CartContents } from "@/features/cart/CartContents";

export const metadata: Metadata = {
  title: "Wishlist | Healthy New Lifestyle",
  description: "Saved items for HealthyNewLifestyle.",
};

export default function WishlistPage() {
  return <CartContents wishlistOnly />;
}
