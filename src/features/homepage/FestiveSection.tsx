"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface FestiveCard {
  id: string;
  title: string;
  image: string;
  alt: string;
  description: string;
  buttonText: string;
  href: string;
  tag: string;
}

const festiveCards: FestiveCard[] = [
  {
    id: "pongal",
    title: "Pongal Celebrations",
    image: "/images/festivals/pongal.jpg",
    alt: "Traditional Tamil Pongal celebration with decorated Pongal pot, sugarcane, turmeric and rice",
    description: "Celebrate the harvest with authentic traditional goodness.",
    buttonText: "Explore Pongal Essentials",
    href: "/categories/traditional-rice",
    tag: "Harvest Tradition",
  },
  {
    id: "diwali",
    title: "Diwali Celebrations",
    image: "/images/festivals/diwali.jpg",
    alt: "Traditional Indian Diwali decorations, diyas, homemade sweets and festive food",
    description: "Make every festive moment sweeter with wholesome favourites.",
    buttonText: "Explore Festive Favourites",
    href: "/categories/natural-sweeteners",
    tag: "Festival of Lights",
  },
  {
    id: "tamil-new-year",
    title: "Tamil New Year",
    image: "/images/festivals/tamil-new-year.jpg",
    alt: "Traditional Tamil New Year festive food arrangement with mango, neem flowers, fruits and traditional ingredients",
    description: "Welcome new beginnings with nature-inspired goodness.",
    buttonText: "Discover More",
    href: "/categories/millets",
    tag: "Auspicious Beginnings",
  },
];

export function FestiveSection() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  return (
    <section className="hnl-section hnl-festive-section" id="festive">
      <SectionHeading
        eyebrow="CELEBRATE THE GOODNESS"
        title="Every Celebration Begins with Good Food."
        description="Bring home traditional flavours and wholesome goodness for every special occasion."
        titleId="festive-heading"
      />

      <div className="hnl-festive-grid">
        {festiveCards.map((card, index) => (
          <motion.article
            className="hnl-festive-card"
            key={card.id}
            initial={reducedMotion ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.6,
              delay: reducedMotion ? 0 : index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="hnl-festive-card-media">
              <span className="hnl-festive-badge">{card.tag}</span>
              <div className="hnl-festive-image-wrapper">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  className="hnl-festive-image"
                />
              </div>
              <div className="hnl-festive-card-overlay" aria-hidden="true" />
            </div>

            <div className="hnl-festive-card-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link className="hnl-button hnl-festive-button" href={card.href}>
                <span>{card.buttonText}</span>
                <span className="hnl-button-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
