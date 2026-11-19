"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { B2CReferral } from "@/types";
import {
  Gift,
  Plus,
  Share2,
  CheckCircle2,
  Clock,
  DollarSign,
  Copy,
  Check,
  ExternalLink,
  Users,
  Sparkles,
} from "lucide-react";

export default function ReferralHub() {
  const {
    profile,
    referrals,
    createB2CReferral,
    markRewardPaid,
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [referrerName, setReferrerName] = useState("");
  const [referrerPhone, setReferrerPhone] = useState("");
  const [referrerEmail, setReferrerEmail] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const totalRedeemed = referrals.filter(
    (r) => r.status === "redeemed" || r.status === "reward_paid"
  ).length;

  const pendingPayouts = referrals.filter(
    (r) => r.status === "redeemed"
  ).length;

  const estimatedRevenue = totalRedeemed * 180; // Estimated average trade service ticket

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

  const copyReferralLink = (code: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/referral/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero explanation */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-slate-900 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-semibold text-[11px] uppercase tracking-wider">
              B2C Viral Referral Loop
            </span>
            <span className="text-xs text-slate-400">For Your Customers</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            &quot;Give a friend ${profile.b2cDiscountAmount} off, get ${profile.b2cReferralReward} back&quot;
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Satisfied customers receive a personalized referral voucher to text to neighbors, friends, and family. Every redemption is tracked here so you can easily apply their reward.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Code</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Referral Codes Issued</span>
            <Gift className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{referrals.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Active vouchers circulating in your community
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Jobs Redeemed</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalRedeemed}</div>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">
            ~${estimatedRevenue} in new customer revenue
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Pending Payouts to Referrers</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {pendingPayouts} (${pendingPayouts * profile.b2cReferralReward})
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Credit off customer&apos;s next service bill
          </p>
        </div>
      </div>

      {/* Referrals List Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Referral Code</th>
              <th className="py-3 px-4">Referring Customer</th>
              <th className="py-3 px-4">Offer Details</th>
              <th className="py-3 px-4">Friend Redeemed</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {referrals.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No referral codes created yet. Add a customer or click &quot;Generate New Code&quot;.
                </td>
              </tr>
            ) : (
              referrals.map((ref) => {
                return (
                  <tr
                    key={ref.id}
                    className="hover:bg-slate-850/50 transition-colors"
                  >
                    {/* Code */}
                    <td className="py-3 px-4 font-mono font-bold text-amber-400 text-sm">
                      {ref.code}
                    </td>

                    {/* Referrer */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">
                        {ref.referrerName}
                      </div>
                      {ref.referrerPhone && (
                        <div className="text-[11px] text-slate-400">
                          {ref.referrerPhone}
                        </div>
                      )}
                    </td>

                    {/* Offer */}
                    <td className="py-3 px-4 text-[11px]">
                      <span className="text-emerald-400 font-semibold">
                        Give ${ref.discountAmount} off
                      </span>
                      <span className="text-slate-400"> / Get ${ref.rewardAmount} back</span>
                    </td>

                    {/* Friend Who Redeemed */}
                    <td className="py-3 px-4">
                      {ref.friendName ? (
                        <div>
                          <span className="font-semibold text-white">
                            {ref.friendName}
                          </span>
                          {ref.friendPhone && (
                            <div className="text-[11px] text-slate-400">
                              {ref.friendPhone}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Not redeemed yet</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {ref.status === "reward_paid" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Reward Paid
                        </span>
                      ) : ref.status === "redeemed" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                          <DollarSign className="w-3 h-3 text-amber-400" />
                          Payout Due (${ref.rewardAmount})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ref.status === "redeemed" && (
                          <button
                            onClick={() => markRewardPaid(ref.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                          >
                            Mark ${ref.rewardAmount} Paid
                          </button>
                        )}

                        <button
                          onClick={() => copyReferralLink(ref.code)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1 transition-colors"
                          title="Copy Public Voucher Link"
                        >
                          {copiedCode === ref.code ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Voucher Link</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`/referral/${ref.code}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
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

      {/* Generate New Referral Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-400" />
                Generate Customer Referral Voucher
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Customer / Referrer Name *
                </label>
                <input
                  type="text"
                  required
                  value={referrerName}
                  onChange={(e) => setReferrerName(e.target.value)}
                  placeholder="e.g. Alex Martinez"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={referrerPhone}
                  onChange={(e) => setReferrerPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={referrerEmail}
                  onChange={(e) => setReferrerEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                Will generate a code like <strong>ALEX-20</strong> offering{" "}
                <strong>Give ${profile.b2cDiscountAmount} off, get ${profile.b2cReferralReward} back</strong>.
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create &amp; Activate Code</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
