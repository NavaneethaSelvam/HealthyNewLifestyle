import type { Metadata } from "next";
import { SourcingExperience } from "@/features/sourcing/SourcingExperience";

export const metadata: Metadata = {
  title: "Farmer & sourcing story | Healthy New Lifestyle",
  description: "Regional sourcing information and farmer imagery from HealthyNewLifestyle.",
};

export default function SourcingPage() {
  return <SourcingExperience />;
}
