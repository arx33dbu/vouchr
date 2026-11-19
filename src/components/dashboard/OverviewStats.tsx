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
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Reviews &amp; Reputation Pipeline
            </span>
            <span className="text-xs text-zinc-500">
              • {profile.name || "Local Services"}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Rank higher on Google Maps &amp; protect your public rating
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Direct satisfied clients to write 5-star Google reviews in 1-tap, privately intercept complaints before they reach Google Maps, and track purchase-verified client referrals.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={copyFunnelLink}
            className="px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-850 text-zinc-200 text-xs font-medium border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Review Link</span>
              </>
            )}
          </button>

          <a
            href={`/r/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Live Funnel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4 Core Value Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Google Reviews Generated */}
        <div
          onClick={() => onTabChange("contacts")}
          className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">
              Google Reviews Collected
            </span>
            <div className="w-7 h-7 rounded-md bg-zinc-800 text-zinc-300 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {funnelStats.positiveClicks}
            </span>
            <span className="text-xs font-medium text-emerald-400">
              5-Star Target
            </span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            {partnerStats.unlocked ? (
              <span className="text-emerald-400 font-medium">
                Target reached: B2B partner tier unlocked
              </span>
            ) : (
              <span>
                Need <strong className="text-white">{5 - funnelStats.positiveClicks} more</strong> for B2B partner link
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Complaints Intercepted Privately */}
        <div
          onClick={() => onTabChange("feedback")}
          className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">
              Complaints Intercepted
            </span>
            <div className="w-7 h-7 rounded-md bg-zinc-800 text-zinc-300 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {feedback.length}
            </span>
            <span className="text-xs text-zinc-400">
              Kept off Google
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-400">
            {feedback.filter((f) => !f.resolved).length} pending resolution with customer
          </p>
        </div>

        {/* Card 3: Conversion Rate */}
        <div
          onClick={() => onTabChange("funnel")}
          className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">
              Funnel Conversion
            </span>
            <div className="w-7 h-7 rounded-md bg-zinc-800 text-zinc-300 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {funnelStats.funnelViews > 0
                ? Math.round(
                    (funnelStats.positiveClicks / funnelStats.funnelViews) * 100
                  )
                : 0}
              %
            </span>
            <span className="text-xs text-zinc-400">
              ({funnelStats.funnelViews} views)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-400">
            {funnelStats.totalRequestsSent} total review dispatches sent
          </p>
        </div>

        {/* Card 4: B2C Referral Revenue */}
        <div
          onClick={() => onTabChange("referrals")}
          className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">
              Referral Pipeline
            </span>
            <div className="w-7 h-7 rounded-md bg-zinc-800 text-zinc-300 flex items-center justify-center">
              <Gift className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {referrals.filter((r) => r.status === "purchased" || r.status === "credit_applied").length} Paid
            </span>
            <span className="text-xs text-zinc-400">
              ({referrals.filter((r) => r.status === "job_booked").length} pending job)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-400">
            Reward unlocked only after friend&apos;s job is paid
          </p>
        </div>
      </div>

      {/* Day 3 Automated Follow-Up Notice Banner */}
      {dueRemindersCount > 0 && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center flex-shrink-0">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">
                {dueRemindersCount} Day 3 Review Follow-Up{dueRemindersCount > 1 ? "s" : ""} Due
              </h3>
              <p className="text-[11px] text-zinc-400">
                Customers haven&apos;t clicked after 72 hours. Second touchpoint increases Google review response rate by 65%.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleBatchRemind}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {remindedCount !== null
                  ? `Sent to ${remindedCount} clients`
                  : `Send Day 3 Reminders (${dueRemindersCount})`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
