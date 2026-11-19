"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { generateTrialKey } from "@/lib/utils";
import {
  Sparkles,
  Key,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyParam = searchParams.get("key") || searchParams.get("trial");

  const { loginWithTrialKey, profile } = useApp();

  const [inputKey, setInputKey] = useState(keyParam || "");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle direct magic link access
  useEffect(() => {
    if (keyParam) {
      handleLogin(keyParam);
    }
  }, [keyParam]);

  const handleLogin = async (trialKey: string) => {
    if (!trialKey.trim()) {
      setErrorMsg("Please enter your trial key.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const ok = await loginWithTrialKey(trialKey.trim());
      if (ok) {
        router.push("/dashboard");
      } else {
        setErrorMsg("Failed to authenticate with trial key.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error logging in";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewTrial = () => {
    const newKey = generateTrialKey();
    handleLogin(newKey);
  };

  const handleLaunchDemo = () => {
    handleLogin("TRIAL-8492");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
      {/* Background glow dots */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 mb-3">
            <Sparkles className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            vouchr<span className="text-amber-400">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero-Friction Access Key Login
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(inputKey);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Enter Your Access / Trial Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                required
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                placeholder="e.g. TRIAL-8492"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              No password needed upfront. Uses Firebase Anonymous authentication.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span>Access My Review Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Launch Shortcuts */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
          <button
            type="button"
            onClick={handleGenerateNewTrial}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs text-amber-300 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate New 14-Day Trial Key</span>
          </button>

          <button
            type="button"
            onClick={handleLaunchDemo}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
            <span>Open Pre-Loaded Demo (Apex Detailing)</span>
          </button>
        </div>

        {/* Security / Terms */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>7 or 14-day free trial. Then $29/mo to keep active.</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
          Loading Vouchr Trial Gateway...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
