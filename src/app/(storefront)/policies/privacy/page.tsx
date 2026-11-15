import type { Metadata } from "next";
import { InfoPage } from "@/components/storefront/InfoPage";

export const metadata: Metadata = {
  title: "Privacy policy | Healthy New Lifestyle",
  description: "Information about locally stored data in the HealthyNewLifestyle frontend preview.",
};

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      eyebrow="OrganicandNutrition"
      title="Privacy policy"
      introduction="This frontend preview stores selected storefront data in your browser. It is not connected to an account, order-processing, or payment backend."
      imageSrc="/images/policies/privacy-policy-banner.jpg"
      imageAlt="Privacy Policy banner on a forest-green background"
      imageFit="contain"
      currentHref="/policies/privacy"
      sections={[
        {
          heading: "Data stored in this browser",
          body: "Cart, wishlist, profile, address, and saved checkout-preview information may be saved in browser local storage. Do not enter sensitive payment details.",
        },
        {
          heading: "Clear local data",
          body: "Use the Clear Local Data control on the account page to remove locally stored storefront information from this browser.",
        },
        {
          heading: "Questions",
          body: "For questions about the business's production privacy practices, contact OrganicandNutrition before sharing personal information.",
        },
      ]}
    />
  );
}
