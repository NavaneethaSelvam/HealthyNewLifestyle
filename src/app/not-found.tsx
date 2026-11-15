import Link from "next/link";

export default function NotFound() {
  return (
    <main className="hnl-page hnl-not-found">
      <p className="hnl-eyebrow">404 · Page not found</p>
      <h1>We couldn’t find that page.</h1>
      <p>The address may be outdated, or the page may have moved.</p>
      <div className="hnl-hero-actions">
        <Link className="hnl-button" href="/">Return home</Link>
        <Link className="hnl-text-link" href="/shop">Browse categories <span aria-hidden="true">→</span></Link>
      </div>
    </main>
  );
}
