"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { TradeCategory } from "@/types";
import { TRADE_INFO, extractPlaceIdFromUrl, slugify } from "@/lib/utils";
import {
  Sparkles,
  MapPin,
  Building2,
  Image as ImageIcon,
  Check,
  X,
  HelpCircle,
  ArrowRight,
  Info,
} from "lucide-react";

const AVATAR_PRESETS = [
  {
    label: "Auto Detailing",
    url: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=150&auto=format&fit=crop&q=80",
    trade: "auto_detailing",
  },
  {
    label: "Mechanic",
    url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=150&auto=format&fit=crop&q=80",
    trade: "mechanic",
  },
  {
    label: "Roofing",
    url: "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=150&auto=format&fit=crop&q=80",
    trade: "roofing",
  },
  {
    label: "Plumbing",
    url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=150&auto=format&fit=crop&q=80",
    trade: "plumbing",
  },
  {
    label: "Landscaping",
    url: "https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=150&auto=format&fit=crop&q=80",
    trade: "landscaping",
  },
  {
    label: "Snow Removal",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=80",
    trade: "snow_removal",
  },
];

export default function OnboardingModal() {
  const { profile, onboardingOpen, setOnboardingOpen, completeOnboarding } = useApp();

  const [name, setName] = useState(profile.name || "Apex Precision Auto Detailing");
  const [trade, setTrade] = useState<TradeCategory>(profile.trade || "auto_detailing");
  const [logoUrl, setLogoUrl] = useState(
    profile.logoUrl ||
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=150&auto=format&fit=crop&q=80"
  );
  const [rawGoogleInput, setRawGoogleInput] = useState(
    profile.placeId || "ChIJN1t_tDeuEmsRUsoyG83frY4"
  );
  const [phone, setPhone] = useState(profile.phone || "(555) 392-8172");
  const [extractedPlaceId, setExtractedPlaceId] = useState(profile.placeId || "ChIJN1t_tDeuEmsRUsoyG83frY4");
  const [showHelper, setShowHelper] = useState(false);

  if (!onboardingOpen) return null;

  const handleGoogleInputChange = (val: string) => {
    setRawGoogleInput(val);
    const extracted = extractPlaceIdFromUrl(val);
    setExtractedPlaceId(extracted);
  };

  const handleTradeSelect = (newTrade: TradeCategory) => {
    setTrade(newTrade);
    const match = AVATAR_PRESETS.find((p) => p.trade === newTrade);
    if (match) {
      setLogoUrl(match.url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalPlaceId = extractedPlaceId || "ChIJN1t_tDeuEmsRUsoyG83frY4";

    completeOnboarding({
      name: name.trim(),
      trade,
      logoUrl: logoUrl.trim(),
      placeId: finalPlaceId,
      phone: phone.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  15-Second Setup
                </h2>
                <p className="text-xs text-slate-400">
                  Configure your review funnel to start collecting 5-star Google reviews
                </p>
              </div>
            </div>

            {profile.onboardingCompleted && (
              <button
                onClick={() => setOnboardingOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto space-y-5">
          {/* Business Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Business Name <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Auto Detailing or Summit Roofing"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            {name && (
              <p className="text-[11px] text-slate-500 mt-1">
                Your funnel link will be:{" "}
                <span className="text-amber-400 font-mono">/r/{slugify(name)}</span>
              </p>
            )}
          </div>

          {/* Trade Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Trade / Service Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(TRADE_INFO) as TradeCategory[]).slice(0, 6).map((key) => {
                const info = TRADE_INFO[key];
                const selected = trade === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => handleTradeSelect(key)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-all border ${
                      selected
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-200 font-semibold"
                        : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-base">{info.icon}</span>
                    <span className="truncate">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo / Profile Picture */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Logo / Profile Photo
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl || AVATAR_PRESETS[0].url}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Paste image URL or choose preset below"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500">Quick presets:</span>
                  {AVATAR_PRESETS.slice(0, 4).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLogoUrl(p.url)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      {p.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Link / Place ID */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                Google Maps Link or Place ID <span className="text-amber-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowHelper(!showHelper)}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                How to find Place ID?
              </button>
            </div>

            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                required
                value={rawGoogleInput}
                onChange={(e) => handleGoogleInputChange(e.target.value)}
                placeholder="Paste your Google Maps link or Place ID (e.g. ChIJ...)"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono text-xs"
              />
            </div>

            {/* Extracted preview badge */}
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>
                Detected Place ID:{" "}
                <span className="font-mono text-emerald-400">
                  {extractedPlaceId ? extractedPlaceId.slice(0, 20) + "..." : "None"}
                </span>
              </span>
              <button
                type="button"
                onClick={() => handleGoogleInputChange("ChIJN1t_tDeuEmsRUsoyG83frY4")}
                className="text-amber-400 hover:underline text-[10px]"
              >
                Use sample Place ID
              </button>
            </div>

            {showHelper && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1 animate-in fade-in">
                <p className="font-medium text-amber-300">How to get your direct review link:</p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-400 text-[11px]">
                  <li>Search your business name on Google Maps.</li>
                  <li>Click &quot;Share&quot; and copy the link, then paste it right here.</li>
                  <li>
                    Or search your business in Google&apos;s free{" "}
                    <a
                      href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 underline"
                    >
                      Place ID Finder
                    </a>
                    .
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Notification Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Owner Phone (For instant unhappy customer SMS alerts)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* The explicit spec requirement: Note at the bottom pointing to Settings for future edits */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            <Info className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <p>
              <strong>Note:</strong> Don&apos;t worry about being 100% perfect right now—you
              can edit your Place ID, logo, and review links anytime in the{" "}
              <strong>Settings</strong> tab.
            </p>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
            >
              <span>Complete Setup &amp; Launch Review Engine (15s)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
