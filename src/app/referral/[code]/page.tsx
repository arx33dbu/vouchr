"use client";

import React, { useState, use, Suspense } from "react";
import { useApp } from "@/lib/store";
import {
  Gift,
  CheckCircle2,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

interface PageProps {
  params: Promise<{ code: string }>;
}

function CustomerReferralClaimContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const code = resolvedParams.code.toUpperCase();

  const { profile, referrals, redeemB2CReferral } = useApp();

  const [friendName, setFriendName] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [claimed, setClaimed] = useState(false);

  // Find matching referral if in store
  const matchedRef = referrals.find(
    (r) => r.code.toUpperCase() === code
  );

  const referrerName = matchedRef?.referrerName || "A friend";
  const discountAmount = matchedRef?.discountAmount || profile.b2cDiscountAmount || 20;

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim() || !friendPhone.trim()) return;

    redeemB2CReferral(code, friendName.trim(), friendPhone.trim());
    setClaimed(true);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Header */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-slate-500 py-2">
        <span className="font-semibold text-slate-400">{profile.name}</span>
        <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
          <Gift className="w-3.5 h-3.5" />
          Verified Referral Discount
        </span>
      </header>

      {/* Main Claim Card */}
      <main className="max-w-md w-full mx-auto my-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Accent Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Business Logo */}
        <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto border-2 border-slate-700 shadow-md mb-3 bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              profile.logoUrl ||
              "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=150&auto=format&fit=crop&q=80"
            }
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mb-5">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/20">
            Special Invitation Voucher
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
            {referrerName} gave you{" "}
            <span className="text-emerald-400">${discountAmount} OFF</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Valid towards your next service at {profile.name}
          </p>
        </div>

        {/* Voucher Ticket UI */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-slate-950 border-2 border-dashed border-emerald-500/40 relative">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Discount Voucher
              </span>
              <div className="text-3xl font-black text-white">
                ${discountAmount} OFF
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Voucher Code
              </span>
              <div className="font-mono text-base font-bold text-amber-400">
                {code}
              </div>
            </div>
          </div>
        </div>

        {claimed ? (
          <div className="space-y-4 py-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Voucher Claimed, {friendName}!
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Your ${discountAmount} credit has been registered for your phone number ({friendPhone}). Mention code <strong>{code}</strong> when booking with {profile.name}.
              </p>
            </div>

            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <Phone className="w-4 h-4" />
                <span>Call to Book Service: {profile.phone}</span>
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={handleClaim} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="e.g. Robert Vance"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Mobile Phone (to claim voucher)
              </label>
              <input
                type="text"
                required
                value={friendPhone}
                onChange={(e) => setFriendPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Claim My ${discountAmount} Voucher</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-md w-full mx-auto text-center text-[10px] text-slate-600 py-3">
        Powered by Vouchr Referral Network
      </footer>
    </div>
  );
}

export default function CustomerReferralClaimPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-400 text-xs flex items-center justify-center">
          Loading referral voucher...
        </div>
      }
    >
      <CustomerReferralClaimContent {...props} />
    </Suspense>
  );
}
