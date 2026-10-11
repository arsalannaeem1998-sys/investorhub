import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#040711] border-t border-surface-border text-slate-400 text-sm">
      {/* Compliance Boundary Alert */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="p-4 rounded-2xl bg-surface-50 border border-white/10 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-300">
            <strong className="text-white block mb-0.5">IMPORTANT COMPLIANCE & LEGAL NOTICE:</strong>
            InvestorHub operates strictly as an independent directory, marketplace, and information aggregation platform.
            InvestorHub does not hold an Australian Financial Services Licence (AFSL), does not provide personal financial
            advice, does not issue financial products, and does not guarantee investment performance or capital safety.
            Investors should review the relevant Product Disclosure Statement (PDS) or Financial Services Guide (FSG) and
            seek advice from a licensed adviser before making financial decisions.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              INVESTOR<span className="text-accent-cyan">HUB</span>
              <span className="text-xs text-slate-400 font-mono ml-1.5">AU</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Australia's trusted digital marketplace connecting individual, SMSF, and wholesale investors with verified
            investment specialists and financial educators.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-verified">
            <ShieldCheck className="w-4 h-4" />
            <span>Independent Verification & Review Moderation</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
            Marketplace
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/providers?category=FUND_MANAGER" className="hover:text-white transition">Fund Managers</Link></li>
            <li><Link href="/providers?category=PROPERTY_INVESTOR" className="hover:text-white transition">Property Specialists</Link></li>
            <li><Link href="/providers?category=TRADING_EDUCATOR" className="hover:text-white transition">Trading Educators</Link></li>
            <li><Link href="/providers?category=FINANCIAL_ADVISER" className="hover:text-white transition">Financial Advisers</Link></li>
            <li><Link href="/providers?category=SMSF_SPECIALIST" className="hover:text-white transition">SMSF Specialists</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
            Investor Tools
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/match" className="hover:text-accent-cyan transition text-accent-cyan">AI Match Finder</Link></li>
            <li><Link href="/compare" className="hover:text-white transition">Provider Comparison</Link></li>
            <li><Link href="/insights" className="hover:text-white transition">Market Insights</Link></li>
            <li><Link href="/login" className="hover:text-white transition">Investor Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
            For Providers
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/become-a-provider" className="hover:text-white transition">List Your Business</Link></li>
            <li><Link href="/login" className="hover:text-white transition">Provider Dashboard</Link></li>
            <li><Link href="/become-a-provider" className="hover:text-white transition">Verification Requirements</Link></li>
            <li><Link href="/login" className="hover:text-white transition">Lead Management</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} InvestorHub Australia Pty Ltd. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-slate-300 transition">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300 transition">Risk Disclosure</Link>
            <Link href="#" className="hover:text-slate-300 transition">Complaints & Fraud Reporting</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
