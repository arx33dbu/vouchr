"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { generateTrialKey } from "@/lib/utils";
import {
  Key,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyParam = searchParams.get("key") || searchParams.get("trial");

  const { loginWithTrialKey } = useApp();

  const [inputKey, setInputKey] = useState(keyParam || "");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4 font-sans selection:bg-zinc-800 selection:text-white">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm p-6 sm:p-7">
        {/* Brand */}
        <div className="mb-6">
          <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-950 font-black text-sm mb-3">
            V
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Client Access Key
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Access your review dashboard and referral pipeline.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(inputKey);
          }}
          className="space-y-3.5"
        >
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Access Key / Trial Code
            </label>
            <div className="relative">
              <Key className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                required
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                placeholder="e.g. TRIAL-8492"
                className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              No password required upfront. Uses anonymous authentication.
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
            className="w-full py-2.5 px-3 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Connecting...</span>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Shortcuts */}
        <div className="mt-5 pt-4 border-t border-zinc-800 space-y-2">
          <button
            type="button"
            onClick={handleGenerateNewTrial}
            className="w-full py-2 px-3 rounded-lg bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-xs text-zinc-300 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-zinc-400" />
            <span>Generate New 14-Day Key</span>
          </button>

          <button
            type="button"
            onClick={handleLaunchDemo}
            className="w-full py-2 px-3 rounded-lg bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800/80 text-xs text-zinc-400 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Demo Account (Apex Detailing)</span>
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
          <span>14-day free trial • $29/mo recurring</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-xs">
          Loading login gateway...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
