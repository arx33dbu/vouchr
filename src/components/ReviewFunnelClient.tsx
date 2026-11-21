"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { buildGoogleReviewUrl } from "@/lib/utils";
import {
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ShieldCheck,
  Star,
  Copy,
  Check,
} from "lucide-react";

interface ReviewFunnelClientProps {
  slug: string;
}

function ReviewFunnelInner({ slug }: ReviewFunnelClientProps) {
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

  useEffect(() => {
    if (contactId && contacts.length > 0) {
      const match = contacts.find((c) => c.id === contactId);
      if (match) {
        setCustomerName(match.name);
        setCustomerPhone(match.phone);
      }
    }
  }, [contactId, contacts]);

  useEffect(() => {
    recordFunnelVisit(slug);
  }, [slug, recordFunnelVisit]);

  const businessName = profile.name || "Our Local Business";
  const googleReviewUrl =
    profile.googleReviewUrl ||
    buildGoogleReviewUrl(profile.placeId || "ChIJN1t_tDeuEmsRUsoyG83frY4");

  const referralCode =
    passedRefCode ||
    (contactId && contacts.find((c) => c.id === contactId)?.referralCode) ||
    "FRIEND-20";

  const handleThumbsUp = () => {
    recordPositiveReviewClick(slug, contactId);
    setStep("positive");
    setTimeout(() => {
      window.open(googleReviewUrl, "_blank");
    }, 2000);
  };

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
      `Hey, I had service done with ${businessName}. Here is a $${profile.b2cDiscountAmount} discount voucher towards your first service: ${voucherUrl}`
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Header */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-zinc-400 py-3">
        <span className="font-medium text-zinc-300">{businessName}</span>
        <span className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
          Verified Customer Feedback
        </span>
      </header>

      {/* Main Review Card */}
      <main className="max-w-md w-full mx-auto my-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm p-6 sm:p-8 text-center">
        {/* Business Logo & Heading */}
        <div className="mb-6">
          {profile.logoUrl && (
            <div className="w-16 h-16 rounded-xl overflow-hidden mx-auto border border-zinc-800 bg-zinc-950 mb-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.logoUrl}
                alt={businessName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-xl font-bold text-white tracking-tight">
            {businessName}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Thank you for trusting our team with your recent service.
          </p>
        </div>

        {/* STEP 1: Main Prompt */}
        {step === "prompt" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <h2 className="text-sm sm:text-base font-semibold text-white">
                How was your experience with us?
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Please select an option below:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <button
                onClick={handleThumbsUp}
                className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-medium flex flex-col items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <ThumbsUp className="w-6 h-6 text-emerald-400" />
                <span className="text-xs font-semibold">Great Experience</span>
              </button>

              <button
                onClick={handleThumbsDown}
                className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-medium flex flex-col items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <ThumbsDown className="w-6 h-6 text-zinc-400" />
                <span className="text-xs font-semibold">Could Be Better</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Positive Experience */}
        {step === "positive" && (
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-center">
              <h2 className="text-sm font-semibold text-white">
                Thank you for your feedback!
              </h2>
              <p className="text-xs text-zinc-400">
                Opening Google Maps to share your review with our team...
              </p>
            </div>

            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Write Review on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* B2C Referral Section with explicit Purchase Rule */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 text-xs">
              <div className="font-semibold text-zinc-200 flex items-center justify-between">
                <span>Client Referral Privilege</span>
                <span className="font-mono text-zinc-400">{referralCode}</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Send your referral link to friends or neighbors. They receive <strong>${profile.b2cDiscountAmount} off</strong> their first service. Once their job is completed and paid, you unlock a <strong>${profile.b2cReferralReward} credit</strong> on your next service invoice.
              </p>

              <button
                onClick={copyReferralCode}
                className="w-full py-2 px-3 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Link Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy $20 Referral Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Private Feedback Intercept */}
        {step === "negative" && (
          <div className="space-y-4 text-left">
            {feedbackSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <h3 className="text-sm font-semibold text-white">
                  Thank you for your candid feedback.
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your message has been delivered directly to the owner. We will follow up to ensure your concerns are properly addressed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-zinc-200">
                    We&apos;re sorry your experience fell short.
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Please let the owner know directly so we can resolve this:
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                          rating === star
                            ? "bg-zinc-800 border-zinc-600 text-white"
                            : "bg-zinc-950 border-zinc-800 text-zinc-500"
                        }`}
                      >
                        <Star className="w-3 h-3 fill-current" />
                        <span>{star}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    What could we have done better? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Details about your service..."
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Name"
                      className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Submit Private Feedback to Owner
                </button>

                {/* Google Policy Compliance Link */}
                <div className="text-center pt-2">
                  <p className="text-[11px] text-zinc-500">
                    If you prefer to leave a public review on Google Maps instead,{" "}
                    <a
                      href={googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white underline inline-flex items-center gap-0.5"
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

      <footer className="max-w-md w-full mx-auto text-center text-[11px] text-zinc-600 py-3">
        {businessName} • Client Review Funnel
      </footer>
    </div>
  );
}

export default function ReviewFunnelClient({ slug }: ReviewFunnelClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-zinc-400 text-xs flex items-center justify-center">
          Loading review funnel...
        </div>
      }
    >
      <ReviewFunnelInner slug={slug} />
    </Suspense>
  );
}
