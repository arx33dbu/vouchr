"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import {
  Crown,
  CheckCircle,
  Shield,
  Sparkles,
  Lock,
  Mail,
  X,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";

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
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          setUpgradeModalOpen(false);
          setSuccess(false);
        }, 2200);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header decoration */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-slate-900 border-b border-slate-800">
          <button
            onClick={() => setUpgradeModalOpen(false)}
            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-amber-400/30">
              <Crown className="w-3.5 h-3.5" />
              Keep Vouchr Active
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Key: {profile.trialKey}
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            Lock In Pro for <span className="text-amber-400">$29/month</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Turn happy trade customers into Google 5-star reviews and repeat referral jobs automatically.
          </p>
        </div>

        {/* Modal content */}
        <div className="p-6">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">You&apos;re All Set!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Your trial account has been upgraded to a permanent account and your $29/mo
                subscription is active.
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpgrade} className="space-y-4">
              {/* Value points */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Unlimited Smart Funnels</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Day 3 Auto Reminders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Private Negative Shield</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>B2C &amp; B2B Referral Loops</span>
                </div>
              </div>

              {/* Form inputs: Firebase linkWithCredential fields */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Your Permanent Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@yourcompany.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Upgrades your temporary trial key to permanent login credentials.
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <span>Securing Account...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Activate $29/mo Subscription</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cancel anytime with 1-click. No contract or lock-in.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
