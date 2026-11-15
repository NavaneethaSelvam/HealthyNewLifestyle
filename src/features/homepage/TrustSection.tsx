"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </svg>
    ),
    title: "Browse the wider pantry",
    description: "Explore grains, pantry staples, oils and more across our current collections.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 3.5h7l4 4V21H7z" />
        <path d="M14 3.5V8h4M10 12h5M10 16h5" />
      </svg>
    ),
    title: "Product details at a glance",
    description: "Check pack options, ingredients, usage and storage on product pages.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.2 8.8c0 4.3-8.2 10-8.2 10s-8.2-5.7-8.2-10a4.25 4.25 0 0 1 8.2-1.5 4.25 4.25 0 0 1 8.2 1.5Z" />
      </svg>
    ),
    title: "Save favourites for later",
    description: "Use your wishlist to keep products together while you browse.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m3 7 9-4 9 4-9 4-9-4Z" />
        <path d="M3 7v10l9 4 9-4V7M12 11v10" />
      </svg>
    ),
    title: "Clear delivery information",
    description: "Review delivery charges and your order total before placing an order.",
  },
];

export function TrustSection() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  return (
    <section
      className="hnl-trust-strip"
      aria-labelledby="hnl-trust-heading"
    >
      <div className="hnl-trust-container">
        <div className="hnl-trust-heading">
          <p className="hnl-eyebrow">WHY HEALTHYNEWLIFESTYLE</p>
          <h2 id="hnl-trust-heading">A clearer way to shop the pantry.</h2>
        </div>
        <div className="hnl-trust-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              className="hnl-trust-card"
              key={benefit.title}
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: reducedMotion ? 0.01 : 0.45,
                delay: reducedMotion ? 0 : index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="hnl-trust-icon" aria-hidden="true">
                {benefit.icon}
              </div>
              <div className="hnl-trust-copy">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
