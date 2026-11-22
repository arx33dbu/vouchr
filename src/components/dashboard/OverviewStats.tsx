"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/store";
import {
  Star,
  ShieldCheck,
  Gift,
  Send,
  BellRing,
  ExternalLink,
  Copy,
  Check,
  UserPlus,
  AlertTriangle,
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
    addContact,
    sendReviewRequest,
    triggerBatchDay3Reminders,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [remindedCount, setRemindedCount] = useState<number | null>(null);
  const [funnelUrl, setFunnelUrl] = useState<string>(`/r/${profile.slug}`);

  // Quick Dispatch Form State
  const [quickName, setQuickName] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [quickService, setQuickService] = useState("");
  const [quickSuccess, setQuickSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFunnelUrl(`${window.location.origin}/r/${profile.slug}`);
    }
  }, [profile.slug]);

  const dueRemindersCount = contacts.filter(
    (c) => c.status === "reminder_due"
  ).length;

  const unresolvedComplaintsCount = feedback.filter((f) => !f.resolved).length;

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

  const handleQuickDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) return;

    addContact({
      name: quickName.trim(),
      phone: quickPhone.trim(),
      email: "",
      serviceRendered: quickService.trim() || "Service Appointment",
      serviceDate: new Date().toISOString().split("T")[0],
      status: "request_sent",
      requestSentAt: new Date().toISOString(),
    });

    setQuickName("");
    setQuickPhone("");
    setQuickService("");
    setQuickSuccess(true);
    setTimeout(() => setQuickSuccess(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Action Banner: Google Review Link */}
      <div className="p-4 sm:p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Direct Customer Review Link
          </span>
          <p className="text-xs text-zinc-300 font-mono mt-0.5 truncate max-w-md">
            {funnelUrl}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={copyFunnelLink}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <a
            href={profile.slug ? `/r/${profile.slug}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Preview Funnel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 3 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Google Reviews Generated */}
        <div
          onClick={() => onTabChange("contacts")}
          className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">
              Google Reviews Collected
            </span>
            <Star className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {funnelStats.positiveClicks}
            </span>
            <span className="text-xs text-zinc-500">
              ({funnelStats.funnelViews} funnel visits)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-400">
            {5 - funnelStats.positiveClicks > 0
              ? `${5 - funnelStats.positiveClicks} more to unlock B2B partner tier`
              : "B2B Partner Link active"}
          </p>
        </div>

        {/* Card 2: Complaints Intercepted Privately */}
        <div
          onClick={() => onTabChange("feedback")}
          className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">
              Complaints Intercepted
            </span>
            <ShieldCheck className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {feedback.length}
            </span>
            <span className="text-xs text-zinc-500">
              Kept off Google
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-400">
            {unresolvedComplaintsCount > 0
              ? `${unresolvedComplaintsCount} pending customer resolution`
              : "All feedback resolved"}
          </p>
        </div>

        {/* Card 3: Referral Vouchers */}
        <div
          onClick={() => onTabChange("referrals")}
          className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">
              Referrals Verified
            </span>
            <Gift className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {referrals.filter((r) => r.status === "purchased" || r.status === "credit_applied").length}
            </span>
            <span className="text-xs text-zinc-500">
              ({referrals.filter((r) => r.status === "job_booked").length} pending job)
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-400">
            Reward unlocks only after friend pays
          </p>
        </div>
      </div>

      {/* Action Alerts (Day 3 Follow-Up or Complaints) */}
      {dueRemindersCount > 0 && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center flex-shrink-0">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">
                {dueRemindersCount} Day 3 Review Follow-Up{dueRemindersCount > 1 ? "s" : ""} Due
              </h3>
              <p className="text-[11px] text-zinc-400">
                Customers haven&apos;t clicked review links after 72 hours.
              </p>
            </div>
          </div>

          <button
            onClick={handleBatchRemind}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {remindedCount !== null
                ? `Sent to ${remindedCount} clients`
                : `Send Day 3 Reminders (${dueRemindersCount})`}
            </span>
          </button>
        </div>
      )}

      {unresolvedComplaintsCount > 0 && (
        <div
          onClick={() => onTabChange("feedback")}
          className="p-4 rounded-xl bg-zinc-900 border border-rose-500/30 flex items-center justify-between cursor-pointer hover:border-rose-500/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <div>
              <h3 className="text-xs font-semibold text-white">
                {unresolvedComplaintsCount} Private Complaint{unresolvedComplaintsCount > 1 ? "s" : ""} Received
              </h3>
              <p className="text-[11px] text-zinc-400">
                Customer opted to send direct feedback instead of posting publicly on Google.
              </p>
            </div>
          </div>
          <span className="text-xs text-rose-400 font-medium">View Inbox &rarr;</span>
        </div>
      )}

      {/* Quick Review Dispatch (Single Job Completion) */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-zinc-400" />
            Quick Review Dispatch
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Finished a job? Enter customer details to queue an instant review request with their unique referral voucher.
          </p>
        </div>

        <form onSubmit={handleQuickDispatch} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
          <input
            type="text"
            required
            value={quickName}
            onChange={(e) => setQuickName(e.target.value)}
            placeholder="Customer Name *"
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          <input
            type="tel"
            required
            value={quickPhone}
            onChange={(e) => setQuickPhone(e.target.value)}
            placeholder="Phone Number *"
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          <input
            type="text"
            value={quickService}
            onChange={(e) => setQuickService(e.target.value)}
            placeholder="Service (e.g. Brake Repair)"
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {quickSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Request Dispatched!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Review Invite</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
