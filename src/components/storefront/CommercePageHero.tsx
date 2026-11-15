"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface CommercePageHeroProps {
  variant: "account" | "wishlist" | "cart";
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  action: {
    href: string;
    label: string;
  };
  image: string;
  imageAlt: string;
}

export function CommercePageHero({
  variant,
  eyebrow,
  title,
  subtitle,
  description,
  action,
  image,
  imageAlt,
}: CommercePageHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className={`hnl-commerce-hero hnl-commerce-hero--${variant}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.62, ease: "easeOut" }}
    >
      <div className="hnl-commerce-hero-copy">
        <span className="hnl-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <p className="hnl-commerce-hero-description">{description}</p>
        <Link className="hnl-button hnl-commerce-hero-cta" href={action.href}>
          <span>{action.label}</span>
          <span aria-hidden="true">↓</span>
        </Link>
      </div>

      <motion.div
        className="hnl-commerce-hero-art"
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 0.08, ease: "easeOut" }}
      >
        <div className="hnl-commerce-hero-art-image">
          <Image
            src={image}
            alt={imageAlt}
            fill
            loading="eager"
            sizes="(max-width: 600px) 55vw, (max-width: 900px) 32vw, 23vw"
          />
        </div>
      </motion.div>
    </motion.header>
  );
}
