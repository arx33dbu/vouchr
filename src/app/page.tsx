"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { generateTrialKey } from "@/lib/utils";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Star,
  Lock,
  Unlock,
  MessageSquare,
  Users,
  ChevronRight,
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
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
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
              Have a Trial Key?
            </Link>

            <button
              onClick={() => handleStartTrial("TRIAL-8492")}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 max-w-5xl mx-auto w-full text-center">
        <div className="space-y-6 max-w-3xl mx-auto">


          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Rank higher on Google Maps. <br className="hidden sm:inline" />
            Protect your rating &amp; turn jobs into referrals.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Send 1-tap review requests after every job. Happy clients go straight to Google; unhappy clients are intercepted privately before hurting your score. Turn every completed service into purchase-verified referral loops.
          </p>

          {/* Trial Input / Start Box */}
          <div className="pt-3 max-w-md mx-auto">
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
                <Zap className="w-3.5 h-3.5" />
                <span>Start Free Trial</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-500 mt-3">
              <span>No password upfront</span>
              <span>•</span>
              <span>15-second setup</span>
              <span>•</span>
              <span>$29/mo after 14-day trial</span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Categories */}
      <section className="py-6 border-y border-zinc-800/80 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-3">
            Designed for local trade and field service contractors
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              Auto Detailers
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              Mechanics &amp; Auto Repair
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              Roofing &amp; Siding
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              Plumbers
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              Landscaping &amp; Tree Care
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              Snow Removal
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800">
              HVAC &amp; Electrical
            </span>
          </div>
        </div>
      </section>

      {/* Feature Breakdown */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-10">
        <div className="space-y-1">
          <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            System Architecture
          </h2>
          <p className="text-2xl font-bold text-white tracking-tight">
            How Vouchr scales your local reputation and revenue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              01. Trial Key Access
            </div>
            <h3 className="text-sm font-semibold text-white">
              Zero-Friction Client Onboarding
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Prospects access their dashboard using custom access keys (e.g., TRIAL-8492) or direct links with no password needed upfront. Uses Firebase Anonymous Auth, seamlessly upgrading (linkWithCredential) when subscribing.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              02. 15-Second Setup
            </div>
            <h3 className="text-sm font-semibold text-white">
              Instant Place ID Extractor
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Collects Business Name, Logo, and Google Maps Link / Place ID on first login. Parses Google URLs automatically to generate your direct review URL in under 15 seconds.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              03. Smart Funnel
            </div>
            <h3 className="text-sm font-semibold text-white">
              Protected Review Funnel (/r/[slug])
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Clients tap 👍 or 👎. 👍 redirects straight to your direct Google Review dialog. 👎 opens a private feedback form alerting the owner directly, with compliant Google fallback links.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              04. Automated Follow-Ups
            </div>
            <h3 className="text-sm font-semibold text-white">
              Automated Day 3 Follow-Up
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dispatches SMS review requests right after job completion. Automatically flags contacts who haven&apos;t clicked after 72 hours for 1-click batch reminders.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              05. Purchase-Verified B2C
            </div>
            <h3 className="text-sm font-semibold text-white">
              Reward Unlocked On Purchase
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Clients give a friend $20 off their service. Crucially, the referring client&apos;s $20 reward is <strong>only unlocked once the friend completes and pays for their service</strong>.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              06. B2B Viral Loop
            </div>
            <h3 className="text-sm font-semibold text-white">
              5-Review Milestone Partner Tier
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Once a trade business collects 5 new Google reviews, they unlock a VIP Partner Link: &quot;Refer another business owner—they get 1 month free, and you get 1 month free once they subscribe.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-14 px-4 sm:px-6 max-w-xl mx-auto w-full text-center">
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Subscription Plan
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                $29 / month
              </h2>
            </div>
            <span className="text-xs text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800 font-medium">
              14-Day Free Trial
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            One extra detailing client, brake repair, or plumbing call easily covers 12 months of service.
          </p>

          <div className="space-y-2 text-xs text-zinc-300 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Unlimited review funnels &amp; QR dispatches</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Automated Day 3 unclicked follow-up engine</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Private complaint shield (keeps 1-star ratings off Google)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Purchase-verified B2C client referral tracker</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>B2B Partner Link unlocked at 5 reviews</span>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={() => handleStartTrial("TRIAL-8492")}
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Launch 14-Day Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 px-4 text-center text-xs text-zinc-500">
        Vouchr • Reviews &amp; Referral Automation for Local Trades
      </footer>
    </div>
  );
}
