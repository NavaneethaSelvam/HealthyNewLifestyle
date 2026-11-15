"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/features/homepage/ScrollReveal";
import {
  getActiveSeasonalCampaigns,
  getNextSeasonalCampaignBoundary,
  type SeasonalCampaign,
} from "@/features/homepage/seasonal-campaigns";

export function SeasonalCampaignSection() {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeCampaigns, setActiveCampaigns] = useState<SeasonalCampaign[]>([]);

  useEffect(() => {
    let timerId: number | undefined;

    function refreshCampaigns() {
      const now = Date.now();
      setActiveCampaigns(getActiveSeasonalCampaigns(now));
      const nextBoundary = getNextSeasonalCampaignBoundary(now);

      if (nextBoundary !== undefined) {
        timerId = window.setTimeout(
          refreshCampaigns,
          Math.min(nextBoundary - now + 1, 2_147_000_000),
        );
      }
    }

    const frameId = window.requestAnimationFrame(refreshCampaigns);
    return () => {
      if (timerId !== undefined) window.clearTimeout(timerId);
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
    };
  }, []);

  if (activeCampaigns.length === 0) return null;

  function moveRail(direction: -1 | 1) {
    railRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  }

  return (
    <ScrollReveal
      className="hnl-seasonal-reveal"
      staggerSelector=".hnl-seasonal-card"
    >
      <section className="hnl-section hnl-seasonal-section">
        <SectionHeading
          eyebrow="Seasonal selections"
          title="Occasions, thoughtfully celebrated."
          description="Explore seasonal collections from HealthyNewLifestyle."
        />
        <div className="hnl-seasonal-controls" aria-label="Seasonal campaign controls">
          <button type="button" onClick={() => moveRail(-1)} aria-label="Previous campaigns">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" onClick={() => moveRail(1)} aria-label="Next campaigns">
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="hnl-seasonal-rail" ref={railRef}>
          {activeCampaigns.map((campaign) => {
            if (!campaign.image) return null;

            return (
              <Link
                className="hnl-seasonal-card"
                href={campaign.href}
                key={campaign.id}
              >
                <span className="hnl-seasonal-card-image">
                  <Image
                    src={campaign.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, 33vw"
                  />
                </span>
                <span className="hnl-seasonal-card-copy">
                  <span>{campaign.title}</span>
                  <span>{campaign.description}</span>
                  <span className="hnl-text-link">
                    {campaign.ctaLabel} <span aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </ScrollReveal>
  );
}
