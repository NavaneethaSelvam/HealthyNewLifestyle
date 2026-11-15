"use client";

import Image from "next/image";
import Link from "next/link";

type InfoSection = { heading: string; body: string };

type InfoPageProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
  imageFit?: "cover" | "contain";
  currentHref: string;
  sections: InfoSection[];
};

const policyLinks = [
  { title: "Privacy policy", href: "/policies/privacy" },
  { title: "Terms & conditions", href: "/policies/terms" },
  { title: "Shipping policy", href: "/policies/shipping" },
  { title: "Returns & refunds", href: "/policies/returns" },
];

function getSectionId(heading: string) {
  const slug = heading
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `policy-${slug}`;
}

export function InfoPage({
  eyebrow,
  title,
  introduction,
  imageSrc,
  imageAlt,
  imagePosition = "center",
  imageFit = "cover",
  currentHref,
  sections,
}: InfoPageProps) {
  const relatedPolicies = policyLinks.filter(
    (policy) => policy.href !== currentHref,
  );

  const sectionLinks = sections.map((section) => ({
    heading: section.heading,
    id: getSectionId(section.heading),
  }));

  const contentsNav = (
    <nav aria-label="Policy sections">
      <ol>
        {sectionLinks.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <main className="hnl-page hnl-policy-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>

        <section className="hnl-policy-hero" aria-labelledby="policy-title">
          <div className="hnl-policy-hero-copy">
            <p className="hnl-eyebrow">{eyebrow}</p>
            <h1 className="hnl-policy-title" id="policy-title">
              {title}
            </h1>
            <p className="hnl-policy-intro">{introduction}</p>
            <span className="hnl-policy-updated">
              <span aria-hidden="true" />
              Helpful information from OrganicandNutrition
            </span>
          </div>

          <div
            className={`hnl-policy-hero-media${imageFit === "contain" ? " is-contained" : ""}`}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 760px) 100vw, (max-width: 1100px) 45vw, 600px"
              style={{ objectFit: imageFit, objectPosition: imagePosition }}
            />
            <span className="hnl-policy-image-caption" aria-hidden="true">
              HealthyNewLifestyle · OrganicandNutrition
            </span>
          </div>
        </section>

        <div className="hnl-policy-layout">
          <div className="hnl-policy-main">
            <details className="hnl-policy-mobile-toc">
              <summary>
                <span>On this page</span>
                <span className="hnl-policy-toc-toggle" aria-hidden="true">
                  +
                </span>
              </summary>
              {contentsNav}
            </details>

            <div className="hnl-policy-sections">
              {sections.map((section, index) => (
                <section
                  className="hnl-policy-section"
                  id={sectionLinks[index].id}
                  key={section.heading}
                >
                  <span className="hnl-policy-section-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2>{section.heading}</h2>
                    <p>{section.body}</p>
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="hnl-policy-desktop-toc" aria-label="On this page">
            <p className="hnl-policy-toc-heading">In this guide</p>
            {contentsNav}
          </aside>
        </div>

        <section
          className="hnl-policy-related"
          aria-labelledby="policy-related-title"
        >
          <div className="hnl-policy-related-heading">
            <p className="hnl-eyebrow">MORE INFORMATION</p>
            <h2 id="policy-related-title">Related policies</h2>
          </div>
          <nav aria-label="Related policies">
            {relatedPolicies.map((policy) => (
              <Link href={policy.href} key={policy.href}>
                <span>{policy.title}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
        </section>

        <section
          className="hnl-policy-support"
          aria-labelledby="policy-support-title"
        >
          <div>
            <p className="hnl-eyebrow">WE’RE HERE TO HELP</p>
            <h2 id="policy-support-title">Questions about this information?</h2>
            <p>Contact OrganicandNutrition for help with this policy page.</p>
          </div>
          <div className="hnl-policy-support-actions">
            <Link href="/contact" className="hnl-button hnl-button--accent">
              Contact us
            </Link>
            <a href="tel:6381243416">Call 6381243416</a>
          </div>
        </section>
      </div>
    </main>
  );
}
