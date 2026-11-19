"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import {
  ExternalLink,
  Copy,
  Check,
  QrCode,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  ArrowRight,
  Info,
} from "lucide-react";

export default function SmartFunnelPreview() {
  const { profile } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<"prompt" | "positive" | "negative">("prompt");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Customer Touchpoint
            </span>
            <span className="text-xs text-zinc-500 font-mono">/r/{profile.slug}</span>
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Customer Review Funnel
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Send via SMS after service, include on invoices, or print as a QR code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-850 text-zinc-200 text-xs font-medium border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy URL</span>
              </>
            )}
          </button>

          <a
            href={`/r/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Two Column Layout: Specifications + Interactive Mobile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-4 text-xs">
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3.5">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-300" />
              Routing Logic
            </h3>

            <div className="space-y-2.5 text-zinc-300">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-2 font-medium text-emerald-400">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Great Experience (Thumbs Up)</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Redirects directly to your Google Maps review dialog:
                  <br />
                  <code className="text-zinc-300 text-[10px] break-all font-mono">
                    https://search.google.com/local/writereview?placeid={profile.placeId || "ChIJ..."}
                  </code>
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-2 font-medium text-zinc-300">
                  <ThumbsDown className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Could Be Better (Thumbs Down)</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Opens a private owner resolution form to intercept complaints before they reach Google Maps.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-400">
                <strong>Google Policy Compliant:</strong> Includes a compliant fallback link allowing customers to review on Google Maps if requested.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">
                  Invoice &amp; Magnet QR Code
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Print for work orders, trucks, and receipts.
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
            >
              Print
            </button>
          </div>
        </div>

        {/* Right Column: Mobile Frame */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[340px] bg-zinc-950 border-2 border-zinc-800 rounded-3xl p-4 shadow-sm relative">
            <div className="w-20 h-3 bg-zinc-850 rounded-full mx-auto mb-3" />

            <div className="min-h-[420px] flex flex-col justify-between py-2 text-center text-xs">
              <div className="flex justify-end mb-1">
                <button
                  onClick={resetSimulation}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
                >
                  Reset preview
                </button>
              </div>

              <div>
                {profile.logoUrl && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden mx-auto border border-zinc-800 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.logoUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-sm font-bold text-white">
                  {profile.name}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Thank you for your service with us.
                </p>
              </div>

              {activeStep === "prompt" && (
                <div className="my-5 space-y-3">
                  <p className="text-xs font-medium text-zinc-200">
                    How was your experience with our team?
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={handlePositiveClick}
                      className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ThumbsUp className="w-5 h-5 text-emerald-400" />
                      <span className="text-[11px] font-semibold">Great</span>
                    </button>

                    <button
                      onClick={handleNegativeClick}
                      className="p-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ThumbsDown className="w-5 h-5 text-zinc-400" />
                      <span className="text-[11px] font-semibold">Could improve</span>
                    </button>
                  </div>
                </div>
              )}

              {activeStep === "positive" && (
                <div className="my-4 space-y-2.5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left">
                  <h4 className="text-xs font-semibold text-white">
                    Thank you for your feedback!
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Redirecting to Google Maps to leave your review...
                  </p>
                  <a
                    href={profile.googleReviewUrl || "https://search.google.com/local/writereview"}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-2 px-3 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-center text-xs"
                  >
                    Open Google Maps Review
                  </a>

                  <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 leading-relaxed">
                    Share $20 with a friend. Once their service job is paid, your $20 credit unlocks.
                  </div>
                </div>
              )}

              {activeStep === "negative" && (
                <div className="my-3 space-y-2 text-left p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  {testSubmitted ? (
                    <div className="text-center py-3">
                      <p className="text-xs font-semibold text-white">
                        Feedback sent to owner.
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        We will follow up to make this right.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-xs font-semibold text-zinc-200">
                        Please let us know what happened:
                      </h4>
                      <textarea
                        rows={2}
                        value={testFeedback}
                        onChange={(e) => setTestFeedback(e.target.value)}
                        placeholder="Details about your service..."
                        className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-md text-white text-[11px] focus:outline-none focus:border-zinc-500"
                      />
                      <button
                        onClick={() => setTestSubmitted(true)}
                        className="w-full py-1.5 rounded-md bg-zinc-100 text-zinc-950 font-semibold text-[11px]"
                      >
                        Send Private Feedback
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="text-[10px] text-zinc-500 pt-1">
                Protected by Vouchr Client Funnel
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
