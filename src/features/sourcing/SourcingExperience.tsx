"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const farmingValues = [
  {
    title: "Regional ingredients",
    description:
      "Explore product pages for the origin details available for each item.",
  },
  {
    title: "Traditional food knowledge",
    description:
      "Preparation and storage suggestions are listed with products where provided.",
  },
  {
    title: "Questions welcome",
    description:
      "Contact OrganicandNutrition in Vellore for current sourcing information.",
  },
];

const farmJourney = [
  "Farmer",
  "Growing",
  "Harvest",
  "Quality Selection & Packing",
  "Your Home",
];

const partnerFarmers = [
  { name: "Arulkumar", image: "farmer-arulkumar.jpg" },
  { name: "Deiva Shanmugam", image: "farmer-deiva-shanmugam.jpg" },
  { name: "Desur Bala", image: "farmer-desur-bala.jpg" },
  { name: "Mahesh Patidar", image: "farmer-mahesh-patidar.jpg" },
  { name: "Nagarathinam", image: "farmer-nagarathinam.jpg" },
  { name: "Pon Adithan", image: "farmer-pon-adithan.jpg" },
  { name: "Prabhakaran", image: "farmer-prabhakaran.jpg" },
  { name: "Rechana", image: "farmer-rechana.jpg" },
  { name: "Senthilkumar", image: "farmer-senthilkumar.jpg" },
  { name: "Showkat", image: "farmer-showkat.jpg" },
  { name: "Thangavelu", image: "farmer-thangavelu.jpg" },
  { name: "Vijayan", image: "farmer-vijayan.jpg" },
];

const crystalPositions = ["top", "left", "right", "bottom"] as const;

export function SourcingExperience() {
  return (
    <main className="hnl-page hnl-sourcing-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Know your farmers</span>
        </nav>

        <section className="hnl-sourcing-hero" aria-labelledby="sourcing-title">
          <motion.div
            className="hnl-sourcing-hero-copy"
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.72, ease: "easeOut" }}
          >
            <span className="hnl-eyebrow">REGIONAL SOURCING · TAMIL NADU</span>
            <h1 id="sourcing-title">Know Your Farmers</h1>
            <p className="hnl-sourcing-hero-subtitle">
              The People Behind Every Harvest
            </p>
            <p className="hnl-sourcing-hero-description">
              HealthyNewLifestyle highlights regional ingredients and farming
              families across Tamil Nadu. Product pages contain the origin and
              sourcing information currently available for each item.
            </p>
            <div className="hnl-sourcing-hero-actions">
              <Link className="hnl-button" href="/shop">
                Explore Shop All <span aria-hidden="true">→</span>
              </Link>
              <Link className="hnl-sourcing-secondary-link" href="#partner-farmers">
                Our sourcing approach <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </motion.div>

          <div
            className="hnl-sourcing-crystal"
            role="group"
            aria-label="Portraits of partner farmers"
          >
            <svg
              className="hnl-sourcing-landscape"
              viewBox="0 0 520 520"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="260" cy="260" r="220" fill="#E9EDDF" />
              <circle
                cx="260"
                cy="260"
                r="196"
                stroke="#BFCBB5"
                strokeDasharray="2 9"
                strokeWidth="1.5"
              />
              <circle cx="402" cy="111" r="25" fill="#E7C78E" opacity=".78" />
              <path
                d="M26 344C105 291 169 292 245 335s148 55 249-10"
                stroke="#A8B99D"
                strokeWidth="2"
                opacity=".72"
              />
              <path
                d="M20 375c93-52 167-44 245 0s146 42 238-4M36 407c82-39 152-29 227 9s145 33 218 1"
                stroke="#B7C5AC"
                strokeWidth="1.5"
                opacity=".55"
              />
              <path
                d="M70 154c56-39 109-36 157-8 43 26 88 30 134 8"
                stroke="#C1CCB8"
                strokeWidth="1.5"
                opacity=".58"
              />
            </svg>
            <span
              className="hnl-sourcing-leaf hnl-sourcing-leaf--one"
              aria-hidden="true"
            />
            <span
              className="hnl-sourcing-leaf hnl-sourcing-leaf--two"
              aria-hidden="true"
            />
            <span
              className="hnl-sourcing-leaf hnl-sourcing-leaf--three"
              aria-hidden="true"
            />
            {partnerFarmers.slice(0, 4).map((farmer, index) => {
              const position = crystalPositions[index];

              return (
                <motion.figure
                  className={`hnl-sourcing-crystal-tile hnl-sourcing-crystal-tile--${position}`}
                  key={farmer.name}
                  initial={{ opacity: 0, y: position === "bottom" ? 22 : 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.72,
                    delay: 0.12 + index * 0.14,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.04, rotate: 1 }}
                >
                  <div
                    className={`hnl-sourcing-crystal-float hnl-sourcing-crystal-float--${position}`}
                  >
                    <div className="hnl-sourcing-crystal-frame">
                      <Image
                        src={`/images/farmers/${farmer.image}`}
                        alt={`Portrait of ${farmer.name}`}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 760px) 30vw, (max-width: 1000px) 16vw, 180px"
                      />
                    </div>
                  </div>
                </motion.figure>
              );
            })}
          </div>
        </section>

        <motion.section
          className="hnl-sourcing-profiles"
          id="partner-farmers"
          aria-labelledby="partner-farmers-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.68, ease: "easeOut" }}
        >
          <div className="hnl-sourcing-section-heading hnl-sourcing-profiles-heading">
            <div>
              <p className="hnl-eyebrow">FARMER STORIES</p>
              <h2 id="partner-farmers-heading">Our Partner Farmers</h2>
            </div>
            <span className="hnl-farmer-profile-count">
              {partnerFarmers.length} farmer portraits
            </span>
          </div>
          <div className="hnl-sourcing-profile-note">
            <p>
              These names come from the available image filenames. Verified
              locations, farming specialties, and biographies are not present
              in the project records, so those details are marked as
              unavailable rather than guessed.
            </p>
            <Link className="hnl-text-link" href="/contact">
              Ask about sourcing <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="hnl-farmer-profile-grid">
            {partnerFarmers.map((farmer, index) => (
              <motion.article
                className="hnl-farmer-profile-card"
                key={farmer.name}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.06,
                  ease: "easeOut",
                }}
              >
                <div className="hnl-farmer-profile-image">
                  <Image
                    src={`/images/farmers/${farmer.image}`}
                    alt={`${farmer.name} farmer portrait`}
                    fill
                    sizes="(max-width: 760px) 46vw, (max-width: 1000px) 30vw, 23vw"
                  />
                </div>
                <span className="hnl-farmer-profile-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="hnl-farmer-profile-overlay">
                  <h3>{farmer.name}</h3>
                  <dl className="hnl-farmer-profile-facts">
                    <div>
                      <dt>Location</dt>
                      <dd>Not provided</dd>
                    </div>
                    <div>
                      <dt>Specialty</dt>
                      <dd>Not provided</dd>
                    </div>
                  </dl>
                  <div className="hnl-farmer-profile-reveal">
                    <details className="hnl-farmer-profile-story">
                      <summary>
                        Read Their Story <span aria-hidden="true">→</span>
                      </summary>
                      <p>
                        Story details are not yet available. Contact us for
                        current sourcing information.
                      </p>
                      <Link href="/contact">Ask about sourcing</Link>
                    </details>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="hnl-sourcing-journey"
          aria-labelledby="farm-journey-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.68, ease: "easeOut" }}
        >
          <div className="hnl-sourcing-section-heading">
            <p className="hnl-eyebrow">FROM FIELD TO FAMILY</p>
            <h2 id="farm-journey-heading">The Farm-to-Home Journey</h2>
          </div>
          <ol className="hnl-sourcing-journey-list">
            {farmJourney.map((stage, index) => (
              <li key={stage}>
                <span className="hnl-sourcing-journey-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="hnl-sourcing-journey-stage">{stage}</span>
              </li>
            ))}
          </ol>
        </motion.section>

        <section
          className="hnl-sourcing-values"
          aria-labelledby="sourcing-values-heading"
        >
          <motion.div
            className="hnl-sourcing-values-intro"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.68, ease: "easeOut" }}
          >
            <div className="hnl-sourcing-section-heading">
              <p className="hnl-eyebrow">OUR APPROACH</p>
              <h2 id="sourcing-values-heading">Our Farming Values</h2>
            </div>
            <p className="hnl-sourcing-values-description">
              Sourcing with clear product information.
            </p>
          </motion.div>
          <div className="hnl-sourcing-values-list">
            {farmingValues.map((value, index) => (
              <motion.article
                className="hnl-sourcing-value-card"
                key={value.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <span className="hnl-sourcing-value-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="hnl-sourcing-value-copy">
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
                <span
                  className="hnl-sourcing-value-sprig"
                  aria-hidden="true"
                />
              </motion.article>
            ))}
          </div>
        </section>

        <motion.section
          className="hnl-sourcing-cta"
          aria-labelledby="sourcing-cta-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.68, ease: "easeOut" }}
        >
          <p className="hnl-eyebrow">ORGANICANDNUTRITION · VELLORE</p>
          <h2 id="sourcing-cta-heading">
            Discover traditional ingredients for your home.
          </h2>
          <Link className="hnl-button" href="/shop">
            Explore Shop All <span aria-hidden="true">→</span>
          </Link>
        </motion.section>

        <div className="hnl-sourcing-contact">
          <p className="hnl-eyebrow">ORGANICANDNUTRITION · VELLORE</p>
          <p>Building No. 24, Ashok Biller, Vellore</p>
          <a className="hnl-text-link" href="tel:6381243416">
            6381243416
          </a>
        </div>
      </div>
    </main>
  );
}
