"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const promises = [
  {
    number: "01",
    title: "Traditional Ingredients",
    description:
      "Explore traditional rice, millets and pantry ingredients listed in our catalog.",
  },
  {
    number: "02",
    title: "Ingredient Information",
    description:
      "Product pages share the ingredient and storage information available for each item.",
  },
  {
    number: "03",
    title: "Regional Sourcing",
    description:
      "Our sourcing stories focus on farming families and regional ingredients from Tamil Nadu.",
  },
  {
    number: "04",
    title: "Rooted in Vellore",
    description:
      "HealthyNewLifestyle is the customer-facing brand of OrganicandNutrition, based in Vellore.",
  },
];

export function BrandPromiseSection() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  return (
    <section className="hnl-section hnl-promise-section" id="our-promise">
      <div className="hnl-promise-container">
        <div className="hnl-promise-header">
          <SectionHeading
            eyebrow="WHY CHOOSE US"
            title="The OrganicandNutrition Approach."
            description="Discover traditional food, regional sourcing information and product details from OrganicandNutrition."
            titleId="promise-heading"
          />
        </div>

        <div className="hnl-promise-grid">
          {promises.map((promise, index) => (
            <motion.div
              className="hnl-promise-card"
              key={promise.number}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: reducedMotion ? 0.01 : 0.5,
                delay: reducedMotion ? 0 : index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="hnl-promise-number">{promise.number}</span>
              <h3>{promise.title}</h3>
              <p>{promise.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="hnl-promise-footer">
          <Link className="hnl-button" href="/sourcing">
            <span>Explore sourcing information</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
