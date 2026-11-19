"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { TradeCategory } from "@/types";
import { TRADE_INFO, extractPlaceIdFromUrl, buildGoogleReviewUrl, slugify } from "@/lib/utils";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  Save,
  Building,
  MapPin,
  ExternalLink,
  Shield,
  Key,
  Bell,
  Gift,
  Check,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function SettingsTab() {
  const { profile, updateProfile, setUpgradeModalOpen } = useApp();

  const [name, setName] = useState(profile.name);
  const [slug, setSlug] = useState(profile.slug);
  const [trade, setTrade] = useState<TradeCategory>(profile.trade);
  const [logoUrl, setLogoUrl] = useState(profile.logoUrl || "");
  const [placeId, setPlaceId] = useState(profile.placeId || "");
  const [googleReviewUrl, setGoogleReviewUrl] = useState(profile.googleReviewUrl || "");
  const [autoRemindDay3, setAutoRemindDay3] = useState(profile.autoRemindDay3);
  const [b2cReward, setB2cReward] = useState(profile.b2cReferralReward || 20);
  const [b2cDiscount, setB2cDiscount] = useState(profile.b2cDiscountAmount || 20);
  const [phone, setPhone] = useState(profile.phone || "");
  const [email, setEmail] = useState(profile.email || "");

  const [saved, setSaved] = useState(false);

  const handlePlaceIdChange = (val: string) => {
    const extracted = extractPlaceIdFromUrl(val);
    setPlaceId(extracted);
    const generatedUrl = buildGoogleReviewUrl(extracted);
    setGoogleReviewUrl(generatedUrl);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      slug: slugify(slug || name),
      trade,
      logoUrl: logoUrl.trim(),
      placeId: placeId.trim(),
      googleReviewUrl: googleReviewUrl.trim(),
      autoRemindDay3,
      b2cReferralReward: Number(b2cReward),
      b2cDiscountAmount: Number(b2cDiscount),
      phone: phone.trim(),
      email: email.trim(),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header and save button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Settings &amp; Configuration
          </h2>
          <p className="text-xs text-slate-400">
            Customize your Google review funnel, automated reminders, and referral incentives.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all flex-shrink-0"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Business Profile */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            Business Profile
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Business Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) setSlug(slugify(e.target.value));
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Public Review Funnel Slug
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-slate-900 border border-r-0 border-slate-800 rounded-l-xl text-xs text-slate-400 font-mono">
                /r/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-r-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Trade Category
            </label>
            <select
              value={trade}
              onChange={(e) => setTrade(e.target.value as TradeCategory)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {(Object.keys(TRADE_INFO) as TradeCategory[]).map((t) => (
                <option key={t} value={t}>
                  {TRADE_INFO[t].icon} {TRADE_INFO[t].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Logo or Avatar Image URL
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Owner Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Owner Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@business.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Box 2: Google Maps & Place ID Integration */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Google Maps &amp; Direct Review Target
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Google Place ID
            </label>
            <input
              type="text"
              required
              value={placeId}
              onChange={(e) => handlePlaceIdChange(e.target.value)}
              placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Paste your raw Google Place ID or your Google Maps share link.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Direct Google Write-Review URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={googleReviewUrl}
                onChange={(e) => setGoogleReviewUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
              {googleReviewUrl && (
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium flex items-center gap-1 flex-shrink-0"
                >
                  <span>Test</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>
              )}
            </div>
          </div>

          {/* Automation & Reminders */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  Automated Day 3 Follow-Up Reminders
                </span>
                <p className="text-[11px] text-slate-400">
                  Automatically flags customers who haven&apos;t clicked after 72 hours.
                </p>
              </div>

              <input
                type="checkbox"
                checked={autoRemindDay3}
                onChange={(e) => setAutoRemindDay3(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-0"
              />
            </div>
          </div>

          {/* B2C Referral Settings */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-emerald-400" />
              B2C Referral Incentives
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">
                  Friend Discount ($)
                </label>
                <input
                  type="number"
                  value={b2cDiscount}
                  onChange={(e) => setB2cDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Referrer Reward ($)
                </label>
                <input
                  type="number"
                  value={b2cReward}
                  onChange={(e) => setB2cReward(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Box 3: Authentication & Subscription */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Trial Key &amp; Firebase Session
            </h3>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300">
              {profile.trialKey}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Auth Mode:{" "}
            {profile.isAnonymousAuth
              ? "Firebase Anonymous Auth (Zero-Friction Trial Session)"
              : `Permanent Linked Account (${profile.userEmail})`}
            {" • "}
            Firebase SDK:{" "}
            <span className={isFirebaseConfigured ? "text-emerald-400" : "text-amber-400"}>
              {isFirebaseConfigured ? "Connected Live" : "Local Demo Mode Active"}
            </span>
          </p>
        </div>

        {!profile.isSubscribed ? (
          <button
            type="button"
            onClick={() => setUpgradeModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade to Pro ($29/mo)</span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <CheckCircle className="w-4 h-4" />
            Active Subscription: $29/month
          </span>
        )}
      </div>
    </form>
  );
}
