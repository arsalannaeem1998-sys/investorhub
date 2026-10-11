"use client";

import React, { useState } from "react";
import { Sparkles, MessageSquare, X, Send, ShieldCheck, ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";
import { apiClient } from "../../lib/api-client";
import Link from "next/link";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  suggestedAction?: { label: string; href: string };
}

export function AiChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "G'day! I am your InvestorHub AI Assistant. I can guide you through verified provider categories, AFSL verification requirements, and direct consultations.",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    try {
      const res = await apiClient<{ success: boolean; data: any }>("/ai/chat", {
        data: { message: text },
      });

      if (res?.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.reply,
            suggestedAction: res.data.suggestedAction,
          },
        ]);
      } else {
        fallbackReply(text);
      }
    } catch {
      fallbackReply(text);
    } finally {
      setLoading(false);
    }
  };

  const fallbackReply = (q: string) => {
    const lower = q.toLowerCase();
    let reply =
      "InvestorHub connects Australian investors with verified investment professionals across 11 disciplines. Every verified provider holds audited AFSL or ABN credentials.";
    let action = { label: "Explore Providers", href: "/providers" };

    if (lower.includes("should i buy") || lower.includes("stock") || lower.includes("advice")) {
      reply =
        "As an informational assistant, I cannot provide personal financial product advice under Australian law. I can connect you with licensed financial advisers who hold appropriate AFSL authorizations.";
      action = { label: "View Financial Advisers", href: "/providers?category=FINANCIAL_ADVISER" };
    } else if (lower.includes("smsf")) {
      reply =
        "For Self-Managed Super Funds, we feature verified accountants and specialists who assist with fund establishment, ATO annual compliance, and LRBA property borrowing.";
      action = { label: "Explore SMSF Specialists", href: "/providers?category=SMSF_SPECIALIST" };
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: reply,
        suggestedAction: action,
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 p-3.5 rounded-2xl bg-gradient-to-tr from-primary via-accent-violet to-accent-cyan text-white shadow-2xl shadow-primary/40 hover:scale-105 transition flex items-center justify-center relative group"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="sr-only">Open AI Assistant</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-verified border-2 border-[#070D1F]" />
        </button>
      </div>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] glass-panel bg-[#091129]/95 rounded-3xl border border-surface-border shadow-2xl overflow-hidden flex flex-col h-[520px] animate-slide-up backdrop-blur-2xl">
          {/* Header */}
          <div className="p-4 bg-[#050A1A] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-none">InvestorHub AI Copilot</div>
                <div className="text-[10px] text-emerald-400 font-medium leading-none mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Compliance Guard Active
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-white rounded-br-xs"
                      : "bg-surface-50 text-slate-200 border border-white/5 rounded-bl-xs"
                  }`}
                >
                  {m.content}

                  {m.suggestedAction && (
                    <div className="mt-2.5 pt-2 border-t border-white/10">
                      <Link
                        href={m.suggestedAction.href}
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] font-bold text-accent-cyan hover:underline flex items-center gap-1"
                      >
                        <span>{m.suggestedAction.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="p-3 rounded-2xl bg-surface-50 border border-white/5 max-w-[80%] text-slate-400 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-spin" />
                <span>Generating response...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2 border-t border-white/5 flex gap-1.5 overflow-x-auto text-[10px] bg-surface-50">
            <button
              onClick={() => handleSend("How does verification work?")}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap"
            >
              How verification works?
            </button>
            <button
              onClick={() => handleSend("Find me an SMSF specialist")}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap"
            >
              SMSF specialists
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#050A1A] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about providers, verification..."
              className="flex-1 bg-surface-50 border border-surface-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputVal.trim()}
              className="p-2 rounded-xl bg-primary hover:bg-primary-hover text-white transition disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
