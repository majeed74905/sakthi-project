# System Architecture: My Sakthi Marketing Platform

## 1. High-Level System Architecture

The My Sakthi Marketing platform is designed as a decoupled, multi-tier full-stack application following modern SaaS software patterns. 

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT PRESENTATION LAYER                       │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      React 18 + Vite Single Page App                │   │
│   │                                                                     │   │
│   │  ┌──────────────┐   ┌──────────────┐   ┌─────────────┐  ┌─────────┐ │   │
│   │  │ Public Site  │   │ Auth Flow    │   │ Member Portal│  │ Admin UI│ │   │
│   │  └──────────────┘   └──────────────┘   └─────────────┘  └─────────┘ │   │
│   │  Tailwind CSS | Lucide Icons | Recharts | React Hook Form + Zod     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ HTTP / REST APIs (Axios + JWT)
┌───────────────────────────────────▼─────────────────────────────────────────┐
│                             BACKEND SERVICE LAYER                           │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                       Node.js + Express REST API                    │   │
│   │                                                                     │   │
│   │  [ Helmet Header Security ]   [ CORS Guard ]   [ Express Rate Limit ]│   │
│   │                                                                     │   │
│   │  ┌──────────────┐   ┌──────────────┐   ┌─────────────┐  ┌─────────┐ │   │
│   │  │ Auth Service │   │ Member/Sponsor│  │ Product/CMS │  │ Admin   │ │   │
│   │  │ (JWT+Bcrypt) │   │ Referral Engine│ │ Service     │  │ Service │ │   │
│   │  └──────────────┘   └──────────────┘   └─────────────┘  └─────────┘ │   │
│   └───────────────────────────────────┬─────────────────────────────────┘   │
└───────────────────────────────────┬───┴─────────────────────────────────────┘
                                    │ Prisma Client ORM
┌───────────────────────────────────▼─────────────────────────────────────────┐
│                             DATA & STORAGE LAYER                            │
│                                                                             │
│   ┌──────────────────────────────┐        ┌──────────────────────────────┐  │
│   │    MySQL Relational Database │        │ Local / Cloud File Storage   │  │
│   │   (Users, Referrals, Ledger, │        │   (Uploaded Banners, Product │  │
│   │    Products, Payouts, CMS)   │        │    Images, User Assets)      │  │
│   └──────────────────────────────┘        └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory & Repository Structure

```
my-sakthi-marketing/
├── frontend/                     # React Single Page Application
│   ├── public/                   # Static assets & favicons
│   ├── src/
│   │   ├── assets/               # Branding assets & images
│   │   ├── components/           # Reusable UI components (Navbar, Footer, Modal, Cards)
│   │   ├── context/              # React Context (AuthContext, ThemeContext)
│   │   ├── hooks/                # Custom React Hooks (useAuth, useFetch)
│   │   ├── layouts/              # Layout Wrappers (PublicLayout, MemberLayout, AdminLayout)
│   │   ├── pages/
│   │   │   ├── public/           # Home, About, Products, ProductDetail, Contact, Terms
│   │   │   ├── auth/             # Login, Register, ForgotPassword
│   │   │   ├── member/           # Dashboard, Referrals, TreeView, Earnings, Payouts, Profile
│   │   │   └── admin/            # Dashboard, Members, Products, Payouts, Enquiries, CMS
│   │   ├── routes/               # App Router & Protected Route Guards
│   │   ├── services/             # Axios API Service Modules
│   │   ├── utils/                # Helper functions, formatters, validators
│   │   ├── App.jsx               # Main React Application Root
│   │   └── main.jsx              # Vite Entry Point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/               # DB connection, Environment vars, JWT secret config
│   │   ├── controllers/          # API Route Controllers (Auth, Member, Product, Admin, CMS)
│   │   ├── middleware/           # Auth guard, Role guard, Error handler, Rate limiter
│   │   ├── models/               # Data access helper abstractions
│   │   ├── routes/               # Express Route Definitions (/api/v1/...)
│   │   ├── services/             # Business Logic & Commission Engines
│   │   ├── utils/                # JWT generators, Hash utilities, Logger
│   │   └── server.js             # Express App Server Entry Point
│   ├── uploads/                  # Uploaded files directory (banners, product images)
│   ├── .env.example
│   └── package.json
│
├── database/                     # Database schemas & migrations
│   ├── prisma/
│   │   ├── schema.prisma         # Unified Prisma Database Schema
│   │   └── seed.js               # Database Seeder Script (Initial Admin & Demo Data)
│   └── schema/                   # Raw SQL schema backups
│
└── docs/                         # System Documentation
    ├── reverse-engineering.md
    ├── requirements.md
    ├── architecture.md
    ├── routes.md
    ├── database-design.md
    ├── api-design.md
    └── implementation-plan.md
```

---

## 3. Core Architecture Subsystems

### 3.1 Authentication & Security Architecture
1. **Access Tokens**: Short-lived (15 minutes) JSON Web Tokens passed via HTTP `Authorization: Bearer <token>` headers.
2. **Refresh Tokens**: Longer-lived (7 days) tokens stored securely for session refresh.
3. **Dual Password Enforcement**:
   - `password_hash`: Bcrypt-hashed primary credentials for system authentication.
   - `transaction_password_hash`: Bcrypt-hashed secondary credentials required to authorize financial payout requests.
4. **Role Guards Middleware**: Express middleware inspects decoded JWT claims (`role: 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN'`) before granting access to protected routes.

### 3.2 Member & Referral Engine Architecture
1. **Sponsor Adjacency Model**: Each user stores a `sponsor_id` referencing their direct referrer's `id`.
2. **Real-time Sponsor Verification**: An unauthenticated endpoint (`GET /api/v1/auth/verify-sponsor/:userCode`) validates sponsor presence during onboarding.
3. **Commission Ledger**: Financial events write immutable ledger records to the `commissions` table, computing direct bonuses and multi-tier points.

### 3.3 Admin & CMS Control Architecture
1. **Product Catalog CMS**: Manage categories, product variants, inventory, and gallery images.
2. **Payout Verification Queue**: Admins view requested payouts, inspect linked member bank accounts, verify transaction passwords, and log bank transaction reference codes upon approval.
3. **Site Banner & Content CMS**: Live management of homepage banners, text sections, contact inquiry statuses, and legal policy documents.
