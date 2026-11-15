"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useStorefront } from "@/features/cart/StorefrontProvider";

const contactFaqs = [
  {
    question: "What delivery details apply to my order?",
    answer:
      "Delivery areas, methods, rates, and timelines are not available through this preview. Contact OrganicandNutrition to confirm current arrangements.",
    href: "/policies/shipping",
    link: "Read the shipping policy",
  },
  {
    question: "Can I request a return or refund through this site?",
    answer:
      "Returns and refunds are not processed through this frontend preview. Confirm the current policy with OrganicandNutrition before placing an order.",
    href: "/policies/returns",
    link: "Read the returns policy",
  },
  {
    question: "What information is stored in this browser?",
    answer:
      "Cart, wishlist, profile, address, and saved checkout-preview information may be saved in browser local storage. Do not enter sensitive payment details.",
    href: "/policies/privacy",
    link: "Read the privacy policy",
  },
];

export default function ContactPage() {
  const { addToast } = useStorefront();
  const prefersReducedMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [topic, setTopic] = useState("Product Quality & Inquiries");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !message.trim()) {
      addToast({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    setSubmitted(true);
    addToast({
      type: "success",
      title: "Message Transmitted",
      message: "Thank you for reaching out! Our Vellore team will call you within 24 hours.",
    });
  };

  return (
    <main className="hnl-page hnl-contact-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Contact</span>
        </nav>

        <section className="hnl-contact-hero" aria-labelledby="contact-title">
          <motion.div
            className="hnl-contact-hero-copy"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="hnl-eyebrow">ORGANICANDNUTRITION · VELLORE</p>
            <h1 className="hnl-contact-hero-title" id="contact-title">
              We’d Love to Hear From You
            </h1>
            <p className="hnl-contact-hero-intro">
              Have a question about our products or need help with your order?
              We’re here to help.
            </p>
            <a className="hnl-button hnl-button--accent" href="#contact-form">
              Get in touch <span aria-hidden="true">→</span>
            </a>
          </motion.div>

          <motion.div
            className="hnl-contact-hero-media"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          >
            <Image
              src="/images/contact/contact-hero.jpg"
              alt="Fresh ingredients being prepared in a bright kitchen"
              fill
              priority
              sizes="(max-width: 760px) 100vw, (max-width: 1100px) 90vw, 650px"
            />
          </motion.div>
        </section>

        <div className="hnl-contact-layout">
          <div className="hnl-contact-form-col">
            <motion.section
              className="hnl-contact-form-box"
              id="contact-form"
              aria-labelledby="contact-form-title"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <p className="hnl-eyebrow">SEND A MESSAGE</p>
              <h2 id="contact-form-title">Send an Enquiry</h2>
              <p>Fill out the form below and we will get back to you promptly.</p>

              {submitted ? (
                <div className="hnl-contact-success-state" aria-live="polite">
                  <div className="hnl-success-badge-icon">✓</div>
                  <h3>Thank you, {name}!</h3>
                  <p>
                    Your message has been sent to our customer relations team in
                    Vellore. We will contact you at {mobile} soon.
                  </p>
                  <button
                    type="button"
                    className="hnl-button hnl-button--outline"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="hnl-contact-form">
                  <div className="hnl-form-grid">
                    <div className="hnl-field">
                      <label className="hnl-field-label" htmlFor="contact-name">
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        className="hnl-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. S. Ramanathan"
                        required
                      />
                    </div>

                    <div className="hnl-field">
                      <label className="hnl-field-label" htmlFor="contact-phone">
                        Phone Number *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        className="hnl-input"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="e.g. 98401 23456"
                        required
                      />
                    </div>

                    <div className="hnl-field hnl-field--full">
                      <label className="hnl-field-label" htmlFor="contact-email">
                        Email Address (Optional)
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        className="hnl-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ramanathan@example.com"
                      />
                    </div>

                    <div className="hnl-field hnl-field--full">
                      <label className="hnl-field-label" htmlFor="contact-topic">
                        Enquiry Topic
                      </label>
                      <select
                        id="contact-topic"
                        className="hnl-select"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      >
                        <option value="Product Quality & Inquiries">
                          Product Quality & Recommendations
                        </option>
                        <option value="Current Order Status">
                          Track or Modify Existing Order
                        </option>
                        <option value="Bulk Purchase & Festive Gifting">
                          Bulk Pantry Restock & Gifting
                        </option>
                        <option value="Farmer & Sourcing Collaboration">
                          Farm Partner Collaboration
                        </option>
                        <option value="Other Assistance">
                          Other Feedback or Inquiry
                        </option>
                      </select>
                    </div>

                    <div className="hnl-field hnl-field--full">
                      <label className="hnl-field-label" htmlFor="contact-message">
                        Your Message *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        className="hnl-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please share details about your inquiry or requirements..."
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="hnl-button hnl-button--full">
                    Submit Enquiry →
                  </button>
                </form>
              )}
            </motion.section>
          </div>

          <aside className="hnl-contact-info-col" aria-labelledby="contact-info-title">
            <motion.section
              className="hnl-contact-info-card"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.4, delay: 0.06, ease: "easeOut" }}
            >
              <div className="hnl-contact-care-image">
                <Image
                  src="/images/contact/customer-care.jpg"
                  alt="A customer selecting fresh produce in a bright kitchen"
                  fill
                  sizes="(max-width: 900px) 90vw, 420px"
                />
              </div>
              <div className="hnl-contact-info-content">
                <p className="hnl-eyebrow">WE’RE HERE TO HELP</p>
                <h2 id="contact-info-title">Office & Farm Hub</h2>
                <address className="hnl-contact-address">
                  <strong>OrganicandNutrition</strong>
                  <br />
                  Building No. 24, Ashok Biller
                  <br />
                  Vellore, Tamil Nadu – 632001
                </address>

                <div className="hnl-contact-phone-block">
                  <span className="hnl-meta-label">Telephone Helpline</span>
                  <a href="tel:6381243416" className="hnl-contact-phone-link">
                    📞 6381243416
                  </a>
                  <p className="hnl-contact-hours">
                    Available Monday – Saturday, 9 AM – 7 PM
                  </p>
                </div>

                <div className="hnl-contact-email-block">
                  <span className="hnl-meta-label">Email Support</span>
                  <a
                    href="mailto:support@organicnutrition.in"
                    className="hnl-contact-email-link"
                  >
                    ✉ support@organicnutrition.in
                  </a>
                </div>

                <div className="hnl-whatsapp-cta">
                  <a
                    href="https://wa.me/916381243416?text=Hi%20OrganicandNutrition,%20I%20have%20an%20inquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hnl-button hnl-button--outline hnl-button--full"
                  >
                    💬 Chat on WhatsApp
                  </a>
                </div>
              </div>
            </motion.section>
          </aside>
        </div>

        <motion.section
          className="hnl-contact-editorial"
          aria-labelledby="contact-editorial-title"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="hnl-contact-editorial-copy">
            <p className="hnl-eyebrow">PURE · NATURAL · WHOLESOME</p>
            <h2 id="contact-editorial-title">
              Rooted in nature, here for you.
            </h2>
            <p>
              Every grain and bottle is sourced from dedicated family farms in
              the Palar river basin, checked for natural quality, and delivered
              straight to your home.
            </p>
            <p>
              Our team is here to help with questions about products and
              enquiries.
            </p>
          </div>
          <div className="hnl-contact-editorial-media">
            <div className="hnl-contact-editorial-main-image">
              <Image
                src="/images/contact/contact-natural-ingredients.jpg"
                alt="A bowl of natural grains, seeds, and legumes"
                fill
                sizes="(max-width: 900px) 90vw, 560px"
              />
            </div>
            <div className="hnl-contact-editorial-detail-image">
              <Image
                src="/images/contact/contact-support.jpg"
                alt="Fresh produce and pantry ingredients arranged on a counter"
                fill
                sizes="(max-width: 900px) 38vw, 220px"
              />
            </div>
          </div>
        </motion.section>

        <section className="hnl-contact-faq" aria-labelledby="contact-faq-title">
          <div className="hnl-contact-faq-heading">
            <p className="hnl-eyebrow">QUICK ANSWERS</p>
            <h2 id="contact-faq-title">Frequently asked questions</h2>
          </div>
          <div className="hnl-contact-faq-list">
            {contactFaqs.map((faq) => (
              <details className="hnl-contact-faq-item" key={faq.href}>
                <summary>
                  <span>{faq.question}</span>
                  <span className="hnl-contact-faq-toggle" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="hnl-contact-faq-answer">
                  <p>{faq.answer}</p>
                  <Link href={faq.href}>
                    {faq.link} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
