# InvestorHub Australia

> **Digital Marketplace & AI-Style Admin CRM**  
> Connecting Australian investors with verified investment professionals, educators, fund managers, property specialists, and market analysts.

---

## 🏛 Platform Overview

- **Public Marketplace Website**: Modern AI-style fintech portal for discovering, comparing, and connecting with verified Australian investment providers across 11 financial categories.
- **Provider Dashboard**: Provider self-service onboarding, profile editor, document verification upload (AFSL, ABN), and lead management pipeline (Table & Kanban).
- **Admin Super CRM**: AI workspace for managing platform KPIs, reviewing and verifying provider credentials, moderating investor reviews, inspecting lead flow, and publishing market insights.
- **Shared REST API & PostgreSQL Database**: End-to-end type safety with Zod and Prisma ORM.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18+ (Node 20+ recommended)
- **Docker**: For local PostgreSQL database (or supply a cloud `DATABASE_URL`)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Database Setup (Docker or Local Postgres)
Start the PostgreSQL container:
```bash
npm run docker:up
```

Generate Prisma client & run database migrations:
```bash
npm run db:push
```

Seed the database with realistic Australian financial entities (20 providers, 40 leads, 30 reviews, admin accounts):
```bash
npm run db:seed
```

### 5. Launch Development Servers
Run both the Next.js frontend and Express API concurrently:
```bash
npm run dev
```

- **Frontend (Marketplace, Provider & Admin CRM)**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **API Healthcheck**: [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)

---

## 🔑 Pre-Seeded Accounts for Testing

| Role | Email | Password | Access |
|---|---|---|---|
| **Super Admin** | `admin@investorhub.test` | `InvestorHub2026!Secure` | Full CRM access & System Settings |
| **Admin** | `moderator@investorhub.test` | `InvestorHub2026!Secure` | CRM Verification & Moderation |
| **Provider** | `provider1@investorhub.test` | `InvestorHub2026!Secure` | Provider Dashboard & Lead Pipeline |
| **Investor** | `investor1@investorhub.test` | `InvestorHub2026!Secure` | Marketplace, Favourites & Inquiries |

---

## ⚖️ Compliance Boundary
InvestorHub Australia is a marketplace and information platform. It does not provide personal financial advice and does not guarantee investment performance. Past performance is not indicative of future returns.
