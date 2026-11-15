"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, delay: reduceMotion ? 0 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AboutImage({
  src,
  alt,
  className = "",
  caption,
  priority = false,
  sizes = "(max-width: 700px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.figure
      className={`hnl-about-image ${className}`}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="hnl-about-image-element"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </motion.figure>
  );
}

const ingredientImages = [
  {
    src: "/images/about/about-traditional-rice.jpg",
    alt: "A selection of traditional rice varieties.",
    label: "Traditional rice",
    className: "hnl-about-mosaic-rice",
  },
  {
    src: "/images/about/bout-natural-grains.jpg",
    alt: "Different grains arranged in a wooden tray.",
    label: "Natural grains",
    className: "hnl-about-mosaic-grains",
  },
  {
    src: "/images/about/about-pulses-lentils.jpg",
    alt: "Bowls of assorted pulses and lentils.",
    label: "Pulses & lentils",
    className: "hnl-about-mosaic-pulses",
  },
  {
    src: "/images/about/bout-spice-ingredients.jpg",
    alt: "Whole spices and ground spice ingredients.",
    label: "Spice ingredients",
    className: "hnl-about-mosaic-spices",
  },
];

export function AboutPageContent() {
  return (
    <main className="hnl-page hnl-about-page">
      <div className="hnl-container hnl-about-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>About Us</span>
        </nav>

        <section className="hnl-about-intro" aria-labelledby="hnl-about-title">
          <Reveal className="hnl-about-intro-copy">
            <p className="hnl-eyebrow">ORGANICANDNUTRITION · VELLORE</p>
            <h1 id="hnl-about-title">About HealthyNewLifestyle</h1>
            <p className="hnl-about-lead">
              Traditional food, thoughtfully explored for everyday life.
            </p>
            <p className="hnl-about-body">
              HealthyNewLifestyle is the customer-facing brand of OrganicandNutrition.
              Our catalog brings together traditional rice, millets, oils and other pantry
              products, with product details available on each item page.
            </p>
            <Link href="/shop" className="hnl-about-link">
              Explore the collection <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <AboutImage
            src="/images/about/about-brand-story.jpg"
            alt="A green rice field at sunrise with farmers working in the distance."
            className="hnl-about-intro-image"
            caption="HealthyNewLifestyle · OrganicandNutrition"
            priority
            sizes="(max-width: 800px) 100vw, 54vw"
          />
        </section>

        <section className="hnl-about-story hnl-about-section" aria-labelledby="hnl-about-story-title">
          <AboutImage
            src="/images/about/about-harvest-fields.jpg"
            alt="Farm workers harvesting in a golden field."
            className="hnl-about-story-image"
            sizes="(max-width: 800px) 100vw, 48vw"
          />
          <Reveal className="hnl-about-story-copy">
            <p className="hnl-eyebrow">OUR STORY</p>
            <h2 id="hnl-about-story-title">A place to discover familiar ingredients</h2>
            <p>
              Our aim is to make traditional foods and everyday pantry ingredients easier
              to discover, while keeping available product and sourcing information clear.
            </p>
            <p>
              Explore regional food traditions and ingredients represented in our current
              catalog. Individual product pages share the details available for each item.
            </p>
          </Reveal>
        </section>

        <section className="hnl-about-farms hnl-about-section" aria-labelledby="hnl-about-farms-title">
          <Reveal className="hnl-about-farms-copy">
            <p className="hnl-eyebrow">ROOTED IN TRADITION</p>
            <h2 id="hnl-about-farms-title">From traditional farms</h2>
            <p>
              Traditional rice and millets are among the ingredient families in our
              catalog. These farm images offer a glimpse of the agricultural settings
              behind familiar staples; product pages provide the sourcing details
              currently available.
            </p>
          </Reveal>
          <div className="hnl-about-farm-images">
            <AboutImage
              src="/images/about/about-indian-farmer.jpg"
              alt="A farmer tending young rice plants in a field."
              className="hnl-about-farmer-image"
              sizes="(max-width: 800px) 48vw, 25vw"
            />
            <AboutImage
              src="/images/about/about-millet-farming.jpg"
              alt="Farmers working among millet crops."
              className="hnl-about-millet-image"
              sizes="(max-width: 800px) 48vw, 32vw"
            />
          </div>
        </section>

        <section className="hnl-about-grains hnl-about-section" aria-labelledby="hnl-about-grains-title">
          <Reveal className="hnl-about-section-heading">
            <p className="hnl-eyebrow">THE PANTRY</p>
            <h2 id="hnl-about-grains-title">Grains & natural goodness</h2>
            <p>
              Explore the traditional grains, pulses and spices featured across our
              current selection.
            </p>
          </Reveal>
          <div className="hnl-about-mosaic">
            {ingredientImages.map((image) => (
              <AboutImage
                key={image.src}
                src={image.src}
                alt={image.alt}
                caption={image.label}
                className={`hnl-about-mosaic-image ${image.className}`}
                sizes="(max-width: 700px) 50vw, 34vw"
              />
            ))}
          </div>
        </section>

        <section className="hnl-about-harvest hnl-about-section" aria-labelledby="hnl-about-harvest-title">
          <Reveal className="hnl-about-harvest-copy">
            <p className="hnl-eyebrow">INGREDIENTS FOR EVERYDAY COOKING</p>
            <h2 id="hnl-about-harvest-title">Fresh from harvest</h2>
            <p>
              Our pantry brings together ingredients used in everyday cooking. For
              ingredient lists, variants and preparation or storage suggestions, see
              the details provided on each product page.
            </p>
          </Reveal>
          <div className="hnl-about-harvest-images">
            <AboutImage
              src="/images/about/about-fresh-harvest.jpg"
              alt="A field being harvested at sunset."
              className="hnl-about-harvest-field"
              sizes="(max-width: 800px) 100vw, 38vw"
            />
            <AboutImage
              src="/images/about/about-farm-to-home.jpg"
              alt="A farmer holding a basket of fresh produce."
              className="hnl-about-harvest-basket"
              sizes="(max-width: 800px) 48vw, 25vw"
            />
          </div>
        </section>

        <section className="hnl-about-philosophy hnl-about-section" aria-labelledby="hnl-about-philosophy-title">
          <AboutImage
            src="/images/about/about-healthy-food.jpg"
            alt="A traditional meal served on a banana leaf."
            className="hnl-about-philosophy-image"
            sizes="(max-width: 800px) 100vw, 42vw"
          />
          <Reveal className="hnl-about-philosophy-copy">
            <p className="hnl-eyebrow">OUR FOOD PHILOSOPHY</p>
            <h2 id="hnl-about-philosophy-title">Good food begins with knowing what is in it</h2>
            <p>
              We want HealthyNewLifestyle to be a useful place to explore regional food
              traditions and familiar ingredients. We keep product information grounded
              in what is listed for each item, so you can make an informed choice.
            </p>
            <Link href="/shop" className="hnl-about-text-link">
              Browse products <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </section>

        <section className="hnl-about-closing" aria-labelledby="hnl-about-closing-title">
          <AboutImage
            src="/images/about/about-brand-closing.jpg"
            alt="Rice fields and farmers at sunrise."
            className="hnl-about-closing-image"
            sizes="(max-width: 800px) 100vw, 40vw"
          />
          <Reveal className="hnl-about-closing-copy">
            <p className="hnl-eyebrow">FROM ORGANICANDNUTRITION · VELLORE</p>
            <h2 id="hnl-about-closing-title">Find something familiar for your pantry</h2>
            <p>Browse the products currently available from HealthyNewLifestyle.</p>
            <Link href="/shop" className="hnl-about-button">
              Explore the shop <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </section>

        <div className="hnl-about-contact" aria-label="Contact details">
          <p>
            <strong>OrganicandNutrition</strong>
            <span>Building No. 24, Ashok Biller, Vellore</span>
          </p>
          <div>
            <a href="tel:6381243416">6381243416</a>
            <Link href="/contact">Contact us</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
