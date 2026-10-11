import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/auth-context";
import { AiChatAssistant } from "../components/ai/AiChatAssistant";

export const metadata: Metadata = {
  title: "InvestorHub Australia | Australia's Trusted Investor Marketplace",
  description:
    "Discover, compare and connect with verified Australian fund managers, property specialists, trading educators, financial advisers, and SMSF experts.",
  openGraph: {
    title: "InvestorHub Australia",
    description: "Verified financial and investment specialists across Australia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070D1F] text-slate-100 antialiased selection:bg-primary selection:text-white">
        <AuthProvider>
          {children}
          <AiChatAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
