"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { recipes } from "@/features/recipes/recipes-data";

const recipeCategories = [
  {
    name: "Traditional Meals",
    image: "/images/recipes/recipe-traditional-meals.jpg",
    alt: "Traditional South Indian meal served on a banana leaf",
  },
  {
    name: "Millet Breakfast",
    image: "/images/recipes/recipe-millet-breakfast.jpg",
    alt: "Millet breakfast dishes with traditional accompaniments",
  },
  {
    name: "Ragi Dosa",
    image: "/images/recipes/recipe-ragi-dosa.jpg",
    alt: "Ragi dosa served with chutney",
  },
  {
    name: "Idli",
    image: "/images/recipes/recipe-idli.jpg",
    alt: "Idli with chutney and sambar",
  },
  {
    name: "Traditional Rice",
    image: "/images/recipes/recipe-traditional-rice.jpg",
    alt: "Traditional rice porridge garnished with cashews",
  },
  {
    name: "Healthy Drinks",
    image: "/images/recipes/recipe-healthy-drinks.jpg",
    alt: "A warm ragi drink served in a glass",
  },
  {
    name: "Homemade Snacks",
    image: "/images/recipes/recipe-homemade-snacks.jpg",
    alt: "A selection of homemade South Indian snacks",
  },
  {
    name: "Traditional Sweets",
    image: "/images/recipes/recipe-traditional-sweets.jpg",
    alt: "Traditional sweets served on a banana leaf",
  },
];

export function RecipesExperience() {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = !reduceMotion;
  const categoryCarouselRef = useRef<HTMLDivElement>(null);
  const pauseAutoScroll = useRef(false);

  useEffect(() => {
    const carousel = categoryCarouselRef.current;
    if (!carousel || reduceMotion) return;

    let frameId = 0;
    let previousTime = 0;
    let direction = 1;

    const animateScroll = (time: number) => {
      if (previousTime && !pauseAutoScroll.current) {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        if (maxScroll > 0) {
          const elapsed = Math.min(time - previousTime, 40);
          carousel.scrollLeft += direction * elapsed * 0.014;
          if (carousel.scrollLeft >= maxScroll - 1) direction = -1;
          if (carousel.scrollLeft <= 1) direction = 1;
        }
      }

      previousTime = time;
      frameId = window.requestAnimationFrame(animateScroll);
    };

    frameId = window.requestAnimationFrame(animateScroll);
    return () => window.cancelAnimationFrame(frameId);
  }, [reduceMotion]);

  const scrollCategories = (direction: -1 | 1) => {
    const carousel = categoryCarouselRef.current;
    if (!carousel) return;
    pauseAutoScroll.current = true;
    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.75,
      behavior: reduceMotion ? "instant" : "smooth",
    });
    window.setTimeout(() => {
      pauseAutoScroll.current = false;
    }, 1400);
  };

  return (
    <>
      <section className="hnl-recipes-hero" aria-labelledby="recipes-title">
        <motion.div
          className="hnl-recipes-hero-copy"
          initial={shouldAnimate ? { opacity: 0, x: -24 } : false}
          animate={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.72, ease: "easeOut" }}
        >
          <span className="hnl-eyebrow">KITCHEN &amp; FOOD KNOWLEDGE</span>
          <h1 id="recipes-title">Traditional Recipes</h1>
          <motion.p
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.65, delay: 0.16, ease: "easeOut" }}
          >
            Discover traditional recipes made with rice, millets and wholesome
            pantry ingredients. Celebrate authentic flavours and everyday
            cooking inspired by our food heritage.
          </motion.p>
          <a className="hnl-button" href="#featured-recipes">
            Explore Recipes <span aria-hidden="true">↓</span>
          </a>
        </motion.div>

        <motion.div
          className="hnl-recipes-hero-image"
          initial={shouldAnimate ? { opacity: 0, x: 24 } : false}
          animate={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
        >
          <Image
            src="/images/recipes/recipe-traditional-meals.jpg"
            alt="A traditional South Indian meal served on a banana leaf"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          <span className="hnl-recipes-hero-caption">
            Everyday cooking, rooted in tradition
          </span>
        </motion.div>
      </section>

      <section className="hnl-recipe-categories" aria-labelledby="recipe-categories-title">
        <div className="hnl-section-heading">
          <div>
            <p className="hnl-eyebrow">BROWSE THE KITCHEN</p>
            <h2 id="recipe-categories-title">Recipes for every table</h2>
          </div>
          <p>Explore familiar ingredients and traditional ways of cooking.</p>
        </div>

        <div className="hnl-recipe-category-carousel">
          <div
            className="hnl-recipe-categories-grid"
            ref={categoryCarouselRef}
            role="region"
            aria-label="Recipe categories"
            aria-roledescription="carousel"
            onMouseEnter={() => {
              pauseAutoScroll.current = true;
            }}
            onMouseLeave={() => {
              pauseAutoScroll.current = false;
            }}
            onFocusCapture={() => {
              pauseAutoScroll.current = true;
            }}
            onBlurCapture={(event) => {
              if (
                !(event.relatedTarget instanceof Node) ||
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                pauseAutoScroll.current = false;
              }
            }}
          >
            {recipeCategories.map((category, index) => (
              <motion.article
                className="hnl-recipe-category-card"
                key={category.name}
                initial={shouldAnimate ? { opacity: 0, x: -22 } : false}
                whileInView={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
                viewport={{ once: true, amount: 0.18 }}
                transition={{
                  duration: 0.68,
                  delay: shouldAnimate ? index * 0.1 : 0,
                  ease: "easeOut",
                }}
              >
                <Link
                  className="hnl-recipe-category-link"
                  href="#featured-recipes"
                  aria-label={`View available recipes from ${category.name}`}
                >
                  <div className="hnl-recipe-category-image">
                    <Image
                      src={category.image}
                      alt={category.alt}
                      fill
                      sizes="(max-width: 620px) 70vw, (max-width: 1000px) 32vw, 20vw"
                    />
                  </div>
                  <h3>{category.name}</h3>
                  <span className="hnl-recipe-category-action">
                    View recipes <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
          <div className="hnl-recipe-carousel-controls" aria-label="Recipe category controls">
            <button
              type="button"
              onClick={() => scrollCategories(-1)}
              aria-label="Scroll recipe categories left"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => scrollCategories(1)}
              aria-label="Scroll recipe categories right"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      <section
        className="hnl-featured-recipes"
        id="featured-recipes"
        aria-labelledby="featured-recipes-title"
      >
        <div className="hnl-section-heading">
          <div>
            <p className="hnl-eyebrow">FROM OUR RECIPE COLLECTION</p>
            <h2 id="featured-recipes-title">Featured recipes</h2>
          </div>
          <p>Eight ways to bring traditional pantry ingredients to your table.</p>
        </div>

        <div className="hnl-recipes-grid">
          {recipes.map((recipe, index) => (
            <motion.article
              className="hnl-recipe-card hnl-featured-recipe-card"
              key={recipe.id}
              initial={shouldAnimate ? { opacity: 0, y: 24 } : false}
              whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: 0.16 }}
              transition={{
                duration: 0.7,
                delay: shouldAnimate ? index * 0.12 : 0,
                ease: "easeOut",
              }}
            >
              <Link
                href={`/recipes/${recipe.id}`}
                className="hnl-recipe-media"
                aria-label={`Read ${recipe.title}`}
              >
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  className="hnl-recipe-img"
                />
                <span className="hnl-recipe-category-tag">{recipe.category}</span>
              </Link>

              <div className="hnl-recipe-body">
                <div className="hnl-recipe-meta-row">
                  <span>{recipe.cookTime}</span>
                  <span>Serves {recipe.serves}</span>
                </div>
                <h3 className="hnl-recipe-title">
                  <Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                </h3>
                <p className="hnl-recipe-tamil">{recipe.tamilTitle}</p>
                <p className="hnl-recipe-summary">{recipe.summary}</p>
                <Link className="hnl-text-link" href={`/recipes/${recipe.id}`}>
                  View Ingredients &amp; Method <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
