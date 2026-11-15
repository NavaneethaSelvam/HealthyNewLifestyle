"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStorefront } from "@/features/cart/StorefrontProvider";

export default function LoginPage() {
  const router = useRouter();
  const { updateProfile, addToast } = useStorefront();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      addToast({ type: "error", message: "Please enter your name and mobile number." });
      return;
    }

    updateProfile({
      fullName: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
    });
    addToast({
      type: "info",
      title: "Local profile saved",
      message: "This profile is stored in this browser only. Account sign-in is not connected.",
    });
    router.push("/account");
  };

  return (
    <main className="hnl-page hnl-auth-page">
      <div className="hnl-container">
        <nav className="hnl-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Account</span>
        </nav>

        <div className="hnl-auth-card">
          <span className="hnl-eyebrow">LOCAL PROFILE</span>
          <h1>Set Up Your Profile</h1>
          <p className="hnl-auth-sub">
            Account sign-in and verification are not connected in this frontend preview. Save profile details locally to use the account screens.
          </p>

          <form onSubmit={handleSaveProfile} className="hnl-auth-form">
            <div className="hnl-field">
              <label htmlFor="profile-name" className="hnl-field-label">Full Name *</label>
              <input
                id="profile-name"
                type="text"
                className="hnl-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="hnl-field">
              <label htmlFor="profile-mobile" className="hnl-field-label">Mobile Number *</label>
              <input
                id="profile-mobile"
                type="tel"
                className="hnl-input"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                autoComplete="tel"
                required
              />
            </div>

            <div className="hnl-field">
              <label htmlFor="profile-email" className="hnl-field-label">Email Address (Optional)</label>
              <input
                id="profile-email"
                type="email"
                className="hnl-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>

            <button type="submit" className="hnl-button hnl-button--full">
              Save Local Profile
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
