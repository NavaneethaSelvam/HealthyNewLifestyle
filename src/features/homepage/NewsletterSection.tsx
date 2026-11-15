"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
  }

  return (
    <section className="hnl-newsletter-strip" id="newsletter" aria-labelledby="newsletter-heading">
      <div className="hnl-newsletter-container">
        <div className="hnl-newsletter-copy">
          <p className="hnl-eyebrow">STAY CONNECTED</p>
          <h2 id="newsletter-heading">Notes from the pantry.</h2>
          <p>
            Share your interest in seasonal stories, recipes, and collection news. Email subscriptions are not connected in this preview yet.
          </p>
        </div>

        <div className="hnl-newsletter-form-wrapper">
          {submitted ? (
            <div className="hnl-newsletter-success" role="status">
              <span className="hnl-newsletter-check" aria-hidden="true">✓</span>
              <span>Thanks for your interest. Email subscriptions are not connected in this preview yet.</span>
            </div>
          ) : (
            <form className="hnl-newsletter-form" onSubmit={handleSubmit}>
              <label className="hnl-visually-hidden" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="hnl-newsletter-input"
              />
              <button className="hnl-button hnl-newsletter-submit" type="submit">
                <span>Subscribe</span>
                <span aria-hidden="true">→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
