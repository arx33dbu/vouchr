"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { getDaysRemainingInTrial } from "@/lib/utils";
import {
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Crown,
  Key,
  RotateCcw,
  CheckCircle2,
  Share2,
} from "lucide-react";

export default function Navbar() {
  const {
    profile,
    setUpgradeModalOpen,
    setOnboardingOpen,
    resetToDemo,
  } = useApp();

  const [daysLeft, setDaysLeft] = React.useState<number>(11);

  React.useEffect(() => {
    if (profile?.trialStartDate) {
      setDaysLeft(
        getDaysRemainingInTrial(profile.trialStartDate, profile.trialDurationDays || 14)
      );
    }
  }, [profile.trialStartDate, profile.trialDurationDays]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  vouchr<span className="text-amber-400">.</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  Local Pros
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-[200px]">
                {profile.name || "Setup Your Business"}
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Public Funnel Link Button */}
          {profile.slug && (
            <Link
              href={`/r/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Preview Funnel (/r/{profile.slug})</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
            </Link>
          )}

          {/* Trial / Subscription Status Pill */}
          {profile.isSubscribed ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pro Active ($29/mo)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-semibold">{daysLeft} Days</span>
                <span className="hidden sm:inline text-amber-400/80">Trial Left</span>
              </div>

              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <Crown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keep for</span> $29/mo
              </button>
            </div>
          )}

          {/* Session / Settings dropdown / reset */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
            <button
              onClick={() => setOnboardingOpen(true)}
              title="Edit Business Profile & Place ID"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 text-xs transition-colors"
            >
              <span className="hidden lg:inline text-xs font-medium mr-1.5 text-slate-300">
                Setup
              </span>
              ⚙️
            </button>

            <button
              onClick={resetToDemo}
              title="Reset to sample demo data"
              className="p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
