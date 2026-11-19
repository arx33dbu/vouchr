"use client";

import React from "react";
import { useApp } from "@/lib/store";
import { formatRelativeDate } from "@/lib/utils";
import {
  ShieldAlert,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react";

export default function PrivateFeedbackInbox() {
  const { feedback, resolveFeedback } = useApp();

  const unresolvedCount = feedback.filter((f) => !f.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header explanation */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Customer Experience Shield
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Private Complaints Intercepted
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
            When a customer clicks 👎 on your review funnel, their feedback is routed directly here instead of a public 1-star review on Google Maps.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-zinc-950 px-4 py-2.5 rounded-lg border border-zinc-800 flex-shrink-0">
          <div className="text-xl font-bold text-white">
            {unresolvedCount}
          </div>
          <div className="text-xs text-zinc-400">
            <strong className="text-zinc-200">Pending Resolution</strong>
            <p className="text-[10px] text-zinc-500">Require owner outreach</p>
          </div>
        </div>
      </div>

      {/* List of Feedback */}
      {feedback.length === 0 ? (
        <div className="p-10 text-center rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
          <h3 className="text-sm font-semibold text-white">Inbox Clean</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            No complaints recorded. If a client taps &quot;Could be better&quot;, their message will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map((item) => {
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.resolved
                    ? "bg-zinc-900/30 border-zinc-800/60 opacity-70"
                    : "bg-zinc-900 border-zinc-750"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs">
                          {item.customerName}
                        </span>
                        <div className="flex items-center text-amber-400 text-xs">
                          {Array.from({ length: 3 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3 h-3 ${
                                idx < item.rating
                                  ? "fill-current text-amber-400"
                                  : "text-zinc-700"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                        {item.customerPhone && (
                          <span>Phone: {item.customerPhone}</span>
                        )}
                        {item.customerEmail && (
                          <span>• {item.customerEmail}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {formatRelativeDate(item.submittedAt)}
                    </span>
                    {item.resolved ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                        Resolved
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        Needs Call
                      </span>
                    )}
                  </div>
                </div>

                {/* Feedback Body */}
                <div className="py-2.5 text-xs text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-850 my-2 leading-relaxed font-mono">
                  &quot;{item.feedback}&quot;
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    {item.customerPhone && (
                      <a
                        href={`tel:${item.customerPhone}`}
                        className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Call Customer</span>
                      </a>
                    )}
                    {item.customerPhone && (
                      <a
                        href={`sms:${item.customerPhone}?body=Hi ${item.customerName}, following up regarding your recent service.`}
                        className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                        <span>SMS Customer</span>
                      </a>
                    )}
                  </div>

                  {!item.resolved && (
                    <button
                      onClick={() => resolveFeedback(item.id)}
                      className="px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
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
