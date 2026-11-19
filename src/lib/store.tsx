"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BusinessProfile,
  CustomerContact,
  PrivateFeedback,
  B2CReferral,
  B2BPartnerStats,
  FunnelStats,
  TradeCategory,
  ReferralStatus,
} from "@/types";
import {
  generateReferralCode,
  generateTrialKey,
  slugify,
  isReminderDue,
} from "@/lib/utils";
import { authenticateWithTrialKey, upgradeAnonymousToPermanent } from "@/lib/firebase";

const STORAGE_KEY_PREFIX = "vouchr_data_";

const DEFAULT_PROFILE: BusinessProfile = {
  id: "biz_apex_detailing",
  name: "Apex Precision Auto Detailing",
  slug: "apex-detailing",
  trade: "auto_detailing",
  logoUrl: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=150&auto=format&fit=crop&q=80",
  phone: "(555) 392-8172",
  email: "marcus@apexdetailing.com",
  placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
  onboardingCompleted: true,
  trialKey: "TRIAL-8492",
  trialStartDate: "2026-11-16T12:00:00.000Z",
  trialDurationDays: 14,
  isSubscribed: false,
  isAnonymousAuth: true,
  autoRemindDay3: true,
  b2cReferralReward: 20,
  b2cDiscountAmount: 20,
};

const DEFAULT_CONTACTS: CustomerContact[] = [
  {
    id: "c1",
    name: "Alex Martinez",
    phone: "(555) 234-8891",
    email: "alex.m@gmail.com",
    serviceRendered: "Ceramic Coating (2-Year)",
    serviceDate: "2026-11-16",
    status: "reminder_due",
    requestSentAt: "2026-11-16T14:00:00.000Z",
    referralCode: "ALEX-20",
    notes: "Porsche 911 GT3. Handover completed.",
  },
  {
    id: "c2",
    name: "Sarah Jenkins",
    phone: "(555) 872-1029",
    email: "sarah.j@outlook.com",
    serviceRendered: "Interior Deep Extraction & Steam Clean",
    serviceDate: "2026-11-16",
    status: "reminder_due",
    requestSentAt: "2026-11-16T15:00:00.000Z",
    referralCode: "SARAH-20",
    notes: "Subaru Outback.",
  },
  {
    id: "c3",
    name: "David Chen",
    phone: "(555) 441-9283",
    email: "dchen@techcorp.io",
    serviceRendered: "Two-Stage Paint Correction",
    serviceDate: "2026-11-18",
    status: "clicked_google",
    requestSentAt: "2026-11-18T18:00:00.000Z",
    referralCode: "DAVID-20",
    notes: "Posted review on Google Maps.",
  },
  {
    id: "c4",
    name: "Elena Rostova",
    phone: "(555) 782-4410",
    email: "elena.rostova@icloud.com",
    serviceRendered: "Executive Wash & Carnauba Wax",
    serviceDate: "2026-11-17",
    status: "clicked_google",
    requestSentAt: "2026-11-17T11:00:00.000Z",
    referralCode: "ELENA-20",
    notes: "BMW M4 owner.",
  },
  {
    id: "c5",
    name: "Tom Miller",
    phone: "(555) 601-3829",
    email: "tmiller77@yahoo.com",
    serviceRendered: "Headlight Restoration & Polish",
    serviceDate: "2026-11-19",
    status: "private_feedback",
    requestSentAt: "2026-11-19T09:00:00.000Z",
    referralCode: "TOM-20",
    notes: "Submitted private feedback re: rear glass streak.",
  },
  {
    id: "c6",
    name: "Jessica Taylor",
    phone: "(555) 912-3004",
    email: "jtaylor@designstudio.co",
    serviceRendered: "Maintenance Wash & Sealant",
    serviceDate: "2026-11-19",
    status: "request_sent",
    requestSentAt: "2026-11-19T14:00:00.000Z",
    referralCode: "JESS-20",
    notes: "Tesla Model Y.",
  },
  {
    id: "c7",
    name: "Brian O'Connor",
    phone: "(555) 555-1212",
    email: "brian@speedshop.net",
    serviceRendered: "Full Interior Sanitization",
    serviceDate: "2026-11-19",
    status: "not_sent",
    notes: "Ready for review dispatch.",
  },
];

const DEFAULT_FEEDBACK: PrivateFeedback[] = [
  {
    id: "fb_1",
    customerName: "Tom Miller",
    customerPhone: "(555) 601-3829",
    customerEmail: "tmiller77@yahoo.com",
    rating: 2,
    feedback:
      "Headlights look good, but there was a streak on the rear quarter glass when I got home. Wanted to give you a heads up directly rather than post publicly.",
    submittedAt: "2026-11-19T13:00:00.000Z",
    resolved: false,
    contactId: "c5",
  },
];

const DEFAULT_REFERRALS: B2CReferral[] = [
  {
    id: "ref_1",
    referrerName: "David Chen",
    referrerPhone: "(555) 441-9283",
    code: "DAVID-20",
    rewardAmount: 20,
    discountAmount: 20,
    friendName: "Robert Vance",
    friendPhone: "(555) 789-0101",
    friendServiceNeeded: "Full Detail & Ceramic Sealant",
    invoiceAmount: 220,
    status: "purchased", // Service completed and paid -> REWARD UNLOCKED for David Chen!
    createdAt: "2026-11-18T19:00:00.000Z",
    bookedAt: "2026-11-19T09:30:00.000Z",
    purchasedAt: "2026-11-19T15:00:00.000Z",
  },
  {
    id: "ref_2",
    referrerName: "Elena Rostova",
    referrerPhone: "(555) 782-4410",
    code: "ELENA-20",
    rewardAmount: 20,
    discountAmount: 20,
    friendName: "Marcus Brody",
    friendPhone: "(555) 321-9988",
    friendServiceNeeded: "Paint Correction & Polish",
    status: "job_booked", // Friend booked service with code, but hasn't had job done/paid yet -> Reward still LOCKED!
    createdAt: "2026-11-17T12:00:00.000Z",
    bookedAt: "2026-11-19T11:00:00.000Z",
  },
  {
    id: "ref_3",
    referrerName: "Alex Martinez",
    referrerPhone: "(555) 234-8891",
    code: "ALEX-20",
    rewardAmount: 20,
    discountAmount: 20,
    status: "active", // Code generated and active, waiting for a friend
    createdAt: "2026-11-16T14:30:00.000Z",
  },
];

interface AppContextType {
  profile: BusinessProfile;
  contacts: CustomerContact[];
  feedback: PrivateFeedback[];
  referrals: B2CReferral[];
  partnerStats: B2BPartnerStats;
  funnelStats: FunnelStats;
  isLoading: boolean;
  onboardingOpen: boolean;
  upgradeModalOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  setUpgradeModalOpen: (open: boolean) => void;
  loginWithTrialKey: (key: string) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: (data: {
    name: string;
    trade: TradeCategory;
    logoUrl?: string;
    placeId: string;
    googleReviewUrl?: string;
    phone?: string;
    email?: string;
  }) => void;
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  addContact: (contact: Omit<CustomerContact, "id" | "referralCode">) => void;
  updateContact: (id: string, updates: Partial<CustomerContact>) => void;
  deleteContact: (id: string) => void;
  importContacts: (raw: { name: string; phone: string; email: string; service: string }[]) => void;
  sendReviewRequest: (contactId: string) => void;
  triggerDay3Reminder: (contactId: string) => void;
  triggerBatchDay3Reminders: () => number;
  recordFunnelVisit: (slug: string) => void;
  recordPositiveReviewClick: (slug: string, contactId?: string) => void;
  submitPrivateFeedback: (
    slug: string,
    data: { name: string; phone?: string; email?: string; rating: number; feedback: string }
  ) => void;
  resolveFeedback: (feedbackId: string) => void;
  createB2CReferral: (referrerName: string, phone?: string, email?: string) => B2CReferral;
  bookFriendJob: (
    code: string,
    data: { name: string; phone: string; email?: string; serviceNeeded?: string; preferredDate?: string }
  ) => { success: boolean; referral?: B2CReferral; error?: string };
  markJobPurchased: (referralId: string, invoiceAmount: number) => void;
  applyReferralCredit: (referralId: string) => void;
  upgradeToPaidSubscription: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  resetToDemo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<BusinessProfile>(DEFAULT_PROFILE);
  const [contacts, setContacts] = useState<CustomerContact[]>(DEFAULT_CONTACTS);
  const [feedback, setFeedback] = useState<PrivateFeedback[]>(DEFAULT_FEEDBACK);
  const [referrals, setReferrals] = useState<B2CReferral[]>(DEFAULT_REFERRALS);
  const [funnelStats, setFunnelStats] = useState<FunnelStats>({
    totalRequestsSent: 14,
    funnelViews: 19,
    positiveClicks: 4,
    negativeFeedbackCount: 1,
    referralCodesShared: 6,
    googleReviewsAddedEstimate: 4,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("vouchr_current_trial_key") || "TRIAL-8492";
      const savedData = localStorage.getItem(STORAGE_KEY_PREFIX + savedKey);

      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.contacts) setContacts(parsed.contacts);
        if (parsed.feedback) setFeedback(parsed.feedback);
        if (parsed.referrals) setReferrals(parsed.referrals);
        if (parsed.funnelStats) setFunnelStats(parsed.funnelStats);
      } else {
        saveStateToStorage(DEFAULT_PROFILE.trialKey, {
          profile: DEFAULT_PROFILE,
          contacts: DEFAULT_CONTACTS,
          feedback: DEFAULT_FEEDBACK,
          referrals: DEFAULT_REFERRALS,
          funnelStats,
        });
      }
    } catch (e) {
      console.warn("Storage loading error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveStateToStorage = (key: string, data: Record<string, unknown>) => {
    try {
      localStorage.setItem("vouchr_current_trial_key", key);
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
    } catch (e) {
      console.warn("Error saving to localStorage", e);
    }
  };

  useEffect(() => {
    if (!isLoading && profile?.trialKey) {
      saveStateToStorage(profile.trialKey, {
        profile,
        contacts,
        feedback,
        referrals,
        funnelStats,
      });
    }
  }, [profile, contacts, feedback, referrals, funnelStats, isLoading]);

  const reviewsCount = funnelStats.positiveClicks;
  const partnerStats: B2BPartnerStats = {
    unlocked: reviewsCount >= 5,
    reviewsCount,
    reviewsTarget: 5,
    partnerCode: `PARTNER-${profile.slug.toUpperCase().slice(0, 8)}`,
    referredBusinessesCount: reviewsCount >= 5 ? 2 : 0,
    monthsFreeEarned: reviewsCount >= 5 ? 2 : 0,
  };

  const loginWithTrialKey = async (trialKey: string): Promise<boolean> => {
    const cleanKey = trialKey.trim().toUpperCase();
    if (!cleanKey) return false;

    await authenticateWithTrialKey(cleanKey);

    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + cleanKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed.profile);
      setContacts(parsed.contacts || []);
      setFeedback(parsed.feedback || []);
      setReferrals(parsed.referrals || []);
      setFunnelStats(parsed.funnelStats || funnelStats);
      if (!parsed.profile.onboardingCompleted) {
        setOnboardingOpen(true);
      }
    } else {
      const newProfile: BusinessProfile = {
        id: `biz_${cleanKey.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        name: "",
        slug: "",
        trade: "auto_detailing",
        placeId: "",
        onboardingCompleted: false,
        trialKey: cleanKey,
        trialStartDate: "2026-11-19T18:00:00.000Z",
        trialDurationDays: 14,
        isSubscribed: false,
        isAnonymousAuth: true,
        autoRemindDay3: true,
        b2cReferralReward: 20,
        b2cDiscountAmount: 20,
      };
      setProfile(newProfile);
      setContacts([]);
      setFeedback([]);
      setReferrals([]);
      setFunnelStats({
        totalRequestsSent: 0,
        funnelViews: 0,
        positiveClicks: 0,
        negativeFeedbackCount: 0,
        referralCodesShared: 0,
        googleReviewsAddedEstimate: 0,
      });
      setOnboardingOpen(true);
    }

    localStorage.setItem("vouchr_current_trial_key", cleanKey);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("vouchr_current_trial_key");
    setProfile(DEFAULT_PROFILE);
    setContacts(DEFAULT_CONTACTS);
    setFeedback(DEFAULT_FEEDBACK);
    setReferrals(DEFAULT_REFERRALS);
  };

  const completeOnboarding = (data: {
    name: string;
    trade: TradeCategory;
    logoUrl?: string;
    placeId: string;
    googleReviewUrl?: string;
    phone?: string;
    email?: string;
  }) => {
    const generatedSlug = slugify(data.name) || "my-service";
    const googleReviewUrl =
      data.googleReviewUrl?.trim() ||
      (data.placeId
        ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(data.placeId.trim())}`
        : "");

    setProfile((prev) => ({
      ...prev,
      name: data.name,
      slug: generatedSlug,
      trade: data.trade,
      logoUrl: data.logoUrl || prev.logoUrl,
      placeId: data.placeId,
      googleReviewUrl,
      phone: data.phone || prev.phone,
      email: data.email || prev.email,
      onboardingCompleted: true,
    }));
    setOnboardingOpen(false);
  };

  const updateProfile = (updates: Partial<BusinessProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addContact = (contact: Omit<CustomerContact, "id" | "referralCode">) => {
    const refCode = generateReferralCode(contact.name);
    const newContact: CustomerContact = {
      ...contact,
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      referralCode: refCode,
    };
    setContacts((prev) => [newContact, ...prev]);
  };

  const updateContact = (id: string, updates: Partial<CustomerContact>) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const importContacts = (
    raw: { name: string; phone: string; email: string; service: string }[]
  ) => {
    const today = "2026-11-19";
    const newItems: CustomerContact[] = raw.map((r, i) => ({
      id: `c_import_${Date.now()}_${i}`,
      name: r.name || "Customer",
      phone: r.phone || "",
      email: r.email || "",
      serviceRendered: r.service || "Service",
      serviceDate: today,
      status: "not_sent",
      referralCode: generateReferralCode(r.name || "Customer"),
    }));
    setContacts((prev) => [...newItems, ...prev]);
  };

  const sendReviewRequest = (contactId: string) => {
    const now = "2026-11-19T18:00:00.000Z";
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? { ...c, status: "request_sent", requestSentAt: now }
          : c
      )
    );
    setFunnelStats((prev) => ({
      ...prev,
      totalRequestsSent: prev.totalRequestsSent + 1,
    }));
  };

  const triggerDay3Reminder = (contactId: string) => {
    const now = "2026-11-19T18:00:00.000Z";
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? { ...c, status: "reminder_sent", lastRemindedAt: now }
          : c
      )
    );
  };

  const triggerBatchDay3Reminders = (): number => {
    const now = "2026-11-19T18:00:00.000Z";
    let count = 0;
    setContacts((prev) =>
      prev.map((c) => {
        if (c.status === "reminder_due" || isReminderDue(c.requestSentAt, c.lastRemindedAt, c.status)) {
          count++;
          return { ...c, status: "reminder_sent", lastRemindedAt: now };
        }
        return c;
      })
    );
    return count;
  };

  const recordFunnelVisit = (slug: string) => {
    setFunnelStats((prev) => ({
      ...prev,
      funnelViews: prev.funnelViews + 1,
    }));
  };

  const recordPositiveReviewClick = (slug: string, contactId?: string) => {
    setFunnelStats((prev) => ({
      ...prev,
      positiveClicks: prev.positiveClicks + 1,
      googleReviewsAddedEstimate: prev.googleReviewsAddedEstimate + 1,
    }));

    if (contactId) {
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, status: "clicked_google" } : c))
      );
    }
  };

  const submitPrivateFeedback = (
    slug: string,
    data: { name: string; phone?: string; email?: string; rating: number; feedback: string }
  ) => {
    const newFeedback: PrivateFeedback = {
      id: `fb_${Date.now()}`,
      customerName: data.name,
      customerPhone: data.phone,
      customerEmail: data.email,
      rating: data.rating,
      feedback: data.feedback,
      submittedAt: "2026-11-19T18:00:00.000Z",
      resolved: false,
    };

    setFeedback((prev) => [newFeedback, ...prev]);
    setFunnelStats((prev) => ({
      ...prev,
      negativeFeedbackCount: prev.negativeFeedbackCount + 1,
    }));

    if (data.phone || data.email) {
      setContacts((prev) =>
        prev.map((c) =>
          (data.phone && c.phone && c.phone.includes(data.phone.slice(-4))) ||
          (data.email && c.email.toLowerCase() === data.email.toLowerCase())
            ? { ...c, status: "private_feedback" }
            : c
        )
      );
    }
  };

  const resolveFeedback = (feedbackId: string) => {
    setFeedback((prev) =>
      prev.map((f) => (f.id === feedbackId ? { ...f, resolved: true } : f))
    );
  };

  // Create B2C Referral code for a customer
  const createB2CReferral = (
    referrerName: string,
    phone?: string,
    email?: string
  ): B2CReferral => {
    const code = generateReferralCode(referrerName);
    const newRef: B2CReferral = {
      id: `ref_${Date.now()}`,
      referrerName,
      referrerPhone: phone,
      referrerEmail: email,
      code,
      rewardAmount: profile.b2cReferralReward || 20,
      discountAmount: profile.b2cDiscountAmount || 20,
      status: "active",
      createdAt: "2026-11-19T18:00:00.000Z",
    };
    setReferrals((prev) => [newRef, ...prev]);
    setFunnelStats((prev) => ({
      ...prev,
      referralCodesShared: prev.referralCodesShared + 1,
    }));
    return newRef;
  };

  // Friend submits booking with code -> status becomes 'job_booked'.
  // Notice: The referrer reward is still LOCKED until the friend's job is purchased & paid!
  const bookFriendJob = (
    code: string,
    data: { name: string; phone: string; email?: string; serviceNeeded?: string; preferredDate?: string }
  ): { success: boolean; referral?: B2CReferral; error?: string } => {
    const upperCode = code.trim().toUpperCase();
    let targetRef: B2CReferral | undefined = referrals.find(
      (r) => r.code.toUpperCase() === upperCode
    );

    if (!targetRef) {
      // Create on the fly if valid code format
      targetRef = {
        id: `ref_${Date.now()}`,
        referrerName: "Client",
        code: upperCode,
        rewardAmount: profile.b2cReferralReward || 20,
        discountAmount: profile.b2cDiscountAmount || 20,
        status: "active",
        createdAt: "2026-11-19T18:00:00.000Z",
      };
    }

    const updatedRef: B2CReferral = {
      ...targetRef,
      friendName: data.name,
      friendPhone: data.phone,
      friendEmail: data.email,
      friendServiceNeeded: data.serviceNeeded || "General Service",
      friendPreferredDate: data.preferredDate,
      status: "job_booked", // PENDING PURCHASE: Reward is locked until invoice is paid!
      bookedAt: "2026-11-19T18:00:00.000Z",
    };

    setReferrals((prev) => {
      const exists = prev.some((r) => r.id === updatedRef.id);
      return exists
        ? prev.map((r) => (r.id === updatedRef.id ? updatedRef : r))
        : [updatedRef, ...prev];
    });

    return { success: true, referral: updatedRef };
  };

  // BUSINESS OWNER ACTION: Mark friend's job completed & paid -> OFFICIALLY UNLOCKS THE REWARD!
  const markJobPurchased = (referralId: string, invoiceAmount: number) => {
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id === referralId) {
          return {
            ...r,
            status: "purchased", // UNLOCKED!
            invoiceAmount,
            purchasedAt: "2026-11-19T18:00:00.000Z",
          };
        }
        return r;
      })
    );
  };

  // Apply the $20 credit to the referrer's next invoice
  const applyReferralCredit = (referralId: string) => {
    setReferrals((prev) =>
      prev.map((r) =>
        r.id === referralId
          ? { ...r, status: "credit_applied", rewardAppliedAt: "2026-11-19T18:00:00.000Z" }
          : r
      )
    );
  };

  const upgradeToPaidSubscription = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await upgradeAnonymousToPermanent(email, pass);
    if (result.success) {
      setProfile((prev) => ({
        ...prev,
        isSubscribed: true,
        subscriptionPlan: "starter_monthly_29",
        userEmail: email,
        isAnonymousAuth: false,
      }));
      setUpgradeModalOpen(false);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const resetToDemo = () => {
    setProfile(DEFAULT_PROFILE);
    setContacts(DEFAULT_CONTACTS);
    setFeedback(DEFAULT_FEEDBACK);
    setReferrals(DEFAULT_REFERRALS);
    setFunnelStats({
      totalRequestsSent: 14,
      funnelViews: 19,
      positiveClicks: 4,
      negativeFeedbackCount: 1,
      referralCodesShared: 6,
      googleReviewsAddedEstimate: 4,
    });
    localStorage.removeItem(STORAGE_KEY_PREFIX + DEFAULT_PROFILE.trialKey);
    localStorage.setItem("vouchr_current_trial_key", DEFAULT_PROFILE.trialKey);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        contacts,
        feedback,
        referrals,
        partnerStats,
        funnelStats,
        isLoading,
        onboardingOpen,
        upgradeModalOpen,
        setOnboardingOpen,
        setUpgradeModalOpen,
        loginWithTrialKey,
        logout,
        completeOnboarding,
        updateProfile,
        addContact,
        updateContact,
        deleteContact,
        importContacts,
        sendReviewRequest,
        triggerDay3Reminder,
        triggerBatchDay3Reminders,
        recordFunnelVisit,
        recordPositiveReviewClick,
        submitPrivateFeedback,
        resolveFeedback,
        createB2CReferral,
        bookFriendJob,
        markJobPurchased,
        applyReferralCredit,
        upgradeToPaidSubscription,
        resetToDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
