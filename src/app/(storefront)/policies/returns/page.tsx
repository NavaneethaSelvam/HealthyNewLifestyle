import type { Metadata } from "next";
import { InfoPage } from "@/components/storefront/InfoPage";

export const metadata: Metadata = {
  title: "Returns Information | Healthy New Lifestyle",
  description: "Contact information for questions about returns and refunds.",
};

export default function ReturnsPolicyPage() {
  return (
    <InfoPage
      eyebrow="ORGANICANDNUTRITION · VELLORE"
      title="Returns & Refund Information"
      introduction="Returns and refunds are not processed through this frontend preview. Confirm the current policy with OrganicandNutrition before placing an order."
      imageSrc="/images/policies/returns-policy-banner.jpg"
      imageAlt="A return parcel beside a laptop and phone showing order details"
      currentHref="/policies/returns"
      sections={[
        {
          heading: "Current policy",
          body: "Eligibility, timeframes, replacement options, and refund methods are not connected to this website. Please ask the business to confirm the applicable terms.",
        },
        {
          heading: "Contact",
          body: "Use the Contact page to ask OrganicandNutrition about current returns and refund terms.",
        },
      ]}
    />
  );
}
