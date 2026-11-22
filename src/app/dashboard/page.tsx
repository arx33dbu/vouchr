"use client";

import React, { useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import OnboardingModal from "@/components/OnboardingModal";
import AccountUpgradeModal from "@/components/AccountUpgradeModal";
import OverviewStats from "@/components/dashboard/OverviewStats";
import ContactList from "@/components/dashboard/ContactList";
import ReferralHub from "@/components/dashboard/ReferralHub";
import PrivateFeedbackInbox from "@/components/dashboard/PrivateFeedbackInbox";
import SettingsTab from "@/components/dashboard/SettingsTab";
import { useApp } from "@/lib/store";
import {
  LayoutDashboard,
  Users,
  Gift,
  ShieldAlert,
  Settings,
} from "lucide-react";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { feedback, contacts } = useApp();

  const unresolvedFeedback = feedback.filter((f) => !f.resolved).length;
  const dueReminders = contacts.filter((c) => c.status === "reminder_due").length;

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "contacts",
      label: "Customers",
      icon: Users,
      badge: dueReminders > 0 ? `${dueReminders} due` : undefined,
      badgeColor: "bg-zinc-800 text-zinc-300 border border-zinc-700",
    },
    {
      id: "feedback",
      label: "Complaints",
      icon: ShieldAlert,
      badge: unresolvedFeedback > 0 ? `${unresolvedFeedback}` : undefined,
      badgeColor: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    },
    { id: "referrals", label: "Referrals", icon: Gift },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-zinc-800 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-zinc-100 text-zinc-950 font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900 font-medium"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-zinc-950" : "text-zinc-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${tab.badgeColor}`}
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
          {activeTab === "feedback" && <PrivateFeedbackInbox />}
          {activeTab === "referrals" && <ReferralHub />}
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
        <div className="min-h-screen bg-zinc-950 text-zinc-400 text-xs flex items-center justify-center">
          Loading Vouchr Dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
