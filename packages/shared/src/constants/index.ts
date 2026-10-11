export const COMPLIANCE_DISCLAIMER =
  "InvestorHub Australia is a digital marketplace and information platform. It does not provide personal financial advice and does not guarantee investment performance. Past performance is not indicative of future returns. Users should conduct their own independent due diligence and seek licensed financial advice before making investment decisions.";

export const USER_ROLES = {
  INVESTOR: "INVESTOR",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const CATEGORIES = {
  FUND_MANAGER: "FUND_MANAGER",
  PROPERTY_INVESTOR: "PROPERTY_INVESTOR",
  TRADING_EDUCATOR: "TRADING_EDUCATOR",
  TRADING_CHANNEL: "TRADING_CHANNEL",
  FINANCIAL_ADVISER: "FINANCIAL_ADVISER",
  PORTFOLIO_ANALYST: "PORTFOLIO_ANALYST",
  TAX_SPECIALIST: "TAX_SPECIALIST",
  MORTGAGE_BROKER: "MORTGAGE_BROKER",
  SMSF_SPECIALIST: "SMSF_SPECIALIST",
  INVESTOR_COMMUNITY: "INVESTOR_COMMUNITY",
  MARKET_ANALYST: "MARKET_ANALYST",
} as const;

export type CategoryKey = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const CATEGORY_DETAILS: Record<
  CategoryKey,
  { label: string; description: string; icon: string; popularTags: string[] }
> = {
  FUND_MANAGER: {
    label: "Fund Managers",
    description: "Institutional & boutique asset managers, wholesale funds, and venture vehicles.",
    icon: "Briefcase",
    popularTags: ["Equities", "Fixed Income", "Private Debt", "Hedge Funds", "Venture Capital"],
  },
  PROPERTY_INVESTOR: {
    label: "Property Specialists",
    description: "Buyer's agents, commercial syndicates, property developers, and yield analysts.",
    icon: "Home",
    popularTags: ["Buyer's Advocacy", "Commercial", "Residential Syndicates", "SMSF Property", "Subdivision"],
  },
  TRADING_EDUCATOR: {
    label: "Trading Educators",
    description: "Accredited academies, price action mentors, and technical analysis masterclasses.",
    icon: "GraduationCap",
    popularTags: ["Technical Analysis", "Price Action", "Futures", "Options Trading", "Mentorship"],
  },
  TRADING_CHANNEL: {
    label: "Live Trading Channels",
    description: "Live desk streams, crypto alpha rooms, and real-time market trade breakdowns.",
    icon: "Radio",
    popularTags: ["Crypto Live", "ASX 200 Desk", "Forex Sessions", "Daily Market Open"],
  },
  FINANCIAL_ADVISER: {
    label: "Financial Advisers",
    description: "Licensed wealth managers, retirement strategists, and estate planning experts.",
    icon: "ShieldCheck",
    popularTags: ["Comprehensive Advice", "Wealth Creation", "Retirement Transition", "Estate Planning"],
  },
  PORTFOLIO_ANALYST: {
    label: "Portfolio Analysts",
    description: "Risk modelers, diversification auditors, and macro asset allocation specialists.",
    icon: "BarChart3",
    popularTags: ["Risk Audit", "Asset Allocation", "Diversification Score", "Stress Testing"],
  },
  TAX_SPECIALIST: {
    label: "Tax Specialists",
    description: "Chartered accountants for capital gains, crypto tax, trusts, and corporate structures.",
    icon: "Calculator",
    popularTags: ["CGT Optimization", "Crypto Taxation", "Trust Structures", "Foreign Income"],
  },
  MORTGAGE_BROKER: {
    label: "Mortgage Brokers",
    description: "Specialist investment lending, commercial debt structuring, and equity access.",
    icon: "CreditCard",
    popularTags: ["Investment Loans", "Refinancing", "Commercial Debt", "SMSF Borrowing"],
  },
  SMSF_SPECIALIST: {
    label: "SMSF Specialists",
    description: "Self-Managed Super Fund establishment, compliance, audit, and strategy.",
    icon: "Landmark",
    popularTags: ["SMSF Setup", "SMSF Compliance", "Property in Super", "Annual Audit"],
  },
  INVESTOR_COMMUNITY: {
    label: "Investor Communities",
    description: "Peer investment syndicates, angel networks, and specialized investor hubs.",
    icon: "Users",
    popularTags: ["Angel Syndicates", "Value Investors", "Dividend Club", "Founders & Angels"],
  },
  MARKET_ANALYST: {
    label: "Market Analysts",
    description: "Independent equity research, sector deep dives, and macro forecasting desks.",
    icon: "TrendingUp",
    popularTags: ["ASX Research", "Commodities Forecast", "Macro Strategy", "Small-Cap Discovery"],
  },
};

export const AUSTRALIAN_REGIONS = [
  "National (Australia-wide)",
  "Sydney (NSW)",
  "Melbourne (VIC)",
  "Brisbane (QLD)",
  "Perth (WA)",
  "Adelaide (SA)",
  "Hobart (TAS)",
  "Canberra (ACT)",
  "Gold Coast (QLD)",
] as const;

export const PROVIDER_STATUSES = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
} as const;

export const VERIFICATION_STATUSES = {
  UNVERIFIED: "UNVERIFIED",
  IN_REVIEW: "IN_REVIEW",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
} as const;

export const ENQUIRY_STATUSES = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  QUALIFIED: "QUALIFIED",
  BOOKED: "BOOKED",
  WON: "WON",
  LOST: "LOST",
  SPAM: "SPAM",
} as const;

export const REVIEW_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  FLAGGED: "FLAGGED",
} as const;
