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

const INITIAL_PROFILE: BusinessProfile = {
  id: "",
  name: "",
  slug: "",
  trade: "auto_detailing",
  logoUrl: "",
  phone: "",
  email: "",
  placeId: "",
  googleReviewUrl: "",
  onboardingCompleted: false,
  trialKey: "",
  trialStartDate: "",
  trialDurationDays: 14,
  isSubscribed: false,
  isAnonymousAuth: true,
  autoRemindDay3: true,
  b2cReferralReward: 20,
  b2cDiscountAmount: 20,
};

const INITIAL_FUNNEL_STATS: FunnelStats = {
  totalRequestsSent: 0,
  funnelViews: 0,
  positiveClicks: 0,
  negativeFeedbackCount: 0,
  referralCodesShared: 0,
  googleReviewsAddedEstimate: 0,
};

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
  resetToClean: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<BusinessProfile>(INITIAL_PROFILE);
  const [contacts, setContacts] = useState<CustomerContact[]>([]);
  const [feedback, setFeedback] = useState<PrivateFeedback[]>([]);
  const [referrals, setReferrals] = useState<B2CReferral[]>([]);
  const [funnelStats, setFunnelStats] = useState<FunnelStats>(INITIAL_FUNNEL_STATS);

  const [isLoading, setIsLoading] = useState(true);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;

      // Purge old prototype mock data from previous sessions if present
      localStorage.removeItem(STORAGE_KEY_PREFIX + "TRIAL-8492");
      const currentStoredKey = localStorage.getItem("vouchr_current_trial_key");
      if (currentStoredKey === "TRIAL-8492") {
        localStorage.removeItem("vouchr_current_trial_key");
      }

      const activeKey = localStorage.getItem("vouchr_current_trial_key");

      if (activeKey) {
        const savedData = localStorage.getItem(STORAGE_KEY_PREFIX + activeKey);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.profile && parsed.profile.id !== "biz_apex_detailing") {
            setProfile(parsed.profile);
            setContacts(parsed.contacts || []);
            setFeedback(parsed.feedback || []);
            setReferrals(parsed.referrals || []);
            setFunnelStats(parsed.funnelStats || INITIAL_FUNNEL_STATS);
            if (!parsed.profile.onboardingCompleted) {
              setOnboardingOpen(true);
            }
            return;
          }
        }
      }

      // Fresh production initialization: generate unique trial key and trigger onboarding
      const newTrialKey = generateTrialKey();
      const freshProfile: BusinessProfile = {
        id: `biz_${newTrialKey.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        name: "",
        slug: "",
        trade: "auto_detailing",
        logoUrl: "",
        phone: "",
        email: "",
        placeId: "",
        googleReviewUrl: "",
        onboardingCompleted: false,
        trialKey: newTrialKey,
        trialStartDate: new Date().toISOString(),
        trialDurationDays: 14,
        isSubscribed: false,
        isAnonymousAuth: true,
        autoRemindDay3: true,
        b2cReferralReward: 20,
        b2cDiscountAmount: 20,
      };

      setProfile(freshProfile);
      setContacts([]);
      setFeedback([]);
      setReferrals([]);
      setFunnelStats(INITIAL_FUNNEL_STATS);
      saveStateToStorage(newTrialKey, {
        profile: freshProfile,
        contacts: [],
        feedback: [],
        referrals: [],
        funnelStats: INITIAL_FUNNEL_STATS,
      });
      setOnboardingOpen(true);
    } catch (e) {
      console.warn("Storage loading error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveStateToStorage = (key: string, data: Record<string, unknown>) => {
    try {
      if (typeof window === "undefined" || !key) return;
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
    partnerCode: profile.slug ? `PARTNER-${profile.slug.toUpperCase().slice(0, 8)}` : "PARTNER",
    referredBusinessesCount: 0,
    monthsFreeEarned: 0,
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
      setFunnelStats(parsed.funnelStats || INITIAL_FUNNEL_STATS);
      if (!parsed.profile.onboardingCompleted) {
        setOnboardingOpen(true);
      }
    } else {
      const newProfile: BusinessProfile = {
        id: `biz_${cleanKey.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        name: "",
        slug: "",
        trade: "auto_detailing",
        logoUrl: "",
        phone: "",
        email: "",
        placeId: "",
        googleReviewUrl: "",
        onboardingCompleted: false,
        trialKey: cleanKey,
        trialStartDate: new Date().toISOString(),
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
      setFunnelStats(INITIAL_FUNNEL_STATS);
      setOnboardingOpen(true);
    }

    localStorage.setItem("vouchr_current_trial_key", cleanKey);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("vouchr_current_trial_key");
    const freshKey = generateTrialKey();
    const freshProfile = {
      ...INITIAL_PROFILE,
      id: `biz_${freshKey.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      trialKey: freshKey,
      trialStartDate: new Date().toISOString(),
    };
    setProfile(freshProfile);
    setContacts([]);
    setFeedback([]);
    setReferrals([]);
    setFunnelStats(INITIAL_FUNNEL_STATS);
    setOnboardingOpen(true);
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
    const slug = slugify(data.name) || `biz-${profile.trialKey.toLowerCase()}`;
    const googleReviewUrl =
      data.googleReviewUrl ||
      (data.placeId ? `https://search.google.com/local/writereview?placeid=${data.placeId}` : "");

    const updated: BusinessProfile = {
      ...profile,
      name: data.name,
      slug,
      trade: data.trade,
      logoUrl: data.logoUrl || "",
      placeId: data.placeId,
      googleReviewUrl,
      phone: data.phone || "",
      email: data.email || "",
      onboardingCompleted: true,
    };

    setProfile(updated);
    setOnboardingOpen(false);
  };

  const updateProfile = (updates: Partial<BusinessProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const addContact = (contact: Omit<CustomerContact, "id" | "referralCode">) => {
    const referralCode = generateReferralCode(contact.name);
    const newContact: CustomerContact = {
      ...contact,
      id: `c_${Date.now()}`,
      referralCode,
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
    const today = new Date().toISOString().split("T")[0];
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
    const now = new Date().toISOString();
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
    const now = new Date().toISOString();
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? { ...c, status: "reminder_sent", lastRemindedAt: now }
          : c
      )
    );
  };

  const triggerBatchDay3Reminders = (): number => {
    const now = new Date().toISOString();
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
      submittedAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
    };
    setReferrals((prev) => [newRef, ...prev]);
    setFunnelStats((prev) => ({
      ...prev,
      referralCodesShared: prev.referralCodesShared + 1,
    }));
    return newRef;
  };

  const bookFriendJob = (
    code: string,
    data: { name: string; phone: string; email?: string; serviceNeeded?: string; preferredDate?: string }
  ): { success: boolean; referral?: B2CReferral; error?: string } => {
    const upperCode = code.trim().toUpperCase();
    let targetRef: B2CReferral | undefined = referrals.find(
      (r) => r.code.toUpperCase() === upperCode
    );

    if (!targetRef) {
      targetRef = {
        id: `ref_${Date.now()}`,
        referrerName: "Client",
        code: upperCode,
        rewardAmount: profile.b2cReferralReward || 20,
        discountAmount: profile.b2cDiscountAmount || 20,
        status: "active",
        createdAt: new Date().toISOString(),
      };
    }

    const updatedRef: B2CReferral = {
      ...targetRef,
      friendName: data.name,
      friendPhone: data.phone,
      friendEmail: data.email,
      friendServiceNeeded: data.serviceNeeded || "General Service",
      friendPreferredDate: data.preferredDate,
      status: "job_booked", // Reward locked until friend's job is purchased & paid!
      bookedAt: new Date().toISOString(),
    };

    setReferrals((prev) => {
      const exists = prev.some((r) => r.id === updatedRef.id);
      return exists
        ? prev.map((r) => (r.id === updatedRef.id ? updatedRef : r))
        : [updatedRef, ...prev];
    });

    return { success: true, referral: updatedRef };
  };

  const markJobPurchased = (referralId: string, invoiceAmount: number) => {
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id === referralId) {
          return {
            ...r,
            status: "purchased", // UNLOCKED upon completed purchase!
            invoiceAmount,
            purchasedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
  };

  const applyReferralCredit = (referralId: string) => {
    setReferrals((prev) =>
      prev.map((r) =>
        r.id === referralId
          ? { ...r, status: "credit_applied", rewardAppliedAt: new Date().toISOString() }
          : r
      )
    );
  };

  const upgradeToPaidSubscription = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await upgradeAnonymousToPermanent(email, pass);
    if (!res.success) {
      return { success: false, error: res.error };
    }

    setProfile((prev) => ({
      ...prev,
      email,
      isSubscribed: true,
      isAnonymousAuth: false,
    }));
    setUpgradeModalOpen(false);
    return { success: true };
  };

  const resetToClean = () => {
    localStorage.removeItem("vouchr_current_trial_key");
    const freshKey = generateTrialKey();
    const freshProfile = {
      ...INITIAL_PROFILE,
      id: `biz_${freshKey.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      trialKey: freshKey,
      trialStartDate: new Date().toISOString(),
    };
    setProfile(freshProfile);
    setContacts([]);
    setFeedback([]);
    setReferrals([]);
    setFunnelStats(INITIAL_FUNNEL_STATS);
    setOnboardingOpen(true);
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
        resetToClean,
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
