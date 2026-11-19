"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { CustomerContact, ContactStatus } from "@/types";
import { formatRelativeDate, isReminderDue } from "@/lib/utils";
import {
  UserPlus,
  Send,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Copy,
  Trash2,
  ExternalLink,
  MessageSquare,
  FileSpreadsheet,
  Check,
  X,
} from "lucide-react";

export default function ContactList() {
  const {
    profile,
    contacts,
    addContact,
    deleteContact,
    importContacts,
    sendReviewRequest,
    triggerDay3Reminder,
    triggerBatchDay3Reminders,
  } = useApp();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Contact Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceRendered, setServiceRendered] = useState("");
  const [serviceDate, setServiceDate] = useState("2026-11-19");
  const [notes, setNotes] = useState("");

  // Import Text Area
  const [importText, setImportText] = useState(
    "Marcus Vance, (555) 902-1144, marcus@vance.io, Brake Replacement\nChloe Bennet, (555) 304-9812, chloe@shield.org, Ceramic Coat & Tint\nLeo Fitz, (555) 771-0023, leo@sciencelab.edu, Annual HVAC Maintenance"
  );

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.serviceRendered.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "reminders") {
      return (
        c.status === "reminder_due" ||
        isReminderDue(c.requestSentAt, c.lastRemindedAt, c.status)
      );
    }
    if (filter === "reviewed") {
      return c.status === "clicked_google";
    }
    if (filter === "sent") {
      return c.status === "request_sent" || c.status === "reminder_sent";
    }
    if (filter === "not_sent") {
      return c.status === "not_sent";
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addContact({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      serviceRendered: serviceRendered.trim() || "Service Job",
      serviceDate,
      status: "not_sent",
      notes: notes.trim(),
    });

    setName("");
    setPhone("");
    setEmail("");
    setServiceRendered("");
    setNotes("");
    setAddModalOpen(false);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = importText.split("\n").filter((l) => l.trim().length > 0);
    const parsed = lines.map((line) => {
      const parts = line.split(",").map((p) => p.trim());
      return {
        name: parts[0] || "Customer",
        phone: parts[1] || "",
        email: parts[2] || "",
        service: parts[3] || "Service",
      };
    });
    importContacts(parsed);
    setImportModalOpen(false);
  };

  const copyCustomerLink = (contact: CustomerContact) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/r/${profile.slug}?c=${contact.id}&ref=${contact.referralCode || ""}`;
    navigator.clipboard.writeText(url);
    setCopiedId(contact.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (contact: CustomerContact) => {
    const isDue =
      contact.status === "reminder_due" ||
      isReminderDue(contact.requestSentAt, contact.lastRemindedAt, contact.status);

    if (contact.status === "clicked_google") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          5★ Left Google Review
        </span>
      );
    }
    if (contact.status === "private_feedback") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <AlertTriangle className="w-3 h-3" />
          Private Feedback Received
        </span>
      );
    }
    if (isDue) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
          <BellRing className="w-3 h-3 text-amber-400" />
          Day 3 Reminder Due
        </span>
      );
    }
    if (contact.status === "reminder_sent") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
          <Clock className="w-3 h-3" />
          Reminder Sent
        </span>
      );
    }
    if (contact.status === "request_sent") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
          <Send className="w-3 h-3 text-slate-400" />
          Request Sent
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/60 text-slate-400 border border-slate-800">
        Not Sent
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Customer Contacts &amp; Follow-Ups
          </h2>
          <p className="text-xs text-slate-400">
            Send review requests right after job completion, with automated Day 3 reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setImportModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            <span>CSV Import</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or service..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-slate-800 text-slate-300 hover:bg-slate-750"
            }`}
          >
            All ({contacts.length})
          </button>
          <button
            onClick={() => setFilter("reminders")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === "reminders"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-slate-800 text-amber-300 hover:bg-slate-750"
            }`}
          >
            Due Reminders (
            {
              contacts.filter(
                (c) =>
                  c.status === "reminder_due" ||
                  isReminderDue(c.requestSentAt, c.lastRemindedAt, c.status)
              ).length
            }
            )
          </button>
          <button
            onClick={() => setFilter("reviewed")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === "reviewed"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-slate-800 text-slate-300 hover:bg-slate-750"
            }`}
          >
            Reviewed ({contacts.filter((c) => c.status === "clicked_google").length})
          </button>
          <button
            onClick={() => setFilter("not_sent")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === "not_sent"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-slate-800 text-slate-300 hover:bg-slate-750"
            }`}
          >
            Not Sent ({contacts.filter((c) => c.status === "not_sent").length})
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Service Rendered</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Referral Code</th>
              <th className="py-3 px-4">Timeline</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No customers found matching your filter.
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => {
                const isDue =
                  contact.status === "reminder_due" ||
                  isReminderDue(
                    contact.requestSentAt,
                    contact.lastRemindedAt,
                    contact.status
                  );

                return (
                  <tr
                    key={contact.id}
                    className="hover:bg-slate-850/50 transition-colors group"
                  >
                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">
                        {contact.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{contact.phone}</span>
                        {contact.email && <span>• {contact.email}</span>}
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-200">
                        {contact.serviceRendered}
                      </span>
                      {contact.notes && (
                        <p className="text-[10px] text-slate-500 italic truncate max-w-[180px]">
                          {contact.notes}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(contact)}</td>

                    {/* Referral Code (B2C Loop) */}
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {contact.referralCode || "N/A"}
                    </td>

                    {/* Timeline */}
                    <td className="py-3.5 px-4 text-[11px] text-slate-400">
                      <div>Job: {contact.serviceDate}</div>
                      {contact.requestSentAt && (
                        <div className="text-slate-500">
                          Sent: {formatRelativeDate(contact.requestSentAt)}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Send Request (if not sent yet) */}
                        {contact.status === "not_sent" && (
                          <button
                            onClick={() => sendReviewRequest(contact.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                            title="Send Review Request via SMS"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Request</span>
                          </button>
                        )}

                        {/* Day 3 Reminder Action */}
                        {isDue && (
                          <button
                            onClick={() => triggerDay3Reminder(contact.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs flex items-center gap-1 transition-colors"
                            title="Send Day 3 Automated Follow-Up"
                          >
                            <BellRing className="w-3 h-3 text-amber-400" />
                            <span>Send Day 3</span>
                          </button>
                        )}

                        {/* Copy direct personalized link */}
                        <button
                          onClick={() => copyCustomerLink(contact)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Copy Direct Customer Review Link"
                        >
                          {copiedId === contact.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove Customer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-400" />
                Add Finished Job Customer
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Miller"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Phone (for SMS)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Service Rendered
                </label>
                <input
                  type="text"
                  value={serviceRendered}
                  onChange={(e) => setServiceRendered(e.target.value)}
                  placeholder="e.g. Full Ceramic Coat or Roof Inspection"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Date of Job
                  </label>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Job Notes
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Vehicle model, roof type, etc."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Save Contact &amp; Generate Referral Code</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                Bulk Import Customers
              </h3>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="p-5 space-y-3 text-xs">
              <p className="text-slate-400">
                Paste one customer per line format: <br />
                <code className="text-amber-400 font-mono">
                  Name, Phone, Email, Service Rendered
                </code>
              </p>

              <textarea
                rows={6}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Import Customers to Review Pipeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
