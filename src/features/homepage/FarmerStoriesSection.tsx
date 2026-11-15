import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/features/homepage/ScrollReveal";

export function FarmerStoriesSection() {
  return (
    <ScrollReveal className="hnl-farmer-stories-reveal">
      <section
        className="hnl-section hnl-farmer-stories"
        aria-labelledby="farmer-stories-heading"
      >
        <div className="hnl-farmer-feature">
          <div className="hnl-farmer-feature-image">
            <Image
              src="/images/farmers/farmer-2.jpg"
              alt="A farmer tending millet crops in a green field"
              fill
              sizes="(max-width: 760px) 100vw, 52vw"
            />
            <span>Farming communities · Tamil Nadu</span>
          </div>
          <div className="hnl-farmer-feature-copy">
            <SectionHeading
              eyebrow="FROM OUR FARMS TO YOUR FAMILY"
              title="Know Your Farmers"
              description="HealthyNewLifestyle highlights regional ingredients and farming families across Tamil Nadu. Product pages share the origin and sourcing information currently available for each item."
              titleId="farmer-stories-heading"
            />
            <p className="hnl-farmer-feature-note">
              Individual farmer names and farm locations are not published
              unless verified information is available.
            </p>
            <Link className="hnl-button" href="/sourcing">
              <span>Know Your Farmers</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
