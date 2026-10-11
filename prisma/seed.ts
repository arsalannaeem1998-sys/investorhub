import { PrismaClient, Role, UserStatus, Category, ProviderStatus, VerificationStatus, EnquiryStatus, EnquiryType, ReviewStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting InvestorHub Australia database seed...");

  // Clear existing records in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.featuredPlacement.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.article.deleteMany();
  await prisma.articleCategory.deleteMany();
  await prisma.compareShortlist.deleteMany();
  await prisma.favourite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.enquiryActivity.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.verificationDocument.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.providerService.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.investorProfile.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash("InvestorHub2026!Secure", salt);

  // 1. Admin Users
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@investorhub.test",
      passwordHash: defaultPasswordHash,
      fullName: "InvestorHub Super Admin",
      phone: "+61 2 9000 1000",
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  const moderatorAdmin = await prisma.user.create({
    data: {
      email: "moderator@investorhub.test",
      passwordHash: defaultPasswordHash,
      fullName: "Compliance Officer Sarah",
      phone: "+61 2 9000 1001",
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  // 2. Article Categories & Articles
  const catMacro = await prisma.articleCategory.create({
    data: { name: "Macroeconomics & Markets", slug: "macro-markets" },
  });
  const catSMSF = await prisma.articleCategory.create({
    data: { name: "SMSF & Retirement", slug: "smsf-retirement" },
  });
  const catProperty = await prisma.articleCategory.create({
    data: { name: "Property Strategies", slug: "property-strategies" },
  });
  const catTrading = await prisma.articleCategory.create({
    data: { name: "Technical Trading", slug: "technical-trading" },
  });

  await prisma.article.createMany({
    data: [
      {
        slug: "rba-rate-cycle-investor-playbook-2026",
        title: "Navigating the RBA Rate Trajectory: A 2026 Australian Investor Playbook",
        excerpt: "How monetary policy shifts are reshaping yields across commercial property, dividend equities, and wholesale fixed income.",
        body: "The Reserve Bank of Australia continues to calibrate cash rates amid evolving macroeconomic conditions. In this comprehensive guide, we review how private debt funds and high-yielding ASX equities perform relative to benchmark cash rates.",
        categoryId: catMacro.id,
        authorName: "Marcus Vance, Chief Macro Strategist",
        status: "PUBLISHED",
        tags: ["RBA", "Fixed Income", "ASX 200", "Macro"],
        seoTitle: "RBA Interest Rate Cycle Guide for Australian Investors (2026)",
        seoDescription: "Discover how RBA cash rate decisions impact commercial property and equity yields in Australia.",
      },
      {
        slug: "property-syndicates-vs-reits-australia",
        title: "Unlisted Property Syndicates vs ASX REITs: Risk, Liquidity, and Yield",
        excerpt: "Comparing unlisted commercial property syndicates with listed real estate investment trusts for wholesale and SMSF investors.",
        body: "Investors seeking exposure to industrial logistics and healthcare real estate often weigh listed liquidity against unlisted valuation stability. This breakdown explores gearing levels, capital preservation, and distribution mechanics.",
        categoryId: catProperty.id,
        authorName: "Elena Rostova",
        status: "PUBLISHED",
        tags: ["Commercial Property", "REITs", "Yield", "Syndicates"],
      },
      {
        slug: "smsf-property-borrowing-lrba-guide",
        title: "The Ultimate Guide to Limited Recourse Borrowing (LRBA) in Your SMSF",
        excerpt: "Everything trustees need to know about purchasing residential and commercial property through superannuation legally.",
        body: "Limited Recourse Borrowing Arrangements (LRBAs) require strict compliance with the Superannuation Industry (Supervision) Act 1993. Learn key hurdles, loan-to-value caps, and single-acquirable asset requirements.",
        categoryId: catSMSF.id,
        authorName: "James MacIntyre, SMSF Specialist",
        status: "PUBLISHED",
        tags: ["SMSF", "LRBA", "Compliance", "ASIC"],
      },
      {
        slug: "elliott-wave-price-action-for-asx-traders",
        title: "Elliott Wave & Institutional Order Flow in Modern ASX 200 Trading",
        excerpt: "How elite traders combine technical market structure with volume profile to navigate intraday index volatility.",
        body: "Trading the ASX 200 requires understanding liquidity sweeps at opening auction and London overlap. Here we detail wave theory applications on major Australian banking and mining blue-chips.",
        categoryId: catTrading.id,
        authorName: "Tyler Harrison",
        status: "PUBLISHED",
        tags: ["Elliott Wave", "Trading", "ASX 200", "Price Action"],
      },
    ],
  });

  // 3. 10 Realistic Investors
  const investorUsers = [];
  const investorProfiles = [
    { name: "Lachlan Evans", type: "HNW", state: "NSW", interests: ["FUND_MANAGER", "PROPERTY_INVESTOR"] },
    { name: "Chloe Bennett", type: "BEGINNER", state: "VIC", interests: ["TRADING_EDUCATOR", "FINANCIAL_ADVISER"] },
    { name: "Liam O'Connor", type: "SMSF", state: "QLD", interests: ["SMSF_SPECIALIST", "PROPERTY_INVESTOR"] },
    { name: "Zara Patel", type: "ACTIVE_TRADER", state: "NSW", interests: ["TRADING_CHANNEL", "TRADING_EDUCATOR"] },
    { name: "Hamish Campbell", type: "SELF_MANAGED", state: "WA", interests: ["MARKET_ANALYST", "PORTFOLIO_ANALYST"] },
    { name: "Sophie Nguyen", type: "PROPERTY", state: "VIC", interests: ["PROPERTY_INVESTOR", "MORTGAGE_BROKER"] },
    { name: "Alexander Wright", type: "HNW", state: "NSW", interests: ["FUND_MANAGER", "TAX_SPECIALIST"] },
    { name: "Olivia Taylor", type: "BEGINNER", state: "SA", interests: ["FINANCIAL_ADVISER", "INVESTOR_COMMUNITY"] },
    { name: "Daniel Rossi", type: "CRYPTO", state: "QLD", interests: ["TRADING_CHANNEL", "TAX_SPECIALIST"] },
    { name: "Mia Anderson", type: "LONG_TERM", state: "VIC", interests: ["FUND_MANAGER", "SMSF_SPECIALIST"] },
  ];

  for (let i = 0; i < investorProfiles.length; i++) {
    const prof = investorProfiles[i];
    const user = await prisma.user.create({
      data: {
        email: `investor${i + 1}@investorhub.test`,
        passwordHash: defaultPasswordHash,
        fullName: prof.name,
        phone: `+61 4${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: Role.INVESTOR,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
        investorProfile: {
          create: {
            investorType: prof.type,
            state: prof.state,
            interests: prof.interests,
            riskProfile: i % 2 === 0 ? "BALANCED" : "HIGH_GROWTH",
          },
        },
      },
    });
    investorUsers.push(user);
  }

  // 4. 20 Realistic Fictional Providers
  const providerDataList = [
    {
      companyName: "Apex Horizons Wealth Management",
      slug: "apex-horizons-wealth",
      category: Category.FUND_MANAGER,
      tagline: "Institutional-grade wholesale equity and multi-asset strategies.",
      overview: "Apex Horizons Wealth is a Sydney-based boutique asset manager catering to family offices, wholesale investors, and SMSF portfolios. Our focus is long-term capital compounding and downside volatility mitigation through fundamental research.",
      specialities: ["Australian Equities", "Global Long/Short", "Multi-Asset Funds"],
      serviceRegions: ["Sydney (NSW)", "Melbourne (VIC)", "National (Australia-wide)"],
      websiteUrl: "https://apexhorizonswealth.com.au",
      contactEmail: "contact@apexhorizonswealth.com.au",
      contactPhone: "+61 2 8920 3400",
      minInvestment: "$100,000",
      feeSummary: "1.10% Base Management + 15% Performance hurdle",
      riskProfile: "Balanced Growth",
      aumText: "$240M+ AUM",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      isFeatured: true,
      avgRating: 4.9,
      reviewCount: 14,
      services: [
        { title: "Wholesale Australian Equities Alpha Fund", description: "Targeting top-quartile ASX 100 industrial and tech innovators." },
        { title: "SMSF Segregated Account Mandate", description: "Customized portfolio governance tailored to trustee return requirements." }
      ],
      team: [
        { name: "David Sterling", role: "Chief Investment Officer", bio: "Ex-Macquarie equities research head with 22 years market experience." }
      ]
    },
    {
      companyName: "Pacific Yield Property Partners",
      slug: "pacific-yield-property",
      category: Category.PROPERTY_INVESTOR,
      tagline: "Commercial logistics and healthcare property syndication across QLD & NSW.",
      overview: "Pacific Yield curates institutional commercial property syndicates for private investors, delivering monthly cash distributions backed by long-term corporate leases and inflation-linked escalators.",
      specialities: ["Industrial Logistics", "Healthcare Centers", "Commercial Syndicates"],
      serviceRegions: ["Brisbane (QLD)", "Gold Coast (QLD)", "Sydney (NSW)"],
      websiteUrl: "https://pacificyield.com.au",
      contactEmail: "syndicates@pacificyield.com.au",
      contactPhone: "+61 7 3100 4880",
      minInvestment: "$50,000",
      feeSummary: "No upfront acquisition fee. 1% management.",
      riskProfile: "Conservative Income",
      aumText: "$180M Assets Under Control",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      isFeatured: true,
      avgRating: 4.8,
      reviewCount: 9,
      services: [
        { title: "Brisbane Airport Logistics Syndicate", description: "Fully tenanted prime logistics center with 7.2% initial net cash yield." }
      ],
      team: [
        { name: "Melissa Thorne", role: "Managing Director", bio: "Commercial property specialist with $400M in executed transactions." }
      ]
    },
    {
      companyName: "Quantum Edge Trading Academy",
      slug: "quantum-edge-trading",
      category: Category.TRADING_EDUCATOR,
      tagline: "Professional price action and order flow education for retail traders.",
      overview: "Quantum Edge provides systematic education covering liquidity analysis, risk mitigation, and algorithmic execution for individuals trading the ASX, US Equities, and Forex.",
      specialities: ["Price Action", "Futures & Options", "Order Flow Analysis"],
      serviceRegions: ["Melbourne (VIC)", "National (Australia-wide)"],
      websiteUrl: "https://quantumedge.com.au",
      contactEmail: "learn@quantumedge.com.au",
      minInvestment: "N/A (Education)",
      feeSummary: "Courses from $1,200 to $4,500 for mentorship",
      riskProfile: "Speculative",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      isFeatured: true,
      avgRating: 4.9,
      reviewCount: 18,
      services: [
        { title: "12-Week Institutional Price Action Masterclass", description: "Structured daily live analysis, risk protocols, and execution coaching." }
      ],
      team: [
        { name: "Brendan Croft", role: "Head Trader & Mentor", bio: "15 years full-time index futures and commodities trader." }
      ]
    },
    {
      companyName: "Aurora Macro Live Alpha Desk",
      slug: "aurora-macro-desk",
      category: Category.TRADING_CHANNEL,
      tagline: "Daily live streaming market opens, macro breakdowns, and live order books.",
      overview: "Aurora Macro brings wholesale trading floor insights directly to subscribers through high-definition live desks covering ASX 200 open, US cash sessions, and global macro events.",
      specialities: ["Live ASX Sessions", "US Tech Desk", "Crypto Alpha"],
      serviceRegions: ["National (Australia-wide)"],
      websiteUrl: "https://auroralivedesk.com",
      contactEmail: "stream@auroralivedesk.com",
      feeSummary: "$89/month streaming pass",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      isFeatured: false,
      avgRating: 4.7,
      reviewCount: 12,
      services: [
        { title: "Morning Bell Live Commentary", description: "Real-time market depth and volume profile before 10:00 AM ASX open." }
      ],
      team: [{ name: "Alex Chen", role: "Desk Anchor", bio: "Former hedge fund derivative analyst." }]
    },
    {
      companyName: "Beacon Financial & Wealth Advisory",
      slug: "beacon-financial-advisory",
      category: Category.FINANCIAL_ADVISER,
      tagline: "Independent, fee-for-service financial planning and estate architecture.",
      overview: "Beacon Financial is a fiduciary, fee-only financial advisory firm helping professionals and business owners structure wealth, minimize tax, and secure retirement longevity.",
      specialities: ["Retirement Planning", "Wealth Transition", "Superannuation Structuring"],
      serviceRegions: ["Adelaide (SA)", "Melbourne (VIC)", "National (Australia-wide)"],
      websiteUrl: "https://beaconwealth.com.au",
      contactEmail: "advice@beaconwealth.com.au",
      minInvestment: "$250,000 Portfolio",
      feeSummary: "Flat annual fee from $4,400. No commissions.",
      riskProfile: "Conservative to Balanced",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      isFeatured: true,
      avgRating: 5.0,
      reviewCount: 11,
      services: [
        { title: "Retirement Readiness Roadmap", description: "Detailed 20-year cash flow model factoring super, pensions, and capital gains." }
      ],
      team: [{ name: "Gregory Scott, CFP", role: "Principal Adviser", bio: "Certified Financial Planner with AFSL accreditation." }]
    },
    {
      companyName: "Vanguardian Risk & Portfolio Analytics",
      slug: "vanguardian-risk-analytics",
      category: Category.PORTFOLIO_ANALYST,
      tagline: "Objective portfolio health audits and quantitative stress testing.",
      overview: "We offer unbiased analytical reviews of existing investment portfolios, evaluating hidden correlations, management fee drag, and tail-risk exposure.",
      specialities: ["Portfolio Stress Testing", "Asset Allocation Audit", "Fee Drag Analysis"],
      serviceRegions: ["Perth (WA)", "National (Australia-wide)"],
      contactEmail: "audit@vanguardiananalytics.com.au",
      feeSummary: "$1,850 per independent portfolio diagnostic",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      isFeatured: false,
      avgRating: 4.8,
      reviewCount: 6,
      services: [
        { title: "Full Portfolio Diagnostic Report", description: "35-page institutional tear sheet highlighting downside scenarios and exposure overlap." }
      ],
      team: [{ name: "Dr. Karen Lin", role: "Lead Quantitative Analyst", bio: "PhD in Financial Econometrics." }]
    },
    {
      companyName: "Meridian Capital Taxation Specialists",
      slug: "meridian-capital-tax",
      category: Category.TAX_SPECIALIST,
      tagline: "Strategic tax planning for active investors, property developers, and family trusts.",
      overview: "Meridian Capital advises high-net-worth individuals and corporate trustees on capital gains tax concessions, discretionary trust distributions, and digital asset tax compliance.",
      specialities: ["CGT Strategies", "Trust Structuring", "Crypto Asset Taxation"],
      serviceRegions: ["Sydney (NSW)", "National (Australia-wide)"],
      websiteUrl: "https://meridiantax.com.au",
      contactEmail: "tax@meridiantax.com.au",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      avgRating: 4.9,
      reviewCount: 8,
      services: [
        { title: "Year-End CGT Minimization Review", description: "Structured loss harvesting and small business CGT concessions analysis." }
      ],
      team: [{ name: "Anthony Russo, CA", role: "Senior Tax Partner", bio: "Chartered Tax Adviser and SMSF specialist auditor." }]
    },
    {
      companyName: "Keystone Investment Lending & Advisory",
      slug: "keystone-investment-lending",
      category: Category.MORTGAGE_BROKER,
      tagline: "Tailored debt structuring for residential syndicates and commercial investors.",
      overview: "Keystone structures sophisticated debt facilities across private lenders, non-bank lenders, and major Australian banks, helping property investors maximize borrowing power.",
      specialities: ["Commercial Mortgages", "SMSF Lending", "Equity Release"],
      serviceRegions: ["Melbourne (VIC)", "Sydney (NSW)"],
      contactEmail: "loans@keystoneinvest.com.au",
      feeSummary: "Broker services covered by lender, no investor fee",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      avgRating: 4.8,
      reviewCount: 15,
      services: [
        { title: "Portfolio Debt Structuring Assessment", description: "Multi-property cross-collateralization audit and interest rate optimization." }
      ],
      team: [{ name: "Julian Marks", role: "Managing Broker", bio: "18 years specializing in high-net-worth real estate credit." }]
    },
    {
      companyName: "Aegis SMSF Solutions Australia",
      slug: "aegis-smsf-solutions",
      category: Category.SMSF_SPECIALIST,
      tagline: "Turnkey SMSF setup, administration, annual compliance, and audit.",
      overview: "Aegis handles end-to-end administration for self-managed super funds, ensuring complete ATO and ASIC regulatory compliance while empowering trustees to invest flexibly.",
      specialities: ["SMSF Setup", "Annual Compliance & Audit", "Property in Super"],
      serviceRegions: ["Brisbane (QLD)", "National (Australia-wide)"],
      contactEmail: "admin@aegissmsf.com.au",
      feeSummary: "$1,650 fixed annual compliance fee",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      avgRating: 4.9,
      reviewCount: 10,
      services: [
        { title: "Complete SMSF Annual Package", description: "Financial statement preparation, tax return, and independent ASIC approved audit." }
      ],
      team: [{ name: "Rachel Higgins", role: "Principal SMSF Specialist", bio: "ASIC registered auditor and CPA." }]
    },
    {
      companyName: "Bluechip Angel & Private Syndicate",
      slug: "bluechip-angel-syndicate",
      category: Category.INVESTOR_COMMUNITY,
      tagline: "Curated community of sophisticated angels co-investing in Australian tech.",
      overview: "A vetted ecosystem of accredited investors deploying seed and Series A growth capital into vetted Australian startups and deep-tech enterprises.",
      specialities: ["Angel Co-Investing", "Founder Masterminds", "Deal Screening"],
      serviceRegions: ["Melbourne (VIC)", "Sydney (NSW)"],
      websiteUrl: "https://bluechipangels.com.au",
      contactEmail: "syndicate@bluechipangels.com.au",
      minInvestment: "$25,000 per deal",
      feeSummary: "Annual membership $1,500 + 10% carry",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      avgRating: 4.7,
      reviewCount: 7,
      services: [
        { title: "Quarterly Pitch Showcase", description: "Exclusive review of pre-vetted enterprise SaaS and CleanTech ventures." }
      ],
      team: [{ name: "Dominic Howard", role: "Syndicate Lead", bio: "Serial tech founder and venture partner." }]
    },
    {
      companyName: "Australis Equity & Commodity Research",
      slug: "australis-equity-research",
      category: Category.MARKET_ANALYST,
      tagline: "Uncompromising fundamental and macro equity analysis on the ASX.",
      overview: "Independent equity research desk focusing on ASX small-to-mid caps, mining resources, critical minerals, and renewable energy infrastructure.",
      specialities: ["ASX Small-Caps", "Critical Minerals", "Quarterly Model Portfolios"],
      serviceRegions: ["Sydney (NSW)", "National (Australia-wide)"],
      contactEmail: "research@australisresearch.com.au",
      feeSummary: "$450/quarter research subscription",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      avgRating: 4.9,
      reviewCount: 11,
      services: [
        { title: "Institutional Weekly Dispatch", description: "In-depth valuation models and target price analysis for emerging resources." }
      ],
      team: [{ name: "Callum MacLeod", role: "Chief Equity Analyst", bio: "CFA Charterholder with 16 years mining sector experience." }]
    },
    {
      companyName: "Horizon Growth Real Estate Debt Fund",
      slug: "horizon-growth-debt-fund",
      category: Category.FUND_MANAGER,
      tagline: "First-mortgage secured commercial property debt delivering 9.5% target p.a.",
      overview: "Private debt fund specializing in senior secured construction and bridge financing for Tier-1 property projects in Melbourne and Sydney.",
      specialities: ["Private Debt", "First Mortgage Security", "Fixed Monthly Yield"],
      serviceRegions: ["Melbourne (VIC)", "Sydney (NSW)"],
      contactEmail: "invest@horizongrowthfund.com.au",
      minInvestment: "$100,000",
      feeSummary: "1.25% management fee",
      aumText: "$95M AUM",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      avgRating: 4.6,
      reviewCount: 5,
      services: [
        { title: "Secured Income Mandate", description: "Targeting conservative 9.5% p.a. paid quarterly with registered 1st mortgages." }
      ],
      team: [{ name: "Nathaniel Cole", role: "Credit Committee Chair", bio: "Ex-commercial banking executive." }]
    },
    {
      companyName: "Coastal Buyers & Property Advocates",
      slug: "coastal-property-advocates",
      category: Category.PROPERTY_INVESTOR,
      tagline: "Strategic high-yield residential purchases for interstate investors.",
      overview: "Specialist buyer's agency scouting off-market high-yield and capital growth residential assets across South East Queensland and Northern NSW.",
      specialities: ["Buyer's Advocacy", "Off-Market Sourcing", "High Rental Yield"],
      serviceRegions: ["Gold Coast (QLD)", "Brisbane (QLD)"],
      contactEmail: "info@coastalbuyers.com.au",
      minInvestment: "$600,000 Purchase Target",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      avgRating: 4.9,
      reviewCount: 8,
      services: [{ title: "End-to-End Buyer's Mandate", description: "Due diligence, auction bidding, and building inspection coordination." }],
      team: [{ name: "Jessica Palmer", role: "Founder & Lead Advocate", bio: "Licensed Real Estate Agent and REIQ member." }]
    },
    {
      companyName: "Precision Forex Matrix Desk",
      slug: "precision-forex-matrix",
      category: Category.TRADING_EDUCATOR,
      tagline: "Algorithmic backtesting and manual discretionary FX mentoring.",
      overview: "Providing traders with quantitative frameworks for currency markets, volatility trading, and automated risk governors.",
      specialities: ["Forex Strategies", "Algorithmic Backtesting", "Psychology Coaching"],
      serviceRegions: ["Sydney (NSW)", "National (Australia-wide)"],
      contactEmail: "desk@precisionforex.com.au",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.UNVERIFIED,
      verifiedBadge: false,
      avgRating: 4.3,
      reviewCount: 4,
      services: [{ title: "Currency Volatility System", description: "Step-by-step model for major and minor currency cross-rates." }],
      team: [{ name: "Leon King", role: "Quantitative Strategist", bio: "Former prop desk quantitative trader." }]
    },
    {
      companyName: "Ironbark Private Wealth Advisers",
      slug: "ironbark-wealth-advisers",
      category: Category.FINANCIAL_ADVISER,
      tagline: "Generational wealth preservation and ethical investment portfolios.",
      overview: "Tasmania's premier bespoke wealth planning practice catering to retirees, self-made entrepreneurs, and charitable foundations.",
      specialities: ["Ethical Investing", "Family Succession", "Philanthropic Trusts"],
      serviceRegions: ["Hobart (TAS)", "Melbourne (VIC)"],
      contactEmail: "clients@ironbarkwealth.com.au",
      status: ProviderStatus.APPROVED,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedBadge: true,
      avgRating: 5.0,
      reviewCount: 7,
      services: [{ title: "Generational Wealth Blueprint", description: "Structuring succession and intergenerational wealth transfer." }],
      team: [{ name: "William Vance", role: "Senior Partner", bio: "Fellow of FINSIA." }]
    },
    // Providers with PENDING, IN_REVIEW, REJECTED, SUSPENDED statuses:
    {
      companyName: "Crestview SMSF Advisory Group",
      slug: "crestview-smsf-advisory",
      category: Category.SMSF_SPECIALIST,
      tagline: "Modern cloud-first superannuation administration for tech workers.",
      overview: "Crestview is onboarding to provide streamlined SMSF establishment and automated crypto reconciliation for Australian professionals.",
      specialities: ["SMSF Setup", "Crypto Reconciliation"],
      serviceRegions: ["Perth (WA)"],
      contactEmail: "hello@crestviewsmsf.com.au",
      status: ProviderStatus.PENDING,
      verificationStatus: VerificationStatus.IN_REVIEW,
      verifiedBadge: false,
      avgRating: 0.0,
      reviewCount: 0,
      services: [{ title: "Cloud SMSF Onboarding", description: "Direct bank feeds and automated tax return filing." }],
      team: [{ name: "Gareth Mills", role: "Managing Director", bio: "Registered tax agent." }]
    },
    {
      companyName: "Velocity Crypto Live Streams",
      slug: "velocity-crypto-live",
      category: Category.TRADING_CHANNEL,
      tagline: "Live on-chain analysis and intraday Bitcoin order flow.",
      overview: "Live channel covering daily mempool transactions, derivatives funding rates, and altcoin technical breakouts.",
      specialities: ["On-Chain Analytics", "Bitcoin Derivatives"],
      serviceRegions: ["National (Australia-wide)"],
      contactEmail: "contact@velocitycrypto.live",
      status: ProviderStatus.PENDING,
      verificationStatus: VerificationStatus.UNVERIFIED,
      verifiedBadge: false,
      avgRating: 0.0,
      reviewCount: 0,
      services: [{ title: "VIP Alpha Discord & Daily Stream", description: "Live charting and open interest heatmaps." }],
      team: [{ name: "Kai Jensen", role: "Lead Analyst", bio: "DeFi protocols analyst." }]
    },
    {
      companyName: "Strategic Tax Partners Australia",
      slug: "strategic-tax-partners",
      category: Category.TAX_SPECIALIST,
      tagline: "Corporate structure restructuring and cross-border IP licensing tax.",
      overview: "Strategic Tax Partners is awaiting document review for AFSL/CPA partnership verification.",
      specialities: ["Corporate Restructuring", "Cross-Border Tax"],
      serviceRegions: ["Melbourne (VIC)"],
      contactEmail: "enquiries@strategictax.com.au",
      status: ProviderStatus.PENDING,
      verificationStatus: VerificationStatus.IN_REVIEW,
      verifiedBadge: false,
      avgRating: 0.0,
      reviewCount: 0,
      services: [{ title: "Cross-Border Structuring", description: "Tax residency and double tax treaty optimization." }],
      team: [{ name: "Siddharth Rao", role: "Partner", bio: "International tax specialist." }]
    },
    {
      companyName: "Hyperion Guaranteed Wealth Traders",
      slug: "hyperion-guaranteed-wealth",
      category: Category.TRADING_EDUCATOR,
      tagline: "Guaranteed 40% monthly returns through automated binary algorithms.",
      overview: "Hyperion claimed unrealistic guarantees without ASIC risk disclosures. Application flagged and rejected by compliance.",
      specialities: ["Binary Options", "Automated Bots"],
      serviceRegions: ["Sydney (NSW)"],
      contactEmail: "support@hyperionguaranteed.test",
      status: ProviderStatus.REJECTED,
      verificationStatus: VerificationStatus.REJECTED,
      rejectionReason: "Violation of ASIC Regulatory Guide 234: Misleading performance claims and promise of guaranteed returns.",
      verifiedBadge: false,
      avgRating: 1.0,
      reviewCount: 1,
      services: [],
      team: [{ name: "Unknown Promoter", role: "Promoter", bio: "Unverified." }]
    },
    {
      companyName: "Southern Cross Real Estate Debt Trust",
      slug: "southern-cross-real-estate-debt",
      category: Category.FUND_MANAGER,
      tagline: "Mezzanine and second mortgage real estate funding.",
      overview: "Currently suspended pending investigation of licensing disclosure requirements under Corporations Act s911A.",
      specialities: ["Mezzanine Debt", "Second Mortgages"],
      serviceRegions: ["Adelaide (SA)"],
      contactEmail: "legal@southerncrossdebt.test",
      status: ProviderStatus.SUSPENDED,
      verificationStatus: VerificationStatus.REJECTED,
      rejectionReason: "License expired; pending audit clarification.",
      verifiedBadge: false,
      avgRating: 3.5,
      reviewCount: 2,
      services: [],
      team: [{ name: "Peter Lang", role: "Former Trustee", bio: "Licensing suspended." }]
    }
  ];

  const createdProviders = [];

  for (let i = 0; i < providerDataList.length; i++) {
    const p = providerDataList[i];
    const user = await prisma.user.create({
      data: {
        email: `provider${i + 1}@investorhub.test`,
        passwordHash: defaultPasswordHash,
        fullName: `${p.companyName} Admin`,
        phone: p.contactPhone || "+61 2 9123 4567",
        role: Role.PROVIDER,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
      },
    });

    const provider = await prisma.provider.create({
      data: {
        ownerUserId: user.id,
        companyName: p.companyName,
        slug: p.slug,
        category: p.category,
        tagline: p.tagline,
        overview: p.overview,
        specialities: p.specialities,
        serviceRegions: p.serviceRegions,
        websiteUrl: p.websiteUrl || null,
        contactEmail: p.contactEmail || `contact@${p.slug}.com.au`,
        contactPhone: p.contactPhone || null,
        minInvestment: p.minInvestment || null,
        feeSummary: p.feeSummary || null,
        riskProfile: p.riskProfile || null,
        aumText: p.aumText || null,
        status: p.status,
        verificationStatus: p.verificationStatus,
        verifiedBadge: p.verifiedBadge,
        isFeatured: p.isFeatured || false,
        avgRating: p.avgRating,
        reviewCount: p.reviewCount,
        rejectionReason: p.rejectionReason || null,
        approvedAt: p.status === ProviderStatus.APPROVED ? new Date() : null,
        approvedBy: p.status === ProviderStatus.APPROVED ? superAdmin.id : null,
        providerDisclaimer: "All investments carry financial risk. Past performance does not assure future results. Check ASIC AFSL register before committing funds.",
        services: {
          create: p.services.map((s) => ({
            title: s.title,
            description: s.description,
          })),
        },
        team: {
          create: p.team.map((t) => ({
            name: t.name,
            role: t.role,
            bio: t.bio,
          })),
        },
        documents: {
          create: [
            {
              docType: "AFSL",
              fileUrl: "https://storage.investorhub.com.au/docs/afsl_sample.pdf",
              status: p.verificationStatus === VerificationStatus.VERIFIED ? "ACCEPTED" : "PENDING",
              reviewerNote: p.verificationStatus === VerificationStatus.VERIFIED ? "AFSL registry cross-checked and active." : "Submitted for compliance check.",
              reviewedBy: p.verificationStatus === VerificationStatus.VERIFIED ? superAdmin.id : null,
              reviewedAt: p.verificationStatus === VerificationStatus.VERIFIED ? new Date() : null,
            },
          ],
        },
      },
    });

    createdProviders.push(provider);
  }

  // 5. Featured Placements
  const approvedProviders = createdProviders.filter((p) => p.status === ProviderStatus.APPROVED);
  for (let i = 0; i < Math.min(4, approvedProviders.length); i++) {
    await prisma.featuredPlacement.create({
      data: {
        providerId: approvedProviders[i].id,
        slot: i === 0 ? "HOME_HERO" : "HOME_STRIP",
        startsAt: new Date(Date.now() - 7 * 86400000),
        endsAt: new Date(Date.now() + 60 * 86400000),
        sortOrder: i,
      },
    });
  }

  // 6. 40 Realistic Enquiries (Leads)
  const enquiryStatuses: EnquiryStatus[] = [
    EnquiryStatus.NEW,
    EnquiryStatus.CONTACTED,
    EnquiryStatus.QUALIFIED,
    EnquiryStatus.BOOKED,
    EnquiryStatus.WON,
    EnquiryStatus.LOST,
    EnquiryStatus.SPAM,
  ];

  const enquiryMessages = [
    "Looking to allocate $250,000 from an SMSF into wholesale equities. Would like to review fund mandate and fee breakdown.",
    "Interested in commercial property syndication for a Gold Coast medical center. Could we schedule a 20-minute consultation call?",
    "Seeking an independent portfolio risk audit for an existing $800k portfolio before shifting into fixed income.",
    "Looking for accredited price action mentorship for full-time intraday trading. What is the intake schedule?",
    "Need advice on structuring a discretionary family trust with capital gains concessions.",
    "Interested in first-mortgage construction debt fund yielding 9%+. What is the minimum wholesale commitment?",
    "Require assistance establishing an SMSF with property borrowing (LRBA) capacity.",
  ];

  for (let i = 0; i < 40; i++) {
    const investor = investorUsers[i % investorUsers.length];
    const provider = approvedProviders[i % approvedProviders.length];
    const status = enquiryStatuses[i % enquiryStatuses.length];
    const score = Math.floor(40 + Math.random() * 58); // 40 to 98
    const type = i % 2 === 0 ? EnquiryType.CONSULTATION : EnquiryType.ENQUIRY;

    const lead = await prisma.enquiry.create({
      data: {
        investorId: investor.id,
        providerId: provider.id,
        type: type,
        message: enquiryMessages[i % enquiryMessages.length],
        investorName: investor.fullName,
        investorEmail: investor.email,
        investorPhone: investor.phone,
        preferredContactMethod: i % 2 === 0 ? "EMAIL" : "PHONE",
        preferredTime: "Morning (9am - 12pm AEST)",
        status: status,
        leadScore: score,
        aiSummary: `Qualified lead interested in ${provider.category.toLowerCase().replace(/_/g, " ")}. Est. capital: \$150k-\$500k.`,
        internalNotes: status === EnquiryStatus.CONTACTED ? "Introductory consultation pack emailed to client." : null,
        source: i % 3 === 0 ? "SEARCH" : i % 3 === 1 ? "CATEGORY" : "FEATURED",
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
      },
    });

    await prisma.enquiryActivity.create({
      data: {
        enquiryId: lead.id,
        actorId: status === EnquiryStatus.NEW ? investor.id : provider.ownerUserId,
        action: "STATUS_UPDATE",
        fromStatus: "INITIAL",
        toStatus: status,
        note: `Lead created and set to ${status}.`,
      },
    });
  }

  // 7. 30 Realistic Reviews (Approved, Pending, Flagged)
  const sampleReviewTitles = [
    "Exceptional transparent reporting and risk controls",
    "Solid commercial property syndicate return so far",
    "Structured mentorship that changed my execution discipline",
    "Highly professional, genuine fee-for-service advice",
    "Very detailed portfolio audit that uncovered \$12k in hidden fees",
    "Guaranteed 50% returns, click my telegram link for free signals!", // to test AI Flag
  ];

  for (let i = 0; i < 30; i++) {
    const investor = investorUsers[i % investorUsers.length];
    const provider = approvedProviders[i % approvedProviders.length];
    const isSuspicious = i === 28;
    const reviewStatus = isSuspicious ? ReviewStatus.FLAGGED : i % 5 === 0 ? ReviewStatus.PENDING : ReviewStatus.APPROVED;

    await prisma.review.create({
      data: {
        providerId: provider.id,
        investorId: investor.id,
        rating: isSuspicious ? 1 : Math.floor(4 + Math.random() * 2),
        title: sampleReviewTitles[i % sampleReviewTitles.length],
        body: isSuspicious
          ? "Guaranteed 50% returns instantly! Join t.me/fakecrypto for insider signals! No risk at all!"
          : "Working with this firm has provided peace of mind. Communication is prompt, documentation is thorough, and all performance metrics match what was promised in the disclosure documents.",
        status: reviewStatus,
        aiFlag: isSuspicious,
        aiFlagReason: isSuspicious ? "Contains guaranteed return claim and external messaging link." : null,
        moderatedBy: reviewStatus === ReviewStatus.APPROVED ? moderatorAdmin.id : null,
        moderatedAt: reviewStatus === ReviewStatus.APPROVED ? new Date() : null,
      },
    });
  }

  // 8. Site Content Configuration
  await prisma.siteContent.create({
    data: {
      key: "homepage.hero",
      title: "Homepage Hero Content",
      content: {
        badge: "Australia's Trusted Investor Marketplace",
        headline: "Make confident investment decisions with verified experts.",
        subheadline: "Discover, compare and connect with fund managers, property specialists, trading educators, financial advisers and investor communities in one transparent platform.",
        primaryCta: "Explore verified providers",
        secondaryCta: "Become a verified provider",
      },
    },
  });

  await prisma.siteContent.create({
    data: {
      key: "platform.disclaimer",
      title: "Platform Compliance Boundary",
      content: {
        text: "InvestorHub operates as a marketplace and information platform. It does not provide personal financial advice or guarantee investment performance. Final legal wording, privacy documents and Australian financial services compliance review must be completed by a qualified Australian legal adviser before launch.",
      },
    },
  });

  // 9. Initial Audit Log Entries
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: superAdmin.id,
        entityType: "SYSTEM",
        entityId: "SYSTEM_INIT",
        action: "DATABASE_SEEDED",
        beforeJson: {},
        afterJson: { providersCount: 20, leadsCount: 40, reviewsCount: 30 },
        ip: "127.0.0.1",
      },
    ],
  });

  console.log("✅ InvestorHub Australia database seeded successfully!");
  console.log("Super Admin: admin@investorhub.test / InvestorHub2026!Secure");
  console.log("Admin: moderator@investorhub.test / InvestorHub2026!Secure");
  console.log("Providers: provider1@investorhub.test to provider20@investorhub.test");
  console.log("Investors: investor1@investorhub.test to investor10@investorhub.test");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
