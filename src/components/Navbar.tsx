"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { getDaysRemainingInTrial } from "@/lib/utils";
import {
  ExternalLink,
  Crown,
  RotateCcw,
  CheckCircle2,
  Share2,
  SlidersHorizontal,
} from "lucide-react";

export default function Navbar() {
  const {
    profile,
    setUpgradeModalOpen,
    setOnboardingOpen,
    resetToClean,
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-950 font-black text-sm">
              V
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">
                  vouchr
                </span>
                <span className="text-[10px] text-zinc-400 font-medium px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                  Trade Pro
                </span>
              </div>
            </div>
          </Link>
          <span className="text-zinc-600 hidden sm:inline">/</span>
          <span className="text-xs text-zinc-400 hidden sm:block truncate max-w-[200px]">
            {profile.name || "Business Setup"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Public Funnel Link Button */}
          {profile.slug && (
            <Link
              href={`/r/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Customer Review Link</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </Link>
          )}

          {/* Trial / Subscription Status Pill */}
          {profile.isSubscribed ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>Pro Active ($29/mo)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{daysLeft}d left in trial</span>
              </div>

              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Crown className="w-3 h-3" />
                <span>Keep Pro ($29/mo)</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 pl-1 border-l border-zinc-800">
            <button
              onClick={() => setOnboardingOpen(true)}
              title="Edit Profile & Google Place ID"
              className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-900 text-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">Setup</span>
            </button>

            <button
              onClick={resetToClean}
              title="Reset and start fresh account"
              className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-md hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
