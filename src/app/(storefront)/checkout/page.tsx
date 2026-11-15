import type { Metadata } from "next";
import { CheckoutForm } from "@/features/cart/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | Healthy New Lifestyle",
  description: "Checkout for HealthyNewLifestyle.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
