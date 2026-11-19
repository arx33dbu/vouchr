"use client";

import React, { useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import OnboardingModal from "@/components/OnboardingModal";
import AccountUpgradeModal from "@/components/AccountUpgradeModal";
import OverviewStats from "@/components/dashboard/OverviewStats";
import ContactList from "@/components/dashboard/ContactList";
import SmartFunnelPreview from "@/components/dashboard/SmartFunnelPreview";
import ReferralHub from "@/components/dashboard/ReferralHub";
import B2BPartnerProgram from "@/components/dashboard/B2BPartnerProgram";
import PrivateFeedbackInbox from "@/components/dashboard/PrivateFeedbackInbox";
import SettingsTab from "@/components/dashboard/SettingsTab";
import { useApp } from "@/lib/store";
import {
  LayoutDashboard,
  Users,
  Smartphone,
  Gift,
  Award,
  ShieldAlert,
  Settings,
  BellRing,
} from "lucide-react";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { feedback, contacts, partnerStats } = useApp();

  const unresolvedFeedback = feedback.filter((f) => !f.resolved).length;
  const dueReminders = contacts.filter((c) => c.status === "reminder_due").length;

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "contacts",
      label: "Contacts & Follow-Ups",
      icon: Users,
      badge: dueReminders > 0 ? `${dueReminders} due` : undefined,
      badgeColor: "bg-amber-500 text-slate-950 font-bold",
    },
    { id: "funnel", label: "Smart Funnel", icon: Smartphone },
    { id: "referrals", label: "B2C Referrals", icon: Gift },
    {
      id: "partner",
      label: "B2B Partner Loop",
      icon: Award,
      badge: partnerStats.unlocked ? "VIP" : "Locked",
      badgeColor: partnerStats.unlocked
        ? "bg-emerald-500 text-slate-950 font-bold"
        : "bg-slate-800 text-slate-400",
    },
    {
      id: "feedback",
      label: "Rating Shield Inbox",
      icon: ShieldAlert,
      badge: unresolvedFeedback > 0 ? `${unresolvedFeedback}` : undefined,
      badgeColor: "bg-rose-500 text-white font-bold",
    },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="animate-in fade-in duration-150">
          {activeTab === "overview" && (
            <OverviewStats onTabChange={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === "contacts" && <ContactList />}
          {activeTab === "funnel" && <SmartFunnelPreview />}
          {activeTab === "referrals" && <ReferralHub />}
          {activeTab === "partner" && <B2BPartnerProgram />}
          {activeTab === "feedback" && <PrivateFeedbackInbox />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </main>

      {/* Global Modals */}
      <OnboardingModal />
      <AccountUpgradeModal />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-400 text-xs flex items-center justify-center">
          Loading Vouchr Dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
