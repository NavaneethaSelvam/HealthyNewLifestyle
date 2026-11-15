"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  staggerSelector?: string;
};

export function ScrollReveal({
  children,
  className = "",
  staggerSelector,
}: ScrollRevealProps) {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = revealRef.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    let revealed = false;
    let disconnectObserver = () => {};
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      element.dataset.revealed = "true";
      disconnectObserver();
      window.removeEventListener("scroll", revealOnScroll);
    };
    const revealOnScroll = () => {
      const bounds = element.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < window.innerHeight * 0.92) {
        reveal();
      }
    };

    let observer: IntersectionObserver;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          reveal();
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
    } catch {
      element.dataset.revealed = "true";
      return;
    }

    disconnectObserver = () => observer.disconnect();
    try {
      observer.observe(element);
    } catch {
      element.dataset.revealed = "true";
      observer.disconnect();
      return;
    }
    document.documentElement.classList.add("hnl-motion-enabled");

    if (staggerSelector) {
      element.querySelectorAll(staggerSelector).forEach((item, index) => {
        if (item instanceof HTMLElement) {
          item.style.setProperty("--hnl-reveal-index", String(index));
        }
      });
    }

    window.addEventListener("scroll", revealOnScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealOnScroll);
    };
  }, [staggerSelector]);

  return (
    <div
      className={`hnl-scroll-reveal${staggerSelector ? " hnl-scroll-reveal--stagger" : ""}${className ? ` ${className}` : ""}`}
      ref={revealRef}
    >
      {children}
    </div>
  );
}
