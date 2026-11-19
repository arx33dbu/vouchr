"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { buildGoogleReviewUrl } from "@/lib/utils";
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ShieldCheck,
  Share2,
  Gift,
  CheckCircle2,
  Send,
  Star,
  Copy,
  Check,
  MessageSquare,
} from "lucide-react";
import confetti from "canvas-confetti";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function ReviewFunnelContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const searchParams = useSearchParams();
  const contactId = searchParams.get("c") || undefined;
  const passedRefCode = searchParams.get("ref") || undefined;

  const {
    profile,
    contacts,
    recordFunnelVisit,
    recordPositiveReviewClick,
    submitPrivateFeedback,
  } = useApp();

  const [step, setStep] = useState<"prompt" | "positive" | "negative">("prompt");
  const [rating, setRating] = useState(2);
  const [feedbackText, setFeedbackText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto-fill customer info if contact ID matches
  useEffect(() => {
    if (contactId && contacts.length > 0) {
      const match = contacts.find((c) => c.id === contactId);
      if (match) {
        setCustomerName(match.name);
        setCustomerPhone(match.phone);
      }
    }
  }, [contactId, contacts]);

  // Track visit on mount
  useEffect(() => {
    recordFunnelVisit(slug);
  }, [slug]);

  const businessName = profile.name || "Our Local Business";
  const googleReviewUrl =
    profile.googleReviewUrl ||
    buildGoogleReviewUrl(profile.placeId || "ChIJN1t_tDeuEmsRUsoyG83frY4");

  const referralCode =
    passedRefCode ||
    (contactId && contacts.find((c) => c.id === contactId)?.referralCode) ||
    "FRIEND-20";

  // 👍 High-Intent Positive Experience
  const handleThumbsUp = () => {
    recordPositiveReviewClick(slug, contactId);
    setStep("positive");

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Auto-redirect to Google after 2.5 seconds to give user time to see the thank you & referral code
    setTimeout(() => {
      window.open(googleReviewUrl, "_blank");
    }, 2500);
  };

  // 👎 Intercept Negative Experience Privately
  const handleThumbsDown = () => {
    setStep("negative");
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    submitPrivateFeedback(slug, {
      name: customerName.trim() || "Customer",
      phone: customerPhone.trim(),
      rating,
      feedback: feedbackText.trim(),
    });

    setFeedbackSubmitted(true);
  };

  const copyReferralCode = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const voucherUrl = `${origin}/referral/${referralCode}`;
    navigator.clipboard.writeText(
      `Hey! Use my referral code ${referralCode} to get $${profile.b2cDiscountAmount} off at ${businessName}: ${voucherUrl}`
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top micro brand */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-slate-500 py-2">
        <span className="font-semibold text-slate-400">{businessName}</span>
        <span className="flex items-center gap-1 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Verified Customer Review
        </span>
      </header>

      {/* Main Funnel Card */}
      <main className="max-w-md w-full mx-auto my-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-b-full" />

        {/* Business Logo & Greeting */}
        <div className="mb-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border-2 border-slate-700 shadow-xl bg-slate-950 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                profile.logoUrl ||
                "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=150&auto=format&fit=crop&q=80"
              }
              alt={businessName}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {businessName}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Thank you for trusting us with your service!
          </p>
        </div>

        {/* STEP 1: Main Thumb Prompt */}
        {step === "prompt" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-white">
                How was your experience with us?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your feedback helps our local team continue providing great service.
              </p>
            </div>

            {/* 👍 and 👎 Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleThumbsUp}
                className="p-5 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-600/10 border-2 border-emerald-500/30 hover:border-emerald-500 text-emerald-300 font-bold flex flex-col items-center justify-center gap-3 transition-all transform active:scale-95 group shadow-lg shadow-emerald-500/5 cursor-pointer"
              >
                <span className="text-4xl group-hover:scale-125 transition-transform duration-200">
                  👍
                </span>
                <span className="text-sm font-bold">Great! Loved it</span>
              </button>

              <button
                onClick={handleThumbsDown}
                className="p-5 rounded-2xl bg-gradient-to-b from-rose-500/20 to-rose-600/10 border-2 border-rose-500/30 hover:border-rose-500 text-rose-300 font-bold flex flex-col items-center justify-center gap-3 transition-all transform active:scale-95 group shadow-lg shadow-rose-500/5 cursor-pointer"
              >
                <span className="text-4xl group-hover:scale-125 transition-transform duration-200">
                  👎
                </span>
                <span className="text-sm font-bold">Could be better</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: POSITIVE FLOW (Redirects to Google Review + B2C Referral) */}
        {step === "positive" && (
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              🎉
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Thank you so much!
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Opening Google Maps to leave your 5-star review now...
              </p>
            </div>

            {/* Direct Google Review Button */}
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>Tap to Open Google Review</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* B2C Referral Card Loop */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-left space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Gift className="w-4 h-4" />
                <span>Double Referral Reward for You</span>
              </div>
              <p className="text-xs text-slate-300">
                Give a friend <strong className="text-emerald-400">${profile.b2cDiscountAmount} off</strong> their first service, and you&apos;ll get <strong className="text-emerald-400">${profile.b2cReferralReward} back</strong>!
              </p>

              <div className="flex items-center justify-between gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-mono font-bold text-amber-400 text-xs pl-2">
                  {referralCode}
                </span>
                <button
                  onClick={copyReferralCode}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Share $20 Voucher</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: NEGATIVE FLOW (Private Feedback Form + Google Fallback) */}
        {step === "negative" && (
          <div className="space-y-4 text-left animate-in zoom-in-95 duration-200">
            {feedbackSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  ✉️
                </div>
                <h3 className="text-base font-bold text-white">
                  Message Sent Directly to the Owner
                </h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Thank you for letting us know. The owner will review your note personally and reach out to make things right.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                <div className="text-center mb-2">
                  <h3 className="text-base font-bold text-rose-300">
                    We&apos;re so sorry we didn&apos;t meet your expectations.
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Please let the owner know what happened so we can make it right:
                  </p>
                </div>

                {/* Rating selection (1-3 stars) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all ${
                          rating === star
                            ? "bg-amber-500/20 border-amber-500 text-amber-300"
                            : "bg-slate-950 border-slate-800 text-slate-500"
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{star} Star{star > 1 ? "s" : ""}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    What could we have done better? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what went wrong..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Your Phone (to follow up)
                    </label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Private Feedback to Owner</span>
                </button>

                {/* Submitting to Google Fallback (Strict Google Review Policy Compliance) */}
                <div className="text-center pt-3 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-400">
                    We value open and honest feedback. If you still prefer to post a public review directly on Google Maps, you may{" "}
                    <a
                      href={googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>click here</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto text-center text-[10px] text-slate-600 py-3">
        Protected by Vouchr Smart Review Funnel • Powered by Local Pro Services
      </footer>
    </div>
  );
}

export default function ReviewFunnelPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-400 text-xs flex items-center justify-center">
          Loading review funnel...
        </div>
      }
    >
      <ReviewFunnelContent {...props} />
    </Suspense>
  );
}
