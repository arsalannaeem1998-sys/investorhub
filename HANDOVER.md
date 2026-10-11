# INVESTORHUB AUSTRALIA — MASTER HANDOVER & OPERATIONAL GUIDE

> **Prepared for:** Atif Rafiq  
> **Prepared by:** Arslan  
> **Project Scope:** Digital Marketplace MVP + AI-Style Admin CRM + Provider Portal

---

## 1. System Overview

InvestorHub Australia is built as an integrated, type-safe monorepo connecting Australian investors with verified investment professionals across 11 financial categories.

The platform consists of three unified experiences running over a shared **Node.js Express REST API (`/api/v1`)** and **PostgreSQL (Prisma ORM)** database:

1. **Public Marketplace (`/`)**:
   - AI-style Hero with live telemetry metrics and interactive search bar.
   - Provider Directory (`/providers`) with multi-parameter filtering (category, state, verified badge, minimum rating).
   - Category Hubs (`/categories`).
   - Detailed Provider Profiles (`/providers/[slug]`) with verified AFSL badge, AI profile highlights, services, team bios, client reviews, and direct consultation booking.
   - **AI Match Finder Wizard (`/match`)**: Guided 3-step wizard with objective percentage alignment.
   - **Provider Comparison Matrix (`/compare`)**: Side-by-side comparison of up to 4 providers with AI difference summarization.
   - **Insights & Research Hub (`/insights`)**: Market analysis articles with ASIC risk disclaimers.
   - **Floating AI Assistant Copilot (`AiChatAssistant`)**: Conversational assistant with strict guardrails preventing unauthorized financial advice.

2. **Provider Dashboard & Lead CRM (`/dashboard`)**:
   - Provider onboarding wizard (`/become-a-provider`).
   - **Leads Pipeline CRM (`/dashboard/leads`)**: Kanban board and table view with AI Lead Scoring (0–100 Hot/Warm/Cold), AI intent summaries, and private notes.
   - Live profile editor and verification document uploads (AFSL, ABN).

3. **Admin Super CRM (`/admin`)**:
   - **Executive Command Center (`/admin`)**: Platform telemetry, lead conversion funnel, AI operational insights, and "Needs Attention" alert queue.
   - **Provider Verification & Governance Desk (`/admin/providers`)**: Review pending provider applications, inspect credentials, and 1-click approve/reject/grant verified badges.
   - **Leads Central CRM (`/admin/leads`)**: Global enquiries monitoring with CSV data export.
   - **Review Moderation Desk (`/admin/reviews`)**: Screen reviews with AI Sentinel scam and guarantee claim checks.
   - **Market Insights CMS (`/admin/content`)**: Publish research articles with AI SEO assist.
   - **Compliance Audit Log (`/admin/audit-log`)**: Immutable audit timestamps of all approvals, rejections, and administrative actions.

---

## 2. Pre-Seeded Accounts for Testing

| Persona | Role | Email | Password | Access Area |
|---|---|---|---|---|
| **Super Admin** | `SUPER_ADMIN` | `admin@investorhub.test` | `InvestorHub2026!Secure` | `/admin` (Full CRM Access) |
| **Compliance Officer** | `ADMIN` | `moderator@investorhub.test` | `InvestorHub2026!Secure` | `/admin` (Verification & Reviews) |
| **Verified Provider** | `PROVIDER` | `provider1@investorhub.test` | `InvestorHub2026!Secure` | `/dashboard` (Provider CRM) |
| **Retail Investor** | `INVESTOR` | `investor1@investorhub.test` | `InvestorHub2026!Secure` | `/account` (Investor Portal) |

> **Note:** The login screen (`/login`) includes **1-Click Demo Login Pills** to instantly switch between any of these roles without typing credentials.

---

## 3. Quick Run Instructions

### Start PostgreSQL Database
```bash
cd investorhub
npm run docker:up
```

### Push Schema & Seed Realistic Australian Data
```bash
npm run db:push
npm run db:seed
```

### Run Frontend & Backend Concurrently
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000` (Verified Live & Responding HTTP 200)
- **Backend API**: `http://localhost:4000/api/v1` (Verified Live & Responding HTTP 200)
- **Healthcheck**: `http://localhost:4000/api/v1/health`

---

## 4. Visual Design & Rich Media Enhancements
- **High-Resolution Photography**: Integrated curated Australian financial, architectural, and trading photography across all 11 verticals, hero banners, and market insight journals.
- **Executive Team Portraits**: Professional headshots for provider leadership teams and verified analyst authors.
- **Corporate Monogram Crests & Badges**: Gradient glowing emblems, ASIC RG 234 compliance seals, and verified AFSL badges.
- **Interactive Holographic Telemetry**: Live metric counters, AI match percentage progress dials, and comparison matrices.

---

## 4. Compliance Boundary Notice
InvestorHub operates strictly as an independent directory, marketplace, and information aggregation platform. InvestorHub does not hold an Australian Financial Services Licence (AFSL), does not provide personal financial advice, and does not guarantee investment performance. Final legal wording must be reviewed by a qualified Australian legal adviser prior to commercial public launch.
