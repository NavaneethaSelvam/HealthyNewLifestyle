import Link from "next/link";
import { categories } from "@/features/catalog/catalog-data";
import { HomepageCategoryImage } from "@/features/homepage/homepage-category-media";
import { ScrollReveal } from "@/features/homepage/ScrollReveal";

export function CategoryCarousel() {
  return (
    <ScrollReveal className="hnl-home-category-reveal">
      <section
        className="hnl-home-categories"
        aria-labelledby="home-categories-heading"
      >
        <div className="hnl-home-categories-heading">
          <div>
            <p className="hnl-eyebrow">Explore the pantry</p>
            <h2 id="home-categories-heading">Shop by category</h2>
          </div>
          <Link className="hnl-text-link" href="/shop">
            Shop all products <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div
          className="hnl-home-category-rail"
          role="region"
          aria-label="Product categories"
        >
          <div className="hnl-home-category-track">
            {[0, 1].map((copy) => (
              <div
                className="hnl-home-category-group"
                key={copy}
                aria-hidden={copy === 1}
                inert={copy === 1}
              >
                {categories.map((category) => (
                  <Link
                    className="hnl-category-marquee-item"
                    href={`/categories/${category.slug}`}
                    key={`${copy}-${category.slug}`}
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    <span className="hnl-category-marquee-image">
                      <HomepageCategoryImage
                        category={category}
                        sizes="92px"
                      />
                    </span>
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
