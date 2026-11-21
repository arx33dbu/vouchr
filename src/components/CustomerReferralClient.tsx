"use client";

import React, { useState, Suspense } from "react";
import { useApp } from "@/lib/store";
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
} from "lucide-react";

interface CustomerReferralClientProps {
  code: string;
}

function CustomerReferralInner({ code: rawCode }: CustomerReferralClientProps) {
  const code = rawCode.toUpperCase();
  const { profile, referrals, bookFriendJob } = useApp();

  const [friendName, setFriendName] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [serviceNeeded, setServiceNeeded] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const matchedRef = referrals.find(
    (r) => r.code.toUpperCase() === code
  );

  const referrerName = matchedRef?.referrerName || "A verified customer";
  const discountAmount = matchedRef?.discountAmount || profile.b2cDiscountAmount || 20;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim() || !friendPhone.trim()) return;

    bookFriendJob(code, {
      name: friendName.trim(),
      phone: friendPhone.trim(),
      email: friendEmail.trim(),
      serviceNeeded: serviceNeeded.trim() || "Service Appointment",
      preferredDate,
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Header */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          {profile.logoUrl && (
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.logoUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span className="font-semibold text-zinc-200 tracking-tight">
            {profile.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
          <span>Client Referral Voucher</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl w-full mx-auto my-8">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Referral Voucher Tag */}
          <div className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-5 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                New Client Discount
              </p>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                ${discountAmount} off your first service
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Courtesy of referral from <strong className="text-zinc-200">{referrerName}</strong>
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider block">
                Voucher Code
              </span>
              <span className="font-mono text-sm font-bold text-zinc-200 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800 inline-block mt-0.5">
                {code}
              </span>
            </div>
          </div>

          {submitted ? (
            <div className="space-y-5 py-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Voucher Attached to Your Booking Request</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Thank you, <strong>{friendName}</strong>. Our team has received your request for <em>{serviceNeeded || "service"}</em>. We will contact you at <strong>{friendPhone}</strong> to confirm your appointment time.
                </p>
              </div>

              {/* Purchase Rule Callout */}
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-1.5 font-medium text-zinc-300">
                  <Info className="w-3.5 h-3.5 text-zinc-400" />
                  <span>How your ${discountAmount} discount is applied:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-[11px]">
                  <li>Your ${discountAmount} credit will be deducted directly on your final invoice upon service completion.</li>
                  <li>Once your service is completed and payment is processed, {referrerName}&apos;s ${discountAmount} referral reward will be unlocked on their account.</li>
                </ul>
              </div>

              {profile.phone && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
                  <span>Need immediate assistance?</span>
                  <a
                    href={`tel:${profile.phone}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Shop: {profile.phone}</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                <div>
                  Enter your details below to schedule your appointment with <strong>{profile.name}</strong>. Your ${discountAmount} voucher will be deducted from your final invoice once the service is performed.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Your Name <span className="text-zinc-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    placeholder="First and last name"
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Phone Number <span className="text-zinc-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={friendPhone}
                    onChange={(e) => setFriendPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Service Needed
                  </label>
                  <input
                    type="text"
                    value={serviceNeeded}
                    onChange={(e) => setServiceNeeded(e.target.value)}
                    placeholder="e.g. Full Ceramic Coat, Brakes, Inspection"
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Preferred Appointment Date (Optional)
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Request Booking with ${discountAmount} Voucher</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-zinc-500 text-center pt-1">
                Discount applied at time of service completion. No upfront payment required.
              </p>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-xl w-full mx-auto text-center text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-4">
        {profile.name} • Client Referral Program
      </footer>
    </div>
  );
}

export default function CustomerReferralClient({ code }: CustomerReferralClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-zinc-400 text-xs flex items-center justify-center">
          Loading referral voucher...
        </div>
      }
    >
      <CustomerReferralInner code={code} />
    </Suspense>
  );
}
