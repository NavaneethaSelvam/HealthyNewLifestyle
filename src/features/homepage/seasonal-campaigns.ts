export type SeasonalCampaign = {
  id: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  active: boolean;
  image: `/images/${string}` | null;
  imageRequirement: string;
  startsAt: string | null;
  endsAt: string | null;
};

export const seasonalCampaigns: SeasonalCampaign[] = [
  {
    id: "diwali",
    title: "Diwali Special",
    description: "Explore pantry ingredients for festive cooking and sharing.",
    href: "/shop",
    ctaLabel: "Explore offers",
    active: false,
    image: null,
    imageRequirement: "Approved Diwali food and traditional-ingredients banner",
    startsAt: null,
    endsAt: null,
  },
  {
    id: "pongal",
    title: "Pongal Special",
    description: "Discover traditional ingredients for the harvest season.",
    href: "/shop",
    ctaLabel: "Explore offers",
    active: false,
    image: null,
    imageRequirement: "Approved Pongal and harvest-food banner",
    startsAt: null,
    endsAt: null,
  },
  {
    id: "new-year",
    title: "New Year Special",
    description: "Explore pantry staples for a fresh start in the kitchen.",
    href: "/shop",
    ctaLabel: "Explore offers",
    active: false,
    image: null,
    imageRequirement: "Approved New Year food and pantry banner",
    startsAt: null,
    endsAt: null,
  },
];

export function getActiveSeasonalCampaigns(now: number): SeasonalCampaign[] {
  return seasonalCampaigns.filter((campaign) => {
    if (
      !campaign.active ||
      !campaign.image?.startsWith("/images/") ||
      !campaign.startsAt ||
      !campaign.endsAt
    ) {
      return false;
    }

    const startsAt = Date.parse(campaign.startsAt);
    const endsAt = Date.parse(campaign.endsAt);
    return (
      Number.isFinite(startsAt) &&
      Number.isFinite(endsAt) &&
      startsAt <= now &&
      now < endsAt
    );
  });
}

export function getNextSeasonalCampaignBoundary(now: number): number | undefined {
  const futureBoundaries = seasonalCampaigns
    .filter((campaign) => campaign.active && campaign.image?.startsWith("/images/"))
    .flatMap((campaign) => [campaign.startsAt, campaign.endsAt])
    .filter((date): date is string => date !== null)
    .map(Date.parse)
    .filter((timestamp) => Number.isFinite(timestamp) && timestamp > now);

  return futureBoundaries.length ? Math.min(...futureBoundaries) : undefined;
}
