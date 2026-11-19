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
  placeId: string;
  googleReviewUrl?: string;
  onboardingCompleted: boolean;
  trialKey: string;
  trialStartDate: string;
  trialDurationDays: number;
  isSubscribed: boolean;
  subscriptionPlan?: "starter_monthly_29";
  userEmail?: string;
  isAnonymousAuth: boolean;
  autoRemindDay3: boolean;
  b2cReferralReward: number; // $20
  b2cDiscountAmount: number; // $20
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
  serviceDate: string;
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

export type ReferralStatus =
  | "active" // Code active, waiting for friend
  | "job_booked" // Friend booked job with code (pending service & payment)
  | "purchased" // Friend completed & paid for service -> REWARD UNLOCKED for referrer!
  | "credit_applied"; // Referrer's $20 reward credited/paid

export interface B2CReferral {
  id: string;
  referrerName: string;
  referrerPhone?: string;
  referrerEmail?: string;
  code: string; // e.g. DAVID-20
  rewardAmount: number; // $20
  discountAmount: number; // $20
  friendName?: string;
  friendPhone?: string;
  friendEmail?: string;
  friendServiceNeeded?: string;
  friendPreferredDate?: string;
  invoiceAmount?: number; // e.g. $180
  status: ReferralStatus;
  createdAt: string;
  bookedAt?: string;
  purchasedAt?: string;
  rewardAppliedAt?: string;
}

export interface B2BPartnerStats {
  unlocked: boolean;
  reviewsCount: number;
  reviewsTarget: number; // 5
  partnerCode: string;
  referredBusinessesCount: number;
  monthsFreeEarned: number;
}

export interface FunnelStats {
  totalRequestsSent: number;
  funnelViews: number;
  positiveClicks: number;
  negativeFeedbackCount: number;
  referralCodesShared: number;
  googleReviewsAddedEstimate: number;
}
