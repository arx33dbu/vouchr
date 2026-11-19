"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import {
  Lock,
  Unlock,
  Share2,
  Copy,
  Check,
  Award,
  Building,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function B2BPartnerProgram() {
  const { profile, partnerStats, recordPositiveReviewClick } = useApp();
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
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                B2B Partner Referral Program
              </span>
              {isUnlocked && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Partner Tier Active
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              &quot;Refer another business owner—they get 1 month free, and you get 1 month free once they subscribe.&quot;
            </h2>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Earn free months of Vouchr Pro ($29/mo value each) by referring trade contractors, detailers, mechanics, and local service pros. Your reward is credited once their paid subscription is active.
            </p>
          </div>

          <div className="flex-shrink-0 bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-left sm:text-right min-w-[200px]">
            <div className="text-xs font-medium text-zinc-400">
              Subscription Credits Earned
            </div>
            <div className="text-2xl font-bold text-white mt-0.5">
              {partnerStats.monthsFreeEarned} Months Free
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              ${partnerStats.monthsFreeEarned * 29} subscription savings
            </div>
          </div>
        </div>

        {/* 5 Reviews Milestone Bar */}
        <div className="mt-6 pt-5 border-t border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-zinc-300 flex items-center gap-1.5">
              {isUnlocked ? (
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span>Unlock Requirement: Collect 5 Google Reviews</span>
            </span>
            <span className="text-zinc-400 font-mono text-xs">
              <strong className="text-white">{reviewsCount}</strong> / {target} reviews
            </span>
          </div>

          <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
            <div
              className={`h-full transition-all duration-500 ${
                isUnlocked ? "bg-emerald-400" : "bg-zinc-400"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {!isUnlocked && (
            <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <p className="text-zinc-400 text-[11px]">
                Collect <strong className="text-white">{target - reviewsCount} more review</strong> to unlock your shareable partner link.
              </p>
              <button
                onClick={simulateUnlock}
                className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-200 transition-colors font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Simulate 5th Review</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Partner Link Box */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Your Partner Invite Link
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              New business gets 1 month free. Once they subscribe, your next $29 month is 100% free.
            </p>
          </div>

          <span className="font-mono text-xs text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
            {partnerStats.partnerCode}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-zinc-950 rounded-lg border border-zinc-800">
          <input
            type="text"
            readOnly
            value={partnerUrl}
            className="flex-1 px-3 py-1.5 bg-transparent text-xs text-zinc-300 font-mono focus:outline-none"
          />

          <button
            onClick={copyPartnerLink}
            disabled={!isUnlocked}
            className={`px-3 py-1.5 rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isUnlocked
                ? "bg-zinc-100 hover:bg-white text-zinc-950"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Partner Link</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-zinc-500 mr-1">Share via:</span>
          <a
            href={`sms:?body=Hey, I've been using Vouchr for automated Google reviews from jobs. You get 1 month free with my link: ${encodeURIComponent(partnerUrl)}`}
            className="px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-zinc-850 text-zinc-300 text-xs border border-zinc-800"
          >
            SMS
          </a>
          <a
            href={`mailto:?subject=Google Reviews Tool (1 Month Free)&body=Here is a partner link for 1 free month of Vouchr: ${partnerUrl}`}
            className="px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-zinc-850 text-zinc-300 text-xs border border-zinc-800"
          >
            Email
          </a>
        </div>
      </div>

      {/* Referred Businesses */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Referred Business Accounts ({partnerStats.referredBusinessesCount})
        </h4>

        {partnerStats.referredBusinessesCount === 0 ? (
          <p className="text-xs text-zinc-500 py-2">
            No partner accounts referred yet. Share your partner link to earn free monthly subscriptions.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white">Timberline Roofing Co.</span>
                <span className="text-[11px] text-zinc-500 ml-2">Subscribed • Paid Account</span>
              </div>
              <span className="text-emerald-400 font-medium">
                1 Month Free Applied (Dec 2026)
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white">Ironclad Auto Repair</span>
                <span className="text-[11px] text-zinc-500 ml-2">Subscribed • Paid Account</span>
              </div>
              <span className="text-emerald-400 font-medium">
                1 Month Free Applied (Jan 2027)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
