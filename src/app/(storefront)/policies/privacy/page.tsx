import type { Metadata } from "next";
import { InfoPage } from "@/components/storefront/InfoPage";

export const metadata: Metadata = {
  title: "Privacy policy | Healthy New Lifestyle",
  description: "Information about local storefront data and configured customer-form submissions.",
};

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      eyebrow="OrganicandNutrition"
      title="Privacy policy"
      introduction="Selected storefront data is stored in this browser. When the customer-forms service is configured, submitted contact, newsletter, and product-review details are sent to the business's Google Sheets service."
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
          heading: "Customer form submissions",
          body: "When the optional forms service is configured, contact enquiries, consented newsletter requests, and product reviews are forwarded to a Google Sheet controlled by OrganicandNutrition. Contact enquiries and reviews also trigger an email notification to the address configured by the business. Newsletter requests are recorded for the team; updates are not sent automatically. These submissions are not saved in this browser's local storage.",
        },
        {
          heading: "Questions",
          body: "For questions about the business's production privacy practices, contact OrganicandNutrition before sharing personal information.",
        },
      ]}
    />
  );
}
