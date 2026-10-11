"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../../../../components/marketplace/Navbar";
import { Footer } from "../../../../components/marketplace/Footer";
import { useAuth } from "../../../../context/auth-context";
import { EnquiryDto } from "@investorhub/shared";
import { apiClient } from "../../../../lib/api-client";
import {
  Sparkles,
  Users,
  Calendar,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  X,
  MessageSquare,
  Columns,
  List,
  Save,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const PIPELINE_COLUMNS = [
  { key: "NEW", label: "New Leads", color: "border-sky-500/40 text-sky-400" },
  { key: "CONTACTED", label: "Contacted", color: "border-amber-500/40 text-amber-400" },
  { key: "QUALIFIED", label: "Qualified", color: "border-purple-500/40 text-purple-400" },
  { key: "BOOKED", label: "Consultation Booked", color: "border-indigo-500/40 text-indigo-400" },
  { key: "WON", label: "Won / Converted", color: "border-emerald-500/40 text-emerald-400" },
  { key: "LOST", label: "Lost", color: "border-rose-500/40 text-rose-400" },
];

export default function ProviderLeadsPage() {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<EnquiryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [selectedLead, setSelectedLead] = useState<EnquiryDto | null>(null);
  const [internalNoteText, setInternalNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEnquiries();
  }, [user]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await apiClient<{ success: boolean; data: EnquiryDto[] }>("/provider/enquiries");
      if (res?.success && Array.isArray(res.data)) {
        setEnquiries(res.data);
      } else {
        loadFallbackLeads();
      }
    } catch {
      loadFallbackLeads();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackLeads = () => {
    const fallback: EnquiryDto[] = [
      {
        id: "lead-1",
        providerId: "p1",
        investorName: "Lachlan Evans",
        investorEmail: "lachlan.evans@sydneyinvestor.com.au",
        investorPhone: "+61 412 889 123",
        type: "CONSULTATION",
        message: "Looking to allocate $250,000 from our family SMSF into wholesale equities mandate. Would like to review fund attribution and fee hurdle.",
        preferredContactMethod: "PHONE",
        preferredTime: "Morning (9am - 12pm AEST)",
        status: "NEW",
        leadScore: 92,
        aiSummary: "High-intent SMSF wholesale allocation inquiry ($250k+ capital). Requested morning telephone consultation.",
        source: "MARKETPLACE_SEARCH",
        createdAt: new Date().toISOString(),
        statusUpdatedAt: new Date().toISOString(),
      },
      {
        id: "lead-2",
        providerId: "p1",
        investorName: "Hamish Campbell",
        investorEmail: "hamish.c@perthmining.com.au",
        investorPhone: "+61 408 991 223",
        type: "ENQUIRY",
        message: "Seeking an independent portfolio risk audit for an existing $800k portfolio before shifting a portion into private credit.",
        preferredContactMethod: "EMAIL",
        preferredTime: "Afternoon",
        status: "CONTACTED",
        leadScore: 78,
        aiSummary: "Substantial portfolio ($800k) risk diagnostic enquiry. Emailed fund performance tear sheet.",
        source: "DIRECT_PROFILE",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        statusUpdatedAt: new Date().toISOString(),
      },
      {
        id: "lead-3",
        providerId: "p1",
        investorName: "Sophie Nguyen",
        investorEmail: "sophie.nguyen@melbourne.me",
        investorPhone: "+61 419 773 441",
        type: "CONSULTATION",
        message: "Interested in commercial logistics property syndication with 7%+ net target yield. Meeting booked for next Tuesday.",
        preferredContactMethod: "PHONE",
        preferredTime: "Anytime",
        status: "BOOKED",
        leadScore: 85,
        aiSummary: "Commercial property yield enquiry. Intro meeting scheduled.",
        source: "FEATURED_BANNER",
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        statusUpdatedAt: new Date().toISOString(),
      },
      {
        id: "lead-4",
        providerId: "p1",
        investorName: "Alexander Wright",
        investorEmail: "a.wright@sydneyholdings.test",
        investorPhone: "+61 433 111 888",
        type: "CONSULTATION",
        message: "Completed investor mandate onboarding. Funds transferring to custodian account.",
        preferredContactMethod: "EMAIL",
        status: "WON",
        leadScore: 95,
        aiSummary: "Successfully onboarded wholesale client.",
        source: "DIRECT",
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        statusUpdatedAt: new Date().toISOString(),
      },
    ];
    setEnquiries(fallback);
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      await apiClient(`/provider/enquiries/${leadId}`, {
        method: "PATCH",
        data: { status: newStatus },
      });
      setEnquiries((prev) =>
        prev.map((item) => (item.id === leadId ? { ...item, status: newStatus as any } : item))
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus as any });
      }
    } catch {
      // Local optimistic update
      setEnquiries((prev) =>
        prev.map((item) => (item.id === leadId ? { ...item, status: newStatus as any } : item))
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus as any });
      }
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNote(true);
    try {
      await apiClient(`/provider/enquiries/${selectedLead.id}`, {
        method: "PATCH",
        data: { internalNotes: internalNoteText },
      });
      setSelectedLead({ ...selectedLead, internalNotes: internalNoteText });
      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === selectedLead.id ? { ...item, internalNotes: internalNoteText } : item
        )
      );
    } catch {
      setSelectedLead({ ...selectedLead, internalNotes: internalNoteText });
    } finally {
      setSavingNote(false);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.investorName.toLowerCase().includes(q) ||
      e.investorEmail.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#070D1F] flex flex-col">
      <Navbar />

      {/* Header Bar */}
      <div className="bg-[#040813] border-b border-surface-border py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-xs text-slate-400 hover:text-white transition">
                &larr; Dashboard
              </Link>
              <span className="text-slate-600">/</span>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-light" />
                <span>Leads & Enquiries Pipeline CRM</span>
              </h1>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              High-intent investor connections with automated AI lead scoring
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex p-1 bg-surface-50 rounded-xl border border-white/5">
              <button
                onClick={() => setViewMode("kanban")}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === "kanban" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  viewMode === "table" ? "bg-primary text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main CRM Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Search & Stats Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter leads by investor name or text..."
              className="w-full bg-surface-50 border border-surface-border rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primary transition"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Total: <strong className="text-white">{enquiries.length}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Hot: <strong className="text-emerald-400">{enquiries.filter((e) => e.leadScore >= 80).length}</strong>
            </span>
          </div>
        </div>

        {/* Kanban Board View */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
            {PIPELINE_COLUMNS.map((col) => {
              const columnLeads = filteredEnquiries.filter((e) => e.status === col.key);
              return (
                <div
                  key={col.key}
                  className="glass-panel p-3 rounded-2xl border border-surface-border flex flex-col min-w-[210px] bg-[#0A122A]/70"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                    <span className="text-xs font-bold text-white">{col.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                      {columnLeads.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {columnLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setInternalNoteText(lead.internalNotes || "");
                        }}
                        className="p-3 rounded-xl bg-surface-100 hover:bg-surface-200 border border-white/5 hover:border-primary/40 cursor-pointer transition space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white truncate max-w-[120px]">
                            {lead.investorName}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                              lead.leadScore >= 80
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : lead.leadScore >= 60
                                ? "bg-primary/20 text-accent-cyan border-primary/30"
                                : "bg-white/5 text-slate-400 border-white/10"
                            }`}
                          >
                            Score: {lead.leadScore}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {lead.aiSummary || lead.message}
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px]">
                            {lead.type}
                          </span>
                          <span className="group-hover:text-accent-cyan transition flex items-center gap-0.5">
                            Details &rarr;
                          </span>
                        </div>
                      </div>
                    ))}

                    {columnLeads.length === 0 && (
                      <div className="text-center py-8 text-[11px] text-slate-600">
                        No leads in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="glass-panel rounded-2xl border border-surface-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-50 border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Investor Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">AI Lead Score</th>
                    <th className="py-3 px-4">AI Summary</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredEnquiries.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setInternalNoteText(lead.internalNotes || "");
                      }}
                      className="hover:bg-white/5 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-bold text-white">
                        {lead.investorName}
                        <div className="text-[10px] text-slate-400 font-normal">{lead.investorEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-semibold">
                          {lead.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                            lead.leadScore >= 80
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : lead.leadScore >= 60
                              ? "bg-primary/20 text-accent-cyan border-primary/30"
                              : "bg-white/5 text-slate-400 border-white/10"
                          }`}
                        >
                          {lead.leadScore} ({lead.leadScore >= 80 ? "Hot" : "Warm"})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm truncate text-slate-400">
                        {lead.aiSummary || lead.message}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {lead.status}
                      </td>
                      <td className="py-3.5 px-4 text-right text-accent-cyan font-semibold">
                        Open &rarr;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg h-full glass-panel bg-[#0B1430] border-l border-surface-border p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Top Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Scored Lead
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        selectedLead.leadScore >= 80
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : "bg-primary/20 text-accent-cyan border-primary/40"
                      }`}
                    >
                      Score: {selectedLead.leadScore}/100
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedLead.investorName}</h3>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Changer */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1.5">
                  Pipeline Stage
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {PIPELINE_COLUMNS.map((col) => (
                    <button
                      key={col.key}
                      onClick={() => handleUpdateStatus(selectedLead.id, col.key)}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition ${
                        selectedLead.status === col.key
                          ? "bg-primary text-white border-primary shadow-ai-glow"
                          : "bg-surface-50 text-slate-400 hover:text-white border-white/5"
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Summary Box */}
              <div className="p-4 rounded-2xl bg-surface-50 border border-primary/20 space-y-2">
                <div className="text-xs font-bold text-accent-cyan flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Insight & Intent Synthesis</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedLead.aiSummary || "Direct inquiry received through verified marketplace profile."}
                </p>
              </div>

              {/* Contact Details */}
              <div className="p-4 rounded-2xl bg-surface-50 border border-white/5 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-slate-400" /> Email:
                  </span>
                  <a href={`mailto:${selectedLead.investorEmail}`} className="text-accent-cyan hover:underline">
                    {selectedLead.investorEmail}
                  </a>
                </div>
                {selectedLead.investorPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400" /> Phone:
                    </span>
                    <a href={`tel:${selectedLead.investorPhone}`} className="text-emerald-400 font-semibold hover:underline">
                      {selectedLead.investorPhone}
                    </a>
                  </div>
                )}
                {selectedLead.preferredTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" /> Preferred Contact:
                    </span>
                    <span>{selectedLead.preferredTime}</span>
                  </div>
                )}
              </div>

              {/* Full Message */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Original Inquiry Message
                </label>
                <div className="p-4 rounded-2xl bg-surface-50 border border-white/5 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedLead.message}
                </div>
              </div>

              {/* Internal Notes Editor */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  Private Practice Notes
                </label>
                <textarea
                  rows={3}
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="Record call notes, proposal documents sent, or next steps..."
                  className="w-full bg-surface-50 border border-surface-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-primary leading-relaxed"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNote}
                    className="py-1.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingNote ? "Saving..." : "Save Note"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-center text-[10px] text-slate-500">
              InvestorHub Lead ID: {selectedLead.id}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
