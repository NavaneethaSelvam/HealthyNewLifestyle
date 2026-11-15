import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/features/homepage/ScrollReveal";

export function BrandStorySection() {
  return (
    <ScrollReveal className="hnl-home-reveal">
      <section className="hnl-home-story" id="story" aria-labelledby="story-heading">
        <div className="hnl-home-story-image">
          <Image
            src="/images/farmers/farmer-2.jpg"
            alt="A farmer harvesting in a field"
            fill
            sizes="(max-width: 760px) 100vw, 52vw"
          />
          <span className="hnl-home-story-image-caption">
            A glimpse of farming and harvest
          </span>
        </div>
        <div className="hnl-home-story-copy">
          <p className="hnl-eyebrow">MEET THE BRAND</p>
          <h2 id="story-heading">Everyday food, with a story worth discovering.</h2>
          <p className="hnl-home-company">
            HealthyNewLifestyle <span>by OrganicandNutrition · Vellore</span>
          </p>
          <p>
            HealthyNewLifestyle is the customer-facing brand of OrganicandNutrition. Explore traditional ingredients in the catalog and review the product and sourcing information available for each item.
          </p>
          <Link className="hnl-button" href="/about">
            <span>Know our story</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </ScrollReveal>
  );
}
