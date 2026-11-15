import Link from "next/link";

export function StorefrontWordmark({
  variant = "default",
}: {
  variant?: "default" | "light";
}) {
  return (
    <Link
      className={`hnl-wordmark${variant === "light" ? " hnl-wordmark--light" : ""}`}
      href="/"
      aria-label="HealthyNewLifestyle home"
    >
      <svg
        className="hnl-wordmark-mark"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="24" cy="24" r="22" fill="#FFFFFF" stroke="#E4E9DB" />
        <path
          d="M23.8 32V18"
          stroke="#4A5D23"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M23.2 25.7C16.4 25.3 12.8 21 13.3 14.5c6.5-.1 10.6 3.8 9.9 11.2Z"
          fill="#8A9A5B"
        />
        <path
          d="M24.6 21.8c.5-6.5 4.7-10.2 11.1-10-0.1 6.5-4.2 10.4-11.1 10Z"
          fill="#4A5D23"
        />
        <path
          d="M11.8 31.5c3.1 5.7 7.2 8.6 12.2 8.6s9.1-2.9 12.2-8.6"
          stroke="#8B6F47"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M17.5 40.4h13"
          stroke="#8B6F47"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="hnl-wordmark-copy">
        <span className="hnl-wordmark-name">HealthyNewLifestyle</span>
        <span className="hnl-wordmark-byline">Organic Nutrition</span>
      </span>
    </Link>
  );
}
