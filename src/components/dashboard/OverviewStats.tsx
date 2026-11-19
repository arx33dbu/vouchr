"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import {
  Star,
  ShieldCheck,
  TrendingUp,
  Gift,
  Send,
  BellRing,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

export default function OverviewStats({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const {
    profile,
    contacts,
    feedback,
    referrals,
    funnelStats,
    partnerStats,
    triggerBatchDay3Reminders,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [remindedCount, setRemindedCount] = useState<number | null>(null);
  const [funnelUrl, setFunnelUrl] = useState<string>(`/r/${profile.slug}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFunnelUrl(`${window.location.origin}/r/${profile.slug}`);
    }
  }, [profile.slug]);

  const dueRemindersCount = contacts.filter(
    (c) => c.status === "reminder_due"
  ).length;

  const copyFunnelLink = () => {
    navigator.clipboard.writeText(funnelUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBatchRemind = () => {
    const count = triggerBatchDay3Reminders();
    setRemindedCount(count);
    setTimeout(() => setRemindedCount(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Target Market Hero Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-slate-900 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold text-[11px] uppercase tracking-wider">
              Google Maps Growth Engine
            </span>
            <span className="text-xs text-slate-400">
              For {profile.name || "Local Trades"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Rank higher, protect your rating &amp; turn buyers into referrals.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Direct happy customers to leave 5-star Google reviews in 1-tap, while privately intercepting complaints before they ever touch your public score.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={copyFunnelLink}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold border border-slate-700/80 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Copy Review Funnel</span>
              </>
            )}
          </button>

          <a
            href={`/r/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <span>Open Live Funnel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4 Core Value Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Google Reviews Generated */}
        <div
          onClick={() => onTabChange("contacts")}
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all hover:bg-slate-900 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">
              Google Reviews Collected
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {funnelStats.positiveClicks}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              +100% 5-Star
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {partnerStats.unlocked ? (
              <span className="text-emerald-400 font-medium">
                🎉 Target reached: B2B partner unlocked!
              </span>
            ) : (
              <span>
                Need <strong className="text-amber-400">{5 - funnelStats.positiveClicks} more</strong> to unlock B2B Partner link
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Complaints Intercepted Privately */}
        <div
          onClick={() => onTabChange("feedback")}
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-purple-500/40 cursor-pointer transition-all hover:bg-slate-900 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">
              Public Rating Protected
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {feedback.length}
            </span>
            <span className="text-xs font-semibold text-purple-400">
              Private Alerts
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {feedback.filter((f) => !f.resolved).length} unresolved issues kept off Google
          </p>
        </div>

        {/* Card 3: Conversion Rate */}
        <div
          onClick={() => onTabChange("funnel")}
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-blue-500/40 cursor-pointer transition-all hover:bg-slate-900 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">
              Funnel Conversion
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {funnelStats.funnelViews > 0
                ? Math.round(
                    (funnelStats.positiveClicks / funnelStats.funnelViews) * 100
                  )
                : 0}
              %
            </span>
            <span className="text-xs text-slate-400">
              ({funnelStats.funnelViews} views)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {funnelStats.totalRequestsSent} total SMS/Email requests sent
          </p>
        </div>

        {/* Card 4: B2C Referral Revenue */}
        <div
          onClick={() => onTabChange("referrals")}
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all hover:bg-slate-900 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">
              B2C Referral Engine
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {referrals.length} Codes
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {referrals.filter((r) => r.status === "redeemed").length} Redeemed
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Give ${profile.b2cDiscountAmount}, get ${profile.b2cReferralReward} back
          </p>
        </div>
      </div>

      {/* Day 3 Automated Follow-Up Notice Banner */}
      {dueRemindersCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {dueRemindersCount} Automated Day 3 Follow-Up{dueRemindersCount > 1 ? "s" : ""} Due
              </h3>
              <p className="text-xs text-slate-300">
                Customers haven&apos;t clicked their review request after 72 hours. A quick friendly reminder increases review response rates by 65%.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleBatchRemind}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {remindedCount !== null
                  ? `Sent to ${remindedCount} Customers!`
                  : `Send Day 3 Reminders (${dueRemindersCount})`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
