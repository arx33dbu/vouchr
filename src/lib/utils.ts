import { TradeCategory } from "@/types";

export function generateTrialKey(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TRIAL-${num}`;
}

export function generateReferralCode(customerName: string): string {
  const cleanName = customerName
    .trim()
    .split(" ")[0]
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 6) || "FRIEND";
  const num = Math.floor(10 + Math.random() * 90);
  return `${cleanName}-${num}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim — from start of text
    .replace(/-+$/, ""); // Trim — from end of text
}

export function buildGoogleReviewUrl(placeId: string, customUrl?: string): string {
  if (customUrl && customUrl.trim().length > 0) {
    return customUrl.trim();
  }
  if (!placeId) {
    return "https://search.google.com/local/writereview";
  }
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId.trim())}`;
}

/**
 * Extracts a Google Place ID from various common Google Maps URLs
 * or returns the raw string if it looks like a Place ID (starts with ChIJ).
 */
export function extractPlaceIdFromUrl(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();

  // If it already is a Place ID
  if (/^ChIJ[\w-]{20,}/.test(trimmed)) {
    return trimmed;
  }

  // Check URL query parameters (placeid or place_id)
  try {
    const url = new URL(trimmed);
    const placeIdParam =
      url.searchParams.get("placeid") ||
      url.searchParams.get("place_id") ||
      url.searchParams.get("lrd");

    if (placeIdParam) {
      // Sometimes lrd is 0x...:0x...; if it has a clean ID use it
      const match = placeIdParam.match(/ChIJ[\w-]+/);
      if (match) return match[0];
      return placeIdParam;
    }

    // Check data=!1s pattern in Google Maps URLs
    const dataMatch = trimmed.match(/!1s(ChIJ[\w-]+)/);
    if (dataMatch && dataMatch[1]) {
      return dataMatch[1];
    }
  } catch {
    // If not a valid URL, search anywhere in the string
    const match = trimmed.match(/ChIJ[\w-]+/);
    if (match) return match[0];
  }

  return trimmed;
}

export const TRADE_INFO: Record<
  TradeCategory,
  { label: string; icon: string; avgTicket: number }
> = {
  auto_detailing: { label: "Auto Detailing", icon: "", avgTicket: 180 },
  mechanic: { label: "Auto Mechanic", icon: "", avgTicket: 350 },
  roofing: { label: "Roofing & Siding", icon: "", avgTicket: 6500 },
  plumbing: { label: "Plumbing Services", icon: "", avgTicket: 275 },
  landscaping: { label: "Lawn & Landscaping", icon: "", avgTicket: 220 },
  snow_removal: { label: "Snow Removal", icon: "", avgTicket: 150 },
  hvac: { label: "HVAC & Heating/Air", icon: "", avgTicket: 450 },
  electrician: { label: "Electrical Pro", icon: "", avgTicket: 320 },
  cleaning: { label: "Home / Office Cleaning", icon: "", avgTicket: 190 },
  general_contractor: { label: "General Contractor", icon: "", avgTicket: 2400 },
  other: { label: "Local Trade & Service", icon: "", avgTicket: 250 },
};

const getSafeCurrentTime = () =>
  typeof window !== "undefined"
    ? new Date().getTime()
    : new Date("2026-11-19T18:00:00Z").getTime();

export function formatRelativeDate(isoDateString?: string): string {
  if (!isoDateString) return "Never";
  const date = new Date(isoDateString);
  const now = getSafeCurrentTime();
  const diffHours = Math.floor((now - date.getTime()) / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export function isReminderDue(
  requestSentAt?: string,
  lastRemindedAt?: string,
  status?: string
): boolean {
  if (!requestSentAt) return false;
  if (status === "clicked_google" || status === "private_feedback") return false;
  if (lastRemindedAt) return false; // Already reminded once

  const sentTime = new Date(requestSentAt).getTime();
  const now = getSafeCurrentTime();
  const hoursSince = (now - sentTime) / (1000 * 60 * 60);

  // Consider reminder due if >= 72 hours (Day 3)
  return hoursSince >= 72;
}

export function getDaysRemainingInTrial(
  startDateIso: string,
  durationDays: number
): number {
  const start = new Date(startDateIso).getTime();
  const now = getSafeCurrentTime();
  const elapsedDays = (now - start) / (1000 * 60 * 60 * 24);
  const remaining = Math.ceil(durationDays - elapsedDays);
  return Math.max(0, remaining);
}
