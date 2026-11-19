"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import {
  Lock,
  Unlock,
  Sparkles,
  Share2,
  Copy,
  Check,
  Award,
  Calendar,
  DollarSign,
  Building,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function B2BPartnerProgram() {
  const { profile, partnerStats, funnelStats, recordPositiveReviewClick } = useApp();
  const [copied, setCopied] = useState(false);
  const [partnerUrl, setPartnerUrl] = useState(`https://vouchr.app/login?ref=${partnerStats.partnerCode}`);

  const reviewsCount = partnerStats.reviewsCount;
  const target = partnerStats.reviewsTarget; // 5
  const isUnlocked = partnerStats.unlocked;
  const progressPercent = Math.min(100, Math.round((reviewsCount / target) * 100));

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setPartnerUrl(`${window.location.origin}/login?ref=${partnerStats.partnerCode}`);
    }
  }, [partnerStats.partnerCode]);

  const copyPartnerLink = () => {
    navigator.clipboard.writeText(partnerUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateUnlock = () => {
    recordPositiveReviewClick(profile.slug);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[11px] uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                B2B Partner Loop (For Vouchr)
              </span>
              {isUnlocked && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] uppercase tracking-wider border border-emerald-500/30">
                  VIP Partner Unlocked
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">
              &quot;Refer another business owner—they get 1 month free, and you get 1 month free once they subscribe.&quot;
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Earn free months of Vouchr Pro ($29/mo value each) by sharing your partner link with fellow trade contractors, detailers, mechanics, and service business owners in your network.
            </p>
          </div>

          <div className="flex-shrink-0 bg-slate-950/80 p-4 rounded-2xl border border-indigo-500/30 text-center min-w-[220px]">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Free Months Earned
            </div>
            <div className="text-3xl font-black text-amber-400 mt-1">
              {partnerStats.monthsFreeEarned} Months Free
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-1">
              ${partnerStats.monthsFreeEarned * 29} subscription savings
            </div>
          </div>
        </div>

        {/* 5 Reviews Milestone Bar */}
        <div className="mt-6 pt-6 border-t border-indigo-500/20">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              {isUnlocked ? (
                <Unlock className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-amber-400" />
              )}
              Unlock Requirement: Hit 5 Google Reviews
            </span>
            <span className="text-slate-300 font-mono">
              <strong className="text-amber-400">{reviewsCount}</strong> / {target} Reviews
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isUnlocked
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : "bg-gradient-to-r from-amber-500 to-orange-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {!isUnlocked && (
            <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <p className="text-slate-400 text-[11px]">
                Collect just <strong className="text-amber-400">{target - reviewsCount} more</strong> Google Review to unlock your permanent Partner Link.
              </p>
              <button
                onClick={simulateUnlock}
                className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 transition-colors font-medium flex items-center gap-1"
              >
                <span>Simulate 5th Review Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Partner Link & Sharing Interface (Active when unlocked or previewable) */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isUnlocked
          ? "bg-slate-900/80 border-slate-800"
          : "bg-slate-950/40 border-slate-800/60 opacity-80"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Your VIP Partner Link
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Share with fellow business owners. When they subscribe, your next $29 month is 100% free.
            </p>
          </div>

          <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            {partnerStats.partnerCode}
          </span>
        </div>

        {/* Copy Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800">
          <input
            type="text"
            readOnly
            value={partnerUrl}
            className="flex-1 px-3 py-2 bg-transparent text-xs text-slate-300 font-mono focus:outline-none"
          />

          <button
            onClick={copyPartnerLink}
            disabled={!isUnlocked}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              isUnlocked
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-950" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Partner Link</span>
              </>
            )}
          </button>
        </div>

        {/* Share Shortcuts */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 mr-2">Quick Share:</span>

          <a
            href={`sms:?body=Hey, I've been using Vouchr to get Google reviews automatically from my jobs. You can get 1 month completely free with my partner link: ${encodeURIComponent(partnerUrl)}`}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium transition-colors"
          >
            📱 SMS Fellow Tradesman
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Check out Vouchr for getting Google Reviews on auto-pilot. You get 1 month free here: ${partnerUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium transition-colors"
          >
            💬 WhatsApp
          </a>

          <a
            href={`mailto:?subject=Google Reviews Tool (1 Month Free)&body=Hey! Thought you might like this tool I've been using to collect 5-star Google reviews from customers. Here is my link for 1 month free: ${partnerUrl}`}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium transition-colors"
          >
            ✉️ Email
          </a>
        </div>
      </div>

      {/* Referred Businesses Roster */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-slate-400" />
          Referred Businesses ({partnerStats.referredBusinessesCount})
        </h4>

        {partnerStats.referredBusinessesCount === 0 ? (
          <p className="text-xs text-slate-500 py-3">
            No partner referrals yet. Share your partner link to start racking up free monthly subscriptions.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">Timberline Roofing Co.</span>
                <span className="text-[11px] text-slate-400 ml-2">Joined 4 days ago</span>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                1 Month Free Applied (Dec 2026)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">Ironclad Auto Repair</span>
                <span className="text-[11px] text-slate-400 ml-2">Joined yesterday</span>
              </div>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                1 Month Free Applied (Jan 2027)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
