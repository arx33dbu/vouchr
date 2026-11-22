"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { generateTrialKey } from "@/lib/utils";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Send,
  Lock,
  Gift,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { loginWithTrialKey } = useApp();
  const [trialInput, setTrialInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStartTrial = async (customKey?: string) => {
    const key = customKey || trialInput.trim() || generateTrialKey();
    setLoading(true);
    await loginWithTrialKey(key);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-950 font-black text-sm">
              V
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              vouchr
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 transition-colors font-medium"
            >
              Have an Access Key?
            </Link>

            <button
              onClick={() => handleStartTrial()}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 max-w-4xl mx-auto w-full text-center space-y-6">
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
          Rank higher on Google Maps. <br className="hidden sm:inline" />
          Protect your rating. Turn jobs into referrals.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Send a 1-tap review link after every completed job. Satisfied clients go straight to Google; unhappy clients send private feedback before hurting your public score.
        </p>

        {/* Start Trial Input Box */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={trialInput}
              onChange={(e) => setTrialInput(e.target.value.toUpperCase())}
              placeholder="Enter access key (or leave blank)"
              className="w-full sm:flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800/80 rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-center sm:text-left"
            />
            <button
              onClick={() => handleStartTrial()}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0"
            >
              <span>Start Free 14-Day Trial</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2.5 text-[11px] text-zinc-500 mt-3">
            <span>No password required</span>
            <span>•</span>
            <span>Instant setup</span>
            <span>•</span>
            <span>$29/month after 14-day trial</span>
          </div>
        </div>
      </section>

      {/* 3 Core Steps Breakdown */}
      <section className="py-12 border-t border-zinc-800/80 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1 */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
              <Star className="w-4 h-4 text-zinc-300" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Smart Review Funnel
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Customers choose between a great experience or improvements needed. Positive feedback opens your direct Google review link in 1 tap.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-zinc-300" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Private Complaint Intercept
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Unhappy clients are routed to a private message directly to you, keeping critical feedback off Google Maps so you can resolve issues privately.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
              <Gift className="w-4 h-4 text-zinc-300" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Purchase-Locked Referral Loop
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Happy customers unlock a unique $20 discount voucher to give friends. The referring client&apos;s $20 reward unlocks only once the friend completes and pays for their service.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-14 px-4 sm:px-6 max-w-md mx-auto w-full text-center">
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Full Access Subscription
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                $29 / month
              </h2>
            </div>
            <span className="text-xs text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800 font-medium">
              14-Day Free Trial
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            One extra detailing job, brake replacement, or plumbing service covers your entire yearly subscription.
          </p>

          <div className="space-y-2 text-xs text-zinc-300 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Unlimited customer review requests &amp; funnels</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Automated Day 3 follow-up reminders</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Private complaint shield (keeps complaints off Google)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Purchase-verified client referral tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>B2B partner referral milestone tier</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleStartTrial()}
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Launch Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-5 px-4 text-center text-xs text-zinc-500">
        Vouchr • Review &amp; Referral Engine for Local Trades
      </footer>
    </div>
  );
}
