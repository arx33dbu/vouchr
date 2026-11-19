"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { B2CReferral, ReferralStatus } from "@/types";
import {
  Plus,
  Copy,
  Check,
  ExternalLink,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  FileCheck,
  X,
} from "lucide-react";

export default function ReferralHub() {
  const {
    profile,
    referrals,
    createB2CReferral,
    markJobPurchased,
    applyReferralCredit,
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [purchaseModalRef, setPurchaseModalRef] = useState<B2CReferral | null>(null);
  const [invoiceAmountInput, setInvoiceAmountInput] = useState<number>(200);

  const [referrerName, setReferrerName] = useState("");
  const [referrerPhone, setReferrerPhone] = useState("");
  const [referrerEmail, setReferrerEmail] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter metrics
  const activeCodes = referrals.filter((r) => r.status === "active").length;
  const pendingJobs = referrals.filter((r) => r.status === "job_booked").length;
  const verifiedPurchases = referrals.filter(
    (r) => r.status === "purchased" || r.status === "credit_applied"
  ).length;
  const pendingCreditsToApply = referrals.filter((r) => r.status === "purchased").length;

  const totalReferralRevenue = referrals.reduce(
    (acc, curr) => acc + (curr.invoiceAmount || 0),
    0
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referrerName.trim()) return;

    createB2CReferral(
      referrerName.trim(),
      referrerPhone.trim(),
      referrerEmail.trim()
    );

    setReferrerName("");
    setReferrerPhone("");
    setReferrerEmail("");
    setCreateModalOpen(false);
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseModalRef) return;
    markJobPurchased(purchaseModalRef.id, Number(invoiceAmountInput) || 200);
    setPurchaseModalRef(null);
  };

  const copyReferralLink = (code: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/referral/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (ref: B2CReferral) => {
    switch (ref.status) {
      case "job_booked":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Job Booked • Reward Locked</span>
          </span>
        );
      case "purchased":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Unlock className="w-3 h-3 text-emerald-400" />
            <span>Purchased • Reward Unlocked</span>
          </span>
        );
      case "credit_applied":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
            <CheckCircle2 className="w-3 h-3 text-zinc-400" />
            <span>Credit Deducted on Bill</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-800/60 text-zinc-400 border border-zinc-800">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span>Active Voucher</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Customer Referral Engine
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Purchase-Verified Referral Program
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Friends receive ${profile.b2cDiscountAmount} off their first invoice. The referring customer&apos;s ${profile.b2cReferralReward} reward is <strong>only unlocked once the friend&apos;s job is completed &amp; paid</strong>.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors flex-shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Referral Code</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1">Active Client Codes</div>
          <div className="text-xl font-bold text-white">{referrals.length}</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Shared with contacts</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1">Pending Jobs (Unpaid)</div>
          <div className="text-xl font-bold text-amber-300">{pendingJobs}</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Reward locked until paid</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1">Verified Purchases</div>
          <div className="text-xl font-bold text-emerald-400">{verifiedPurchases}</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">${totalReferralRevenue} generated revenue</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1">Unlocked Credits to Apply</div>
          <div className="text-xl font-bold text-white">{pendingCreditsToApply}</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            ${pendingCreditsToApply * profile.b2cReferralReward} awaiting billing deduction
          </p>
        </div>
      </div>

      {/* Referral Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950/90 text-zinc-400 uppercase font-medium text-[10px] tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Referring Client</th>
              <th className="py-3 px-4">Referred Friend &amp; Job</th>
              <th className="py-3 px-4">Referral Lifecycle</th>
              <th className="py-3 px-4 text-right">Owner Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {referrals.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  No referral vouchers tracked yet.
                </td>
              </tr>
            ) : (
              referrals.map((ref) => {
                return (
                  <tr key={ref.id} className="hover:bg-zinc-850/50 transition-colors">
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-zinc-200">
                      {ref.code}
                    </td>

                    {/* Referrer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{ref.referrerName}</div>
                      {ref.referrerPhone && (
                        <div className="text-[11px] text-zinc-400">{ref.referrerPhone}</div>
                      )}
                    </td>

                    {/* Referred Friend */}
                    <td className="py-3.5 px-4">
                      {ref.friendName ? (
                        <div>
                          <div className="font-medium text-zinc-200">
                            {ref.friendName}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {ref.friendPhone}
                            {ref.friendServiceNeeded && ` • ${ref.friendServiceNeeded}`}
                          </div>
                          {ref.invoiceAmount && (
                            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                              Final Invoice: ${ref.invoiceAmount} (Paid)
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic">No friend booked yet</span>
                      )}
                    </td>

                    {/* Status Lifecycle */}
                    <td className="py-3.5 px-4">{getStatusBadge(ref)}</td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* If job is booked but NOT yet purchased: owner can verify & mark purchased */}
                        {ref.status === "job_booked" && (
                          <button
                            onClick={() => {
                              setPurchaseModalRef(ref);
                              setInvoiceAmountInput(200);
                            }}
                            className="px-2.5 py-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            title="Mark job completed and paid to unlock referrer reward"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Verify Purchase</span>
                          </button>
                        )}

                        {/* If purchased: owner can apply credit to original client */}
                        {ref.status === "purchased" && (
                          <button
                            onClick={() => applyReferralCredit(ref.id)}
                            className="px-2.5 py-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            title="Deduct $20 credit on referring client's next invoice"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Apply ${ref.rewardAmount} Credit</span>
                          </button>
                        )}

                        {/* Copy link */}
                        <button
                          onClick={() => copyReferralLink(ref.code)}
                          className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copy Link for Customer"
                        >
                          {copiedCode === ref.code ? (
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
                          href={`/referral/${ref.code}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
                          title="Open Booking Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Verify Purchase Modal */}
      {purchaseModalRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Verify Service Completion &amp; Payment
              </h3>
              <button
                onClick={() => setPurchaseModalRef(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmPurchase} className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <p className="font-medium text-zinc-200">
                  Friend: <strong>{purchaseModalRef.friendName}</strong> ({purchaseModalRef.friendPhone})
                </p>
                <p className="text-zinc-400">
                  Service: {purchaseModalRef.friendServiceNeeded || "Service"}
                </p>
                <p className="text-zinc-400">
                  Referrer: {purchaseModalRef.referrerName} ({purchaseModalRef.code})
                </p>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Final Invoice Amount Paid ($)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={invoiceAmountInput}
                  onChange={(e) => setInvoiceAmountInput(Number(e.target.value))}
                  placeholder="200"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] leading-relaxed">
                ✓ Marking this service as paid verifies the purchase and officially <strong>unlocks the ${purchaseModalRef.rewardAmount} referral reward</strong> for {purchaseModalRef.referrerName}.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPurchaseModalRef(null)}
                  className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Verify Payment &amp; Unlock Reward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Code Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Generate Customer Referral Voucher
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={referrerName}
                  onChange={(e) => setReferrerName(e.target.value)}
                  placeholder="e.g. Alex Martinez"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={referrerPhone}
                    onChange={(e) => setReferrerPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={referrerEmail}
                    onChange={(e) => setReferrerEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <p className="text-[11px] text-zinc-400">
                Creates a unique referral code. Reward is only unlocked once their friend completes a paid job.
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs"
                >
                  Generate Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
