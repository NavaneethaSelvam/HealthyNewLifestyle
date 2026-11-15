import Link from "next/link";
import { categories } from "@/features/catalog/catalog-data";
import { StorefrontWordmark } from "@/components/storefront/StorefrontWordmark";

const informationLinks = [
  { label: "About us", href: "/about" },
  { label: "Farmer & sourcing story", href: "/sourcing" },
  { label: "Contact us", href: "/contact" },
  { label: "Customer account", href: "/account" },
  { label: "My orders", href: "/account/orders" },
];

const policyLinks = [
  { label: "Privacy policy", href: "/policies/privacy" },
  { label: "Terms & conditions", href: "/policies/terms" },
  { label: "Shipping policy", href: "/policies/shipping" },
  { label: "Returns & refunds", href: "/policies/returns" },
];

export function StorefrontFooter() {
  return (
    <footer className="hnl-footer" id="footer">
      <div className="hnl-footer-main">
        <div className="hnl-footer-brand">
          <StorefrontWordmark variant="light" />
          <p>Pure • Natural • Wholesome</p>
          <address>
            Building No. 24, Ashok Biller, Vellore
            <br />
            <a href="tel:6381243416">6381243416</a>
          </address>
        </div>
        <div className="hnl-footer-column">
          <h2>Explore</h2>
          <nav className="hnl-footer-links" aria-label="Shop">
            <Link href="/shop">Shop all</Link>
            {categories.slice(0, 6).map((category) => (
              <Link href={`/categories/${category.slug}`} key={category.slug}>
                {category.name}
              </Link>
            ))}
            <Link href="/wishlist">Wishlist</Link>
          </nav>
        </div>
        <div className="hnl-footer-column">
          <h2>Information</h2>
          <nav className="hnl-footer-links" aria-label="Company information">
            {informationLinks.map((link) => (
              <Link href={link.href} key={link.href}>{link.label}</Link>
            ))}
            {policyLinks.map((link) => (
              <Link href={link.href} key={link.href}>{link.label}</Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="hnl-footer-bottom">
        <span>© OrganicandNutrition</span>
        <span>HealthyNewLifestyle</span>
        <a className="hnl-back-to-top" href="#top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
