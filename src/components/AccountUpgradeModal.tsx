"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import {
  Crown,
  CheckCircle,
  Shield,
  Lock,
  Mail,
  X,
  CreditCard,
  ArrowRight,
} from "lucide-react";

export default function AccountUpgradeModal() {
  const {
    profile,
    upgradeModalOpen,
    setUpgradeModalOpen,
    upgradeToPaidSubscription,
  } = useApp();

  const [email, setEmail] = useState(profile.userEmail || profile.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  if (!upgradeModalOpen) return null;

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await upgradeToPaidSubscription(email, password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setUpgradeModalOpen(false);
          setSuccess(false);
        }, 1800);
      } else {
        setErrorMsg(res.error || "Failed to link account credentials.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-zinc-800">
          <button
            onClick={() => setUpgradeModalOpen(false)}
            className="absolute right-4 top-4 p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
            Subscription Upgrade
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Activate Vouchr Pro ($29/month)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Keep your automated review pipeline, private shield, and referral engine active.
          </p>
        </div>

        {/* Modal content */}
        <div className="p-6">
          {success ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Subscription Active</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Your account is now linked to {email} and your monthly subscription is set up.
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpgrade} className="space-y-4 text-xs">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1.5 text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Unlimited Google Review Funnels</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Day 3 SMS &amp; Email automated follow-ups</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Private rating shield (filters unhappy reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Purchase-verified B2C client referral tracking</span>
                </div>
              </div>

              {/* Form inputs: Firebase linkWithCredential */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Permanent Account Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@yourcompany.com"
                      className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Set Account Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Upgrades your temporary trial key ({profile.trialKey}) to permanent credentials.
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Saving Account...</span>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Subscribe ($29/month)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 pt-1">
                <Shield className="w-3.5 h-3.5 text-zinc-400" />
                <span>Cancel anytime with 1 click. No lock-in or contracts.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
