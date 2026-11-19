"use client";

import React from "react";
import { useApp } from "@/lib/store";
import { formatRelativeDate } from "@/lib/utils";
import {
  ShieldAlert,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Star,
  MessageSquare,
  AlertOctagon,
} from "lucide-react";

export default function PrivateFeedbackInbox() {
  const { feedback, resolveFeedback } = useApp();

  const unresolvedCount = feedback.filter((f) => !f.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header explanation */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-rose-500/10 to-slate-900 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-300 font-semibold text-[11px] uppercase tracking-wider">
              Google Rating Shield
            </span>
            <span className="text-xs text-slate-400">
              Private Feedback Intercepts
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Complaints intercepted before touching Google Maps
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            When a customer clicks 👎 on your funnel, their complaint is routed directly to this inbox instead of a public 1-star review on Google. Reach out fast to resolve the problem!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800">
          <div className="text-2xl font-black text-purple-400">
            {unresolvedCount}
          </div>
          <div className="text-xs text-slate-300">
            <strong>Unresolved</strong>
            <p className="text-[10px] text-slate-500">Require owner call-back</p>
          </div>
        </div>
      </div>

      {/* List of Feedback */}
      {feedback.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
            🛡️
          </div>
          <h3 className="text-base font-bold text-white">Inbox Clean</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No unhappy customer feedback recorded. Any customer who clicks 👎 on your review funnel will alert you here immediately.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map((item) => {
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.resolved
                    ? "bg-slate-900/30 border-slate-800/60 opacity-75"
                    : "bg-slate-900/80 border-purple-500/30 shadow-lg shadow-purple-500/5"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                      👎
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {item.customerName}
                        </span>
                        {/* Rating stars */}
                        <div className="flex items-center text-amber-400 text-xs">
                          {Array.from({ length: 3 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3 h-3 ${
                                idx < item.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        {item.customerPhone && (
                          <span>Phone: {item.customerPhone}</span>
                        )}
                        {item.customerEmail && (
                          <span>• Email: {item.customerEmail}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {formatRelativeDate(item.submittedAt)}
                    </span>
                    {item.resolved ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Resolved
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
                        Urgent Attention
                      </span>
                    )}
                  </div>
                </div>

                {/* Feedback Body */}
                <div className="py-3 text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 my-2.5 font-medium leading-relaxed">
                  &quot;{item.feedback}&quot;
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    {item.customerPhone && (
                      <a
                        href={`tel:${item.customerPhone}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Call Customer</span>
                      </a>
                    )}
                    {item.customerPhone && (
                      <a
                        href={`sms:${item.customerPhone}?body=Hi ${item.customerName}, this is the owner of ${item.feedback ? "" : ""}. I saw your note and wanted to reach out right away to make things right for you.`}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>Send Apology SMS</span>
                      </a>
                    )}
                  </div>

                  {!item.resolved && (
                    <button
                      onClick={() => resolveFeedback(item.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Issue Resolved</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
