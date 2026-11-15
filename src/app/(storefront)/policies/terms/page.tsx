import type { Metadata } from "next";
import { InfoPage } from "@/components/storefront/InfoPage";

export const metadata: Metadata = {
  title: "Terms and conditions | Healthy New Lifestyle",
  description: "Terms and conditions enquiries for HealthyNewLifestyle.",
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="OrganicandNutrition"
      title="Terms and conditions"
      introduction="This website currently provides a storefront frontend preview, not a connected ordering service. No order or payment is submitted through the preview."
      imageSrc="/images/policies/terms-policy-banner.jpg"
      imageAlt="Botanical ingredients and natural cream jars arranged on a warm surface"
      imagePosition="center 65%"
      currentHref="/policies/terms"
      sections={[
        {
          heading: "Catalog and preview pricing",
          body: "Product details and any checkout totals shown here are for preview purposes and must be confirmed by OrganicandNutrition before a purchase.",
        },
        {
          heading: "Orders and payments",
          body: "Saving a checkout preview does not create an order, charge a payment method, reserve stock, or arrange delivery.",
        },
        {
          heading: "Contact",
          body: "Contact OrganicandNutrition to confirm current business terms before ordering.",
        },
      ]}
    />
  );
}
