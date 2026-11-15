"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { recipes } from "@/features/recipes/recipes-data";

export function RecipesSection() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  return (
    <section className="hnl-section hnl-recipes-section" id="recipes">
      <SectionHeading
        eyebrow="FROM OUR RECIPE COLLECTION"
        title="Fresh ideas for the everyday table."
        description="Explore recipes and cooking ideas from the HealthyNewLifestyle collection."
        titleId="recipes-heading"
      />

      <div className="hnl-recipes-grid">
        {recipes.slice(0, 3).map((item, index) => (
          <motion.article
            className="hnl-recipe-card"
            key={item.id}
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.55,
              delay: reducedMotion ? 0 : index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="hnl-recipe-media">
              <span className="hnl-recipe-time">{item.cookTime}</span>
              <div className="hnl-recipe-image-wrapper">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  className="hnl-recipe-image"
                />
              </div>
            </div>

            <div className="hnl-recipe-body">
              <span className="hnl-recipe-tag">{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <Link className="hnl-text-link" href={`/recipes/${item.id}`}>
                <span>View Recipe</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
