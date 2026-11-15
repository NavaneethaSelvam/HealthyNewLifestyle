"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/features/catalog/catalog-data";
import { getAllProducts } from "@/features/catalog/products-data";
import { useStorefront } from "@/features/cart/StorefrontProvider";
import { StorefrontWordmark } from "@/components/storefront/StorefrontWordmark";

function CategoryMenu() {
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        menuRef.current.open = false;
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && menuRef.current) {
        menuRef.current.open = false;
      }
    }

    document.addEventListener("click", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <details className="hnl-mega-menu" ref={menuRef}>
      <summary>Categories</summary>
      <div className="hnl-mega-menu-panel">
        <p className="hnl-mega-menu-header">Browse Heritage & Organic Collections</p>
        <div className="hnl-mega-menu-grid">
          {categories.map((category) => (
            <Link
              href={`/categories/${category.slug}`}
              key={category.slug}
              onClick={() => {
                if (menuRef.current) menuRef.current.open = false;
              }}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </details>
  );
}

function MainNavigation() {
  return (
    <nav className="hnl-nav" aria-label="Main navigation">
      <Link href="/">Home</Link>
      <Link href="/shop">Shop All</Link>
      <CategoryMenu />
      <Link href="/recipes">Recipes</Link>
      <Link href="/sourcing">Know Your Farmers</Link>
      <Link href="/about">About Us</Link>
    </nav>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="20" height="20">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M5.5 20v-1.6a6.5 6.5 0 0 1 13 0V20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="20" height="20">
      <path
        d="M20.2 8.8c0 4.3-8.2 10-8.2 10s-8.2-5.7-8.2-10a4.25 4.25 0 0 1 8.2-1.5 4.25 4.25 0 0 1 8.2 1.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="20" height="20">
      <path
        d="M5 8.5h14l1 12H4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 9V6a3 3 0 0 1 6 0v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StorefrontHeader() {
  const { cartCount, wishlist, hydrated } = useStorefront();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function updateScrollState() {
      setScrolled(window.scrollY > 24);
    }
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  const q = searchQuery.trim().toLowerCase();

  const suggestedProducts = useMemo(() => {
    if (!q) return [];
    return getAllProducts()
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          (p.tamilName && p.tamilName.includes(q)) ||
          p.description.toLowerCase().includes(q)
      )
      .slice(0, 4);
  }, [q]);

  const suggestedCategories = useMemo(() => {
    if (!q) return [];
    return categories
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 3);
  }, [q]);

  const searchOpen = searchFocused && q.length > 0 && (suggestedProducts.length > 0 || suggestedCategories.length > 0);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={`hnl-header${scrolled ? " hnl-header--scrolled" : ""}`} id="top">
      <div className="hnl-announcement">
        <span className="hnl-announcement-company">Pure • Natural • Wholesome</span>
        <span className="hnl-announcement-message">
          Delivery details at checkout
        </span>
        <a href="tel:6381243416">Call: 6381243416</a>
      </div>

      <div className="hnl-header-main">
        <StorefrontWordmark />

        <div className="hnl-desktop-nav">
          <MainNavigation />
        </div>

        {/* Live Search */}
        <div className="hnl-search-wrapper" ref={searchRef}>
          <form className="hnl-search" onSubmit={handleSearchSubmit} role="search">
            <label className="hnl-visually-hidden" htmlFor="site-search">
              Search traditional rice, millets, oils...
            </label>
            <input
              id="site-search"
              type="search"
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search rice, millets, oils..."
              autoComplete="off"
            />
            <button type="submit" aria-label="Search">
              <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.75" />
                <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {searchOpen && (
            <div className="hnl-search-dropdown" role="listbox">
              {suggestedProducts.length > 0 && (
                <div className="hnl-search-results-group">
                  <div className="hnl-search-group-title">Products</div>
                  {suggestedProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="hnl-search-result-item"
                      onClick={() => setSearchFocused(false)}
                    >
                      <div className="hnl-search-result-thumb">
                        <Image src={p.image} alt={p.name} width={40} height={40} />
                      </div>
                      <div className="hnl-search-result-meta">
                        <span className="hnl-search-result-name">{p.name}</span>
                        <span className="hnl-search-result-price">₹{p.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {suggestedCategories.length > 0 && (
                <div className="hnl-search-results-group">
                  <div className="hnl-search-group-title">Categories</div>
                  {suggestedCategories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/categories/${c.slug}`}
                      className="hnl-search-cat-item"
                      onClick={() => setSearchFocused(false)}
                    >
                      <span>{c.name}</span>
                      <span className="hnl-search-cat-arrow">→</span>
                    </Link>
                  ))}
                </div>
              )}

              <div className="hnl-search-dropdown-footer">
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                  onClick={() => setSearchFocused(false)}
                >
                  View all results for &quot;{searchQuery}&quot; →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="hnl-header-actions" aria-label="Your account and shopping bag">
          <Link className="hnl-header-icon" href="/account" aria-label="Account">
            <AccountIcon />
          </Link>
          <Link
            className="hnl-header-icon"
            href="/wishlist"
            aria-label={hydrated && wishlist.length > 0 ? `Wishlist, ${wishlist.length} ${wishlist.length === 1 ? "item" : "items"}` : "Wishlist"}
          >
            <HeartIcon />
            {hydrated && wishlist.length > 0 && (
              <span className="hnl-header-count" aria-hidden="true">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link
            className="hnl-header-icon"
            href="/cart"
            aria-label={hydrated && cartCount > 0 ? `Shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}` : "Shopping bag"}
          >
            <BagIcon />
            {hydrated && cartCount > 0 && (
              <span className="hnl-header-count" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className={`hnl-mobile-nav${mobileMenuOpen ? " is-open" : ""}`}>
          <button
            className="hnl-mobile-nav-toggle"
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="hnl-mobile-nav-content"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span className="hnl-hamburger">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <div className="hnl-mobile-nav-content" id="hnl-mobile-nav-content">
            <nav className="hnl-nav" aria-label="Mobile navigation">
              {[
                { label: "Home", href: "/" },
                { label: "Shop All", href: "/shop" },
                { label: "Categories", href: "/categories/traditional-rice" },
                { label: "Recipes", href: "/recipes" },
                { label: "Know Your Farmers", href: "/sourcing" },
                { label: "About Us", href: "/about" },
              ].map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="hnl-mobile-nav-actions">
              <Link
                href="/account"
                className="hnl-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Account
              </Link>
              <Link
                href="/account/orders"
                className="hnl-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Track Orders
              </Link>
              <a href="tel:6381243416" className="hnl-mobile-phone">
                📞 6381243416
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
