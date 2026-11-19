"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { generateTrialKey } from "@/lib/utils";
import {
  Sparkles,
  Star,
  ShieldCheck,
  Zap,
  ArrowRight,
  Gift,
  Award,
  BellRing,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Lock,
  Crown,
  ChevronRight,
  ExternalLink,
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              vouchr<span className="text-amber-400">.</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Have a Trial Key?
            </Link>

            <button
              onClick={() => handleStartTrial("TRIAL-8492")}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Launch Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative space-y-6 max-w-4xl mx-auto">
          {/* Market callout */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Built specifically for local trades &amp; service pros with &lt; 20 Google reviews</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Rank #1 on Google Maps. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              Shield your rating &amp; trigger viral referrals.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Direct satisfied customers to leave 5-star Google reviews in 1-tap, privately intercept complaints before they touch your public score, and turn happy clients into repeat referral engines.
          </p>

          {/* Zero Friction Access Box */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={trialInput}
                onChange={(e) => setTrialInput(e.target.value.toUpperCase())}
                placeholder="Enter key (e.g. TRIAL-8492) or leave blank"
                className="w-full sm:flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-center sm:text-left"
              />
              <button
                onClick={() => handleStartTrial()}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all flex-shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Start Free 14-Day Trial</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 mt-3">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                No password required
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                15-second setup
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                $29/mo after trial
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Trades Marquee */}
      <section className="py-6 border-y border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">
            Designed for high-ticket local service businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-300">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              ✨ Auto Detailers
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              🔧 Mechanics &amp; Auto Repair
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              🏠 Roofing &amp; Siding
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              🚰 Plumbers
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              🌱 Landscapers
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              ❄️ Snow Removal
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              ⚡ Electricians &amp; HVAC
            </span>
          </div>
        </div>
      </section>

      {/* Feature Breakdown Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            The Complete v1 MVP Engine
          </h2>
          <p className="text-3xl font-black text-white tracking-tight">
            Everything a local trade contractor needs to dominate their local market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Zero-Friction Trial Key */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Zero-Friction Trial Key Login
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prospects access their dashboard using custom access keys (e.g., TRIAL-8492) or direct magic links. Uses Firebase Anonymous Auth, seamlessly upgrading (linkWithCredential) when they subscribe.
            </p>
          </div>

          {/* Card 2: 15-Second Onboarding */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              15-Second Onboarding Pop-Up
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instantly prompts for Business Name, Logo, and Google Maps Link / Place ID on first login. Includes an automatic Place ID extractor and clear pointer to Settings for future adjustments.
            </p>
          </div>

          {/* Card 3: Smart Review Funnel */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Smart Review Funnel (/r/[slug])
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Customers tap 👍 or 👎. 👍 redirects directly to your Google review link (writereview?placeid=...). 👎 opens a private feedback form alerting the owner directly, with compliant Google fallback links.
            </p>
          </div>

          {/* Card 4: Automated Contact List & Follow-ups */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Automated Day 3 Follow-Up
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Save customer contacts from finished jobs and trigger SMS requests. Automatically flags customers who haven&apos;t clicked after 72 hours with 1-click batch reminder follow-ups.
            </p>
          </div>

          {/* Card 5: B2C Viral Referral Loop */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              B2C Loop: &quot;Give $20, Get $20&quot;
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Happy customers receive a unique referral code (e.g. ALEX-20) offering $20 off to friends and $20 credit back to them. Redemptions are tracked in your dashboard for easy fulfillment.
            </p>
          </div>

          {/* Card 6: B2B Viral Partner Loop */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              B2B Loop: Unlock Partner Status
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once a business hits 5 new Google reviews, they unlock a VIP Partner Link: &quot;Refer another business owner—they get 1 month free, and you get 1 month free once they subscribe.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
            <Crown className="w-3.5 h-3.5" />
            Simple, Honest Pricing
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            14-Day Free Trial, then <span className="text-amber-400">$29/month</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto">
            Just 1 extra ceramic coating, brake job, or plumbing call easily pays for an entire year of Vouchr.
          </p>

          <div className="my-8 max-w-md mx-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2.5 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Unlimited review funnels &amp; QR codes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Automated Day 3 SMS / Email follow-up reminders</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Private complaint shield (protects Google Maps rating)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>B2C &quot;Give $20, Get $20&quot; customer referral engine</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>B2B Partner Link (Earn free months referring other trades)</span>
            </div>
          </div>

          <button
            onClick={() => handleStartTrial("TRIAL-8492")}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
          >
            Launch Your 14-Day Free Trial Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <p>Vouchr • Google Reviews &amp; Referral Engine for Local Trades &amp; Service Pros</p>
      </footer>
    </div>
  );
}
