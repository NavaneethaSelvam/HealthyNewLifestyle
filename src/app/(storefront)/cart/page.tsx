import type { Metadata } from "next";
import { CartContents } from "@/features/cart/CartContents";

export const metadata: Metadata = {
  title: "Cart | Healthy New Lifestyle",
  description: "Shopping cart for HealthyNewLifestyle.",
};

export default function CartPage() {
  return <CartContents />;
}
