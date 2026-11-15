import type { Metadata } from "next";
import { AboutPageContent } from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About | Healthy New Lifestyle",
  description: "About the HealthyNewLifestyle brand.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
