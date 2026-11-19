export type TradeCategory =
  | "auto_detailing"
  | "mechanic"
  | "roofing"
  | "plumbing"
  | "landscaping"
  | "snow_removal"
  | "hvac"
  | "electrician"
  | "cleaning"
  | "general_contractor"
  | "other";

export interface BusinessProfile {
  id: string;
  name: string;
  slug: string;
  trade: TradeCategory;
  logoUrl?: string;
  phone?: string;
  email?: string;
  placeId: string; // Google Place ID e.g. ChIJ...
  googleReviewUrl?: string;
  onboardingCompleted: boolean;
  trialKey: string;
  trialStartDate: string; // ISO date
  trialDurationDays: number; // 7 or 14
  isSubscribed: boolean;
  subscriptionPlan?: "starter_monthly_29";
  userEmail?: string;
  isAnonymousAuth: boolean;
  autoRemindDay3: boolean;
  b2cReferralReward: number; // e.g. 20 ($20)
  b2cDiscountAmount: number; // e.g. 20 ($20)
}

export type ContactStatus =
  | "not_sent"
  | "request_sent"
  | "opened"
  | "clicked_google"
  | "private_feedback"
  | "reminder_due"
  | "reminder_sent";

export interface CustomerContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceRendered: string;
  serviceDate: string; // YYYY-MM-DD
  status: ContactStatus;
  requestSentAt?: string;
  lastRemindedAt?: string;
  referralCode?: string;
  notes?: string;
}

export interface PrivateFeedback {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  rating: number; // 1 to 3
  feedback: string;
  submittedAt: string;
  resolved: boolean;
  contactId?: string;
}

export interface B2CReferral {
  id: string;
  referrerName: string;
  referrerPhone?: string;
  referrerEmail?: string;
  code: string; // e.g. ALEX-20
  rewardAmount: number; // $20
  discountAmount: number; // $20
  friendName?: string;
  friendPhone?: string;
  status: "active" | "redeemed" | "reward_paid";
  createdAt: string;
  redeemedAt?: string;
}

export interface B2BPartnerStats {
  unlocked: boolean;
  reviewsCount: number;
  reviewsTarget: number; // 5
  partnerCode: string; // e.g. PARTNER-APEX
  referredBusinessesCount: number;
  monthsFreeEarned: number;
}

export interface FunnelStats {
  totalRequestsSent: number;
  funnelViews: number;
  positiveClicks: number; // Thumb Up -> Google Review
  negativeFeedbackCount: number; // Thumb Down -> Private
  referralCodesShared: number;
  googleReviewsAddedEstimate: number;
}
