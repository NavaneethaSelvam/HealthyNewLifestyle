import type { Metadata } from "next";
import { InfoPage } from "@/components/storefront/InfoPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Healthy New Lifestyle",
  description: "Shipping information for the HealthyNewLifestyle frontend preview.",
};

export default function ShippingPolicyPage() {
  return (
    <InfoPage
      eyebrow="ORGANICANDNUTRITION · VELLORE"
      title="Shipping & Delivery Information"
      introduction="This website currently provides a frontend checkout preview. It does not submit orders or connect to a delivery service."
      imageSrc="/images/policies/shipping-policy-banner.jpg"
      imageAlt="A shopper unpacking fresh groceries at home"
      imagePosition="65% center"
      currentHref="/policies/shipping"
      sections={[
        {
          heading: "Delivery availability",
          body: "Delivery areas, methods, rates, and timelines are not available through this preview. Contact OrganicandNutrition to confirm current arrangements.",
        },
        {
          heading: "Charges",
          body: "Any charges shown in the checkout preview are illustrative and are not a quote or confirmed delivery fee.",
        },
        {
          heading: "Tracking",
          body: "Live shipment tracking is not connected. Local order previews do not create a shipment or tracking number.",
        },
      ]}
    />
  );
}
