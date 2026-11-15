"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const slides = [
  {
    eyebrow: "A more thoughtful pantry",
    heading: ["Millets, the way", "they were meant to be."],
    description: "Nourishing grains for a healthier, happier you.",
    cta: "Shop Millets",
    href: "/categories/millets",
    image: "/images/banners/hero-organic-millets.png",
    alt: "Millet grains and bowls arranged on a table",
    imageLabel: "Millet grains",
    caption: "Traditional grains for everyday cooking",
  },
  {
    eyebrow: "Everyday goodness",
    heading: ["A better pantry.", "A more mindful plate."],
    description:
      "Discover pantry staples and familiar flavours for the way you cook every day.",
    cta: "Explore the shop",
    href: "/shop",
    image: "/images/banners/hero-healthy-food.png",
    alt: "Traditional grains and everyday pantry ingredients arranged together",
    imageLabel: "Everyday pantry ingredients",
    caption: "Familiar ingredients for your kitchen",
  },
  {
    eyebrow: "Tradition in every grain",
    heading: ["A pantry of", "heritage flavours."],
    description:
      "Explore the traditional rice, pantry staples and familiar ingredients that make home cooking special.",
    cta: "Explore the pantry",
    href: "/categories/traditional-rice",
    image: "/images/banners/hero-traditional-pantry.png",
    alt: "Traditional pantry ingredients arranged for South Indian cooking",
    imageLabel: "A traditional pantry",
    caption: "Familiar ingredients, carefully selected",
  },
  {
    eyebrow: "Grown with care",
    heading: ["From our farms", "to your family."],
    description:
      "Meet the farming communities and regional food traditions behind the ingredients we share.",
    cta: "Know our farmers",
    href: "/sourcing",
    image: "/images/banners/hero-farmer-transparent.png",
    alt: "Tamil Nadu farmer harvesting crops in a green field",
    imageLabel: "Farming communities",
    caption: "Rooted in the land and its people",
  },
] as const;

const autoplayDelay = 12000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const slide = slides[active]!;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);

    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const intervalId = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, autoplayDelay);

    return () => window.clearInterval(intervalId);
  }, [reducedMotion]);

  function changeSlide(index: number) {
    setActive((index + slides.length) % slides.length);
  }

  function handleImageError(image: string, src: string) {
    console.error(`Failed to load homepage hero image: ${image}`, src);
  }

  return (
    <section
      className="hnl-hero hnl-editorial-hero"
      aria-roledescription="carousel"
      aria-label="HealthyNewLifestyle introduction"
    >
      <div className="hnl-editorial-hero-copy">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            className="hnl-editorial-hero-message"
            key={slide.eyebrow}
            aria-live="off"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: reducedMotion ? 0 : -8,
              transition: { duration: reducedMotion ? 0.01 : 0.35 },
            }}
            transition={{ duration: reducedMotion ? 0.01 : 0.4 }}
          >
            <p className="hnl-eyebrow">{slide.eyebrow}</p>
            <h1>
              {slide.heading[0]}
              <br />
              <span>{slide.heading[1]}</span>
            </h1>
            <p className="hnl-editorial-hero-description">
              {slide.description}
            </p>
            <div className="hnl-hero-actions">
              <Link
                className="hnl-button hnl-editorial-hero-primary"
                href={slide.href}
              >
                {slide.cta} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hnl-editorial-hero-stage">
        <div className="hnl-editorial-hero-image-frame">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              className="hnl-editorial-hero-image"
              key={slide.image}
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, x: 28, scale: 0.985 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: reducedMotion ? 0 : -28,
                scale: 0.985,
                transition: {
                  duration: reducedMotion ? 0.01 : 0.4,
                  ease: [0.32, 0, 0.67, 0],
                },
              }}
              transition={{
                duration: reducedMotion ? 0.01 : 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                className="hnl-editorial-hero-float"
                animate={{ y: reducedMotion ? 0 : [0, -4, 0] }}
                transition={
                  reducedMotion
                    ? { duration: 0.01 }
                    : { duration: 6, ease: "easeInOut", repeat: Infinity }
                }
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  loading={active === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 820px) 100vw, 52vw"
                  style={{ objectFit: "contain" }}
                  onError={(event) =>
                    handleImageError(slide.image, event.currentTarget.currentSrc)
                  }
                />
              </motion.div>
              <div
                className="hnl-editorial-hero-image-note"
                aria-hidden="true"
              >
                <span>{slide.imageLabel}</span>
                <span>{slide.caption}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div
          className="hnl-editorial-hero-controls"
          role="group"
          aria-label="Hero slideshow controls"
        >
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => changeSlide(active - 1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => changeSlide(active + 1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <div
          className="hnl-editorial-hero-pagination"
          role="group"
          aria-label="Choose hero image"
        >
          {slides.map((item, index) => (
            <button
              aria-current={index === active ? "true" : undefined}
              aria-label={`Show slide ${index + 1}`}
              className={index === active ? "is-active" : ""}
              key={item.image}
              onClick={() => changeSlide(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
