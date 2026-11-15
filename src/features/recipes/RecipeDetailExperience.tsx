"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Recipe } from "@/features/recipes/recipes-data";
import { recipes } from "@/features/recipes/recipes-data";

export function RecipeDetailExperience({ recipe }: { recipe: Recipe }) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = !reduceMotion;
  const relatedRecipes = recipes.filter((item) => item.id !== recipe.id).slice(0, 2);

  return (
    <main className="hnl-page hnl-recipes-page hnl-recipe-detail-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/recipes">Recipes</Link>
          <span aria-hidden="true">/</span>
          <span>{recipe.title}</span>
        </nav>

        <article className="hnl-recipe-detail">
          <section className="hnl-recipe-detail-hero">
            <motion.header
              className="hnl-recipe-detail-copy"
              initial={shouldAnimate ? { opacity: 0, x: -22 } : false}
              animate={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span className="hnl-eyebrow">{recipe.category}</span>
              <h1>{recipe.title}</h1>
              <p className="hnl-recipe-detail-tamil">{recipe.tamilTitle}</p>
              <p className="hnl-recipe-detail-intro">{recipe.summary}</p>
              <div className="hnl-recipe-detail-meta">
                <span>
                  <strong>Preparation</strong>
                  {recipe.cookTime}
                </span>
                <span>
                  <strong>Serves</strong>
                  {recipe.serves}
                </span>
              </div>
            </motion.header>

            <motion.div
              className="hnl-recipe-detail-image"
              initial={shouldAnimate ? { opacity: 0, x: 22 } : false}
              animate={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.72, delay: 0.08, ease: "easeOut" }}
            >
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                sizes="(max-width: 760px) 100vw, 55vw"
                priority
              />
            </motion.div>
          </section>

          <div className="hnl-recipe-detail-grid">
            <motion.section
              aria-labelledby="recipe-ingredients-heading"
              initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
              whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: 0.68, ease: "easeOut" }}
            >
              <p className="hnl-eyebrow">WHAT YOU WILL NEED</p>
              <h2 id="recipe-ingredients-heading">Ingredients</h2>
              <ul className="hnl-recipe-ing-list">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </motion.section>

            <motion.section
              aria-labelledby="recipe-method-heading"
              initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
              whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: 0.68, delay: 0.1, ease: "easeOut" }}
            >
              <p className="hnl-eyebrow">FROM THE KITCHEN</p>
              <h2 id="recipe-method-heading">Preparation</h2>
              <ol className="hnl-recipe-steps-list">
                {recipe.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </motion.section>
          </div>

          <p className="hnl-recipe-product-link">
            Catalog ingredient:{" "}
            <Link href={`/products/${recipe.featuredProduct.slug}`}>
              {recipe.featuredProduct.name}
            </Link>
          </p>
        </article>

        {relatedRecipes.length > 0 && (
          <section className="hnl-related-recipes-section" aria-labelledby="related-recipes-heading">
            <div className="hnl-section-heading">
              <div>
                <p className="hnl-eyebrow">KEEP EXPLORING</p>
                <h2 id="related-recipes-heading">More recipes</h2>
              </div>
            </div>
            <div className="hnl-related-recipes">
              {relatedRecipes.map((item) => (
                <Link key={item.id} href={`/recipes/${item.id}`}>
                  <span>{item.category}</span>
                  {item.title}
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
