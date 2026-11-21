"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { TradeCategory } from "@/types";
import { TRADE_INFO, extractPlaceIdFromUrl, slugify } from "@/lib/utils";
import {
  MapPin,
  Building2,
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

  const [name, setName] = useState(profile.name || "");
  const [trade, setTrade] = useState<TradeCategory>(profile.trade || "auto_detailing");
  const [logoUrl, setLogoUrl] = useState(profile.logoUrl || "");
  const [rawGoogleInput, setRawGoogleInput] = useState(profile.placeId || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [extractedPlaceId, setExtractedPlaceId] = useState(profile.placeId || "");
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

    const finalPlaceId = extractedPlaceId || rawGoogleInput.trim();

    completeOnboarding({
      name: name.trim(),
      trade,
      logoUrl: logoUrl.trim(),
      placeId: finalPlaceId,
      phone: phone.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Business Review Setup
            </h2>
            <p className="text-xs text-zinc-400">
              Set up your business name and direct Google Review link (15 seconds).
            </p>
          </div>

          {profile.onboardingCompleted && (
            <button
              onClick={() => setOnboardingOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto space-y-4 text-xs">
          {/* Business Name */}
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">
              Business Name <span className="text-zinc-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Precision Auto Detailing"
                className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            {name && (
              <p className="text-[11px] text-zinc-500 mt-1">
                Your review link will be:{" "}
                <span className="text-zinc-300 font-mono">/r/{slugify(name)}</span>
              </p>
            )}
          </div>

          {/* Trade Category */}
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">
              Service Category
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
                    className={`p-2 rounded-lg text-left text-xs transition-all border cursor-pointer ${
                      selected
                        ? "bg-zinc-800 border-zinc-600 text-white font-medium"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span className="truncate block">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo / Profile Picture */}
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">
              Logo or Avatar URL
            </label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex-shrink-0">
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
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] text-zinc-500">Presets:</span>
                  {AVATAR_PRESETS.slice(0, 4).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLogoUrl(p.url)}
                      className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 transition-colors cursor-pointer"
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
              <label className="text-zinc-300 font-medium flex items-center gap-1.5">
                Google Maps Link or Place ID <span className="text-zinc-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowHelper(!showHelper)}
                className="text-[11px] text-zinc-400 hover:text-white underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                Find Place ID
              </button>
            </div>

            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                required
                value={rawGoogleInput}
                onChange={(e) => handleGoogleInputChange(e.target.value)}
                placeholder="Paste Google Maps URL or Place ID (e.g. ChIJ...)"
                className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-500">
              <span>
                Detected Place ID:{" "}
                <span className="font-mono text-zinc-300">
                  {extractedPlaceId ? extractedPlaceId.slice(0, 18) + "..." : "None"}
                </span>
              </span>
              <button
                type="button"
                onClick={() => handleGoogleInputChange("ChIJN1t_tDeuEmsRUsoyG83frY4")}
                className="text-zinc-400 hover:underline text-[10px] cursor-pointer"
              >
                Use sample Place ID
              </button>
            </div>

            {showHelper && (
              <div className="mt-2 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <p className="font-medium text-zinc-200">How to get your direct review link:</p>
                <ol className="list-decimal pl-4 space-y-0.5">
                  <li>Search your business name on Google Maps.</li>
                  <li>Click &quot;Share&quot; and copy the link, then paste it here.</li>
                  <li>Our parser automatically extracts your unique Place ID.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Owner Phone */}
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">
              Owner Phone Number (For urgent complaint alerts)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          {/* Explicit requirement: Pointer note at bottom */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
            <Info className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Note:</strong> You can edit your Place ID, logo, trade type, and review links anytime in the <strong>Settings</strong> tab.
            </p>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Save &amp; Open Review Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
