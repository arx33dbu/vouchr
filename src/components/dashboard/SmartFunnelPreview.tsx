"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Smartphone,
  QrCode,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Send,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function SmartFunnelPreview() {
  const { profile } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<"prompt" | "positive" | "negative">("prompt");
  const [testRating, setTestRating] = useState(2);
  const [testFeedback, setTestFeedback] = useState("");
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [funnelUrl, setFunnelUrl] = useState<string>(`/r/${profile.slug}`);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setFunnelUrl(`${window.location.origin}/r/${profile.slug}`);
    }
  }, [profile.slug]);

  const copyUrl = () => {
    navigator.clipboard.writeText(funnelUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePositiveClick = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    setActiveStep("positive");
  };

  const handleNegativeClick = () => {
    setActiveStep("negative");
  };

  const resetSimulation = () => {
    setActiveStep("prompt");
    setTestSubmitted(false);
    setTestFeedback("");
  };

  return (
    <div className="space-y-6">
      {/* Overview & Sharing Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider border border-emerald-500/20">
              Live &amp; Active
            </span>
            <span className="text-xs text-slate-400">
              Direct Funnel URL
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Smart Review Funnel: <span className="font-mono text-amber-400">/r/{profile.slug}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Send this URL in SMS/Email requests, post it on invoices, or print as a QR code on receipts &amp; vehicle magnets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-white text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy URL</span>
              </>
            )}
          </button>

          <a
            href={`/r/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Two Column Layout: Funnel Architecture + Interactive Mobile Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Explainer & Rules */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              How the Smart Review Funnel Works
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>When Customer Clicks 👍 (Great Experience)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Instantly triggers a Google Review redirect straight to your place ID write-review dialog:
                  <br />
                  <code className="text-emerald-300 text-[10px] break-all font-mono">
                    https://search.google.com/local/writereview?placeid={profile.placeId || "ChIJ..."}
                  </code>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-2 font-bold text-purple-300 mb-1">
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>When Customer Clicks 👎 (Unhappy / Issues)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Opens a direct, private resolution form that delivers an instant SMS/email alert to you before they go to public Google Maps.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <p className="text-[11px] text-slate-400 font-medium">
                  ⚖️ <strong>Google Review Policy Compliant:</strong> We include a subtle, compliant fallback link allowing customers to leave a public review if they still insist, satisfying Google&apos;s anti-gating policies.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Print QR Code Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Print QR Code for Dashboards &amp; Invoices
                </h4>
                <p className="text-[11px] text-slate-400">
                  Stick on vehicle windshields, job receipts, and invoices.
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Print / Save
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Mobile Mockup */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[360px] bg-slate-950 border-4 border-slate-800 rounded-[36px] shadow-2xl p-4 overflow-hidden relative">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-4" />

            {/* Simulated Public Customer View */}
            <div className="min-h-[460px] flex flex-col justify-between py-2 text-center">
              {/* Reset simulator pill */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={resetSimulation}
                  className="text-[10px] text-slate-500 hover:text-amber-400 underline"
                >
                  Reset simulator
                </button>
              </div>

              {/* Brand Header */}
              <div>
                <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto border-2 border-slate-700 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.logoUrl || "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=150&auto=format&fit=crop&q=80"}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-base font-bold text-white mt-3">
                  {profile.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Thank you for choosing our service!
                </p>
              </div>

              {/* Step 1: Prompt State */}
              {activeStep === "prompt" && (
                <div className="my-6 space-y-4 animate-in fade-in">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <p className="text-sm font-semibold text-slate-200">
                      How was your experience with us?
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Tap an option below to leave your feedback:
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handlePositiveClick}
                      className="p-4 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 font-bold flex flex-col items-center gap-2 transition-all transform active:scale-95 group"
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform">
                        👍
                      </span>
                      <span className="text-xs">Great! Loved it</span>
                    </button>

                    <button
                      onClick={handleNegativeClick}
                      className="p-4 rounded-2xl bg-gradient-to-b from-rose-500/20 to-rose-600/10 border border-rose-500/30 hover:border-rose-500/60 text-rose-300 font-bold flex flex-col items-center gap-2 transition-all transform active:scale-95 group"
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform">
                        👎
                      </span>
                      <span className="text-xs">Could be better</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Positive State */}
              {activeStep === "positive" && (
                <div className="my-6 space-y-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                    🎉
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    We&apos;re so glad you had a great experience!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Would you mind taking 10 seconds to share your review on Google? It means the world to our small local business.
                  </p>
                  <a
                    href={profile.googleReviewUrl || "https://search.google.com/local/writereview"}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                  >
                    Post Review on Google Maps ⭐️⭐️⭐️⭐️⭐️
                  </a>

                  {/* B2C Referral Preview */}
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                    🎁 <strong>Bonus:</strong> Share your unique link to give a friend $20 off!
                  </div>
                </div>
              )}

              {/* Step 3: Negative / Private Feedback State */}
              {activeStep === "negative" && (
                <div className="my-4 space-y-2.5 text-left p-3.5 rounded-2xl bg-slate-900 border border-slate-800 animate-in zoom-in-95">
                  {testSubmitted ? (
                    <div className="text-center py-4 space-y-2">
                      <div className="text-2xl">📬</div>
                      <h4 className="text-xs font-bold text-white">
                        Thank you for your honesty.
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        The owner has received your note directly and will reach out to make this right.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-xs font-bold text-rose-300">
                        We&apos;re sorry we didn&apos;t meet expectations.
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Please tell us what went wrong so the owner can make it right:
                      </p>

                      <textarea
                        rows={2}
                        value={testFeedback}
                        onChange={(e) => setTestFeedback(e.target.value)}
                        placeholder="What could we have done better?"
                        className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-[11px] focus:outline-none focus:border-amber-500"
                      />

                      <button
                        onClick={() => setTestSubmitted(true)}
                        className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                      >
                        Send Private Feedback to Owner
                      </button>

                      {/* Google Policy Fallback Link */}
                      <div className="text-center pt-2">
                        <a
                          href={profile.googleReviewUrl || "https://search.google.com/local/writereview"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-slate-500 hover:text-slate-400 underline"
                        >
                          Or write a public review on Google Maps
                        </a>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Footer */}
              <div className="pt-2 text-[10px] text-slate-600">
                Powered by Vouchr • Verified Google Partner Engine
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
