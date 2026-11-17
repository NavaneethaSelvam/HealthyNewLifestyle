"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { submitCustomerForm } from "@/services/customerForms";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const requestRef = useRef<{ email: string; id: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !event.currentTarget.reportValidity()) return;

    const normalizedEmail = email.trim().toLowerCase();
    const submissionId =
      requestRef.current?.email === normalizedEmail
        ? requestRef.current.id
        : window.crypto.randomUUID();
    requestRef.current = { email: normalizedEmail, id: submissionId };
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const result = await submitCustomerForm({
        operation: "newsletter",
        submissionId,
        email: normalizedEmail,
        consent: true,
      });
      const emailSent = result.customerConfirmationSent === true;
      setConfirmationSent(emailSent);
      setSubmitted(true);
      if (emailSent) requestRef.current = null;
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Your subscription request could not be saved. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="hnl-newsletter-strip" id="newsletter" aria-labelledby="newsletter-heading">
      <div className="hnl-newsletter-container">
        <div className="hnl-newsletter-copy">
          <p className="hnl-eyebrow">STAY CONNECTED</p>
          <h2 id="newsletter-heading">Notes from the pantry.</h2>
          <p>
            Share your interest in seasonal stories, recipes, and collection news.
            Your request is saved for the team; updates are not sent automatically yet.
          </p>
        </div>

        <div className="hnl-newsletter-form-wrapper">
          {submitted ? (
            <div className="hnl-newsletter-success" role="status">
              <span className="hnl-newsletter-check" aria-hidden="true">
                {confirmationSent ? "✓" : "!"}
              </span>
              <span>
                {confirmationSent
                  ? "Your request is recorded. A confirmation email was sent; this is not a marketing email."
                  : "Your request is recorded, but the confirmation email could not be sent."}
                {!confirmationSent && (
                  <button
                    className="hnl-newsletter-retry"
                    type="button"
                    onClick={() => setSubmitted(false)}
                  >
                    Retry email
                  </button>
                )}
              </span>
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
                maxLength={254}
                autoComplete="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="hnl-newsletter-input"
              />
              <button className="hnl-button hnl-newsletter-submit" type="submit" disabled={isSubmitting}>
                <span>{isSubmitting ? "Sending…" : "Subscribe"}</span>
                {!isSubmitting && <span aria-hidden="true">→</span>}
              </button>
              <label className="hnl-newsletter-consent">
                <input type="checkbox" required />
                <span>
                  I agree to share my email for newsletter updates. See our{" "}
                  <Link href="/policies/privacy">Privacy Policy</Link>.
                </span>
              </label>
              {submissionError && (
                <p className="hnl-newsletter-error" role="alert">
                  {submissionError}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
