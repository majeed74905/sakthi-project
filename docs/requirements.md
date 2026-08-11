# Requirements Specification: My Sakthi Marketing Platform

## 1. Verified vs. Proposed Requirements

To maintain domain accuracy while transforming the platform into a modern SaaS application, requirements are divided into verified facts from the legacy system and proposed features for the upgraded platform.

### 1.1 Verified Information (Source: `mysakthimarketing.in`)
- **Brand Identity**: My Sakthi Marketing
- **Corporate Address**: No.2, Venus Nagar 5th Street, Kolathur, Chennai - 600099.
- **Contact Channels**: `info@mysakthimarketing.in`, Phone: `+91 78456 01441`.
- **Public Core Pages**: Home, Who We Are, Products, Contact Us, Login / Signup.
- **Member Identifiers**: Unique Distributor / User ID system (e.g. `MSM...`).
- **Sponsor Onboarding**: Registration requires a valid Sponsor ID with live name lookup.
- **Banking Profile Requirements**: Account Name, Account Number, IFSC Code, Bank Name, Branch Name.
- **Security Paradigm**: Primary Login Password + Secondary Transaction Password.

### 1.2 Proposed Requirements (Modern SaaS Architecture Rebuild)
- **Framework & Tech**: React + Vite + Tailwind CSS frontend; Node.js + Express REST API backend; MySQL + Prisma ORM database.
- **Interactive Dashboards**: Dynamic chart-driven member and admin analytics powered by Recharts.
- **Referral Network Visualization**: Graphical downline tree visualizer and commission ledger.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Member, Admin, and Super Admin.
- **Content Management System (CMS)**: Admin tools to update homepage banners, company info, product catalogs, legal policies, and contact enquiries.

---

## 2. Detailed Functional Requirements

### 2.1 Public Corporate Website
- **FR-PUB-01**: **Responsive Header & Navigation** — Top contact info bar, brand logo, navigation links (Home, Who We Are, Products, Contact Us), and CTA buttons (Sign In / Register / Portal).
- **FR-PUB-02**: **Hero Carousel & Banners** — High-impact promotional banner carousel featuring product highlights (e.g., Household appliances, LED TVs).
- **FR-PUB-03**: **Who We Are Section** — Corporate vision, value propositions, and trust feature cards (Safe & Secure, Trusted, Professional).
- **FR-PUB-04**: **Interactive Product Catalogue** — Filterable product catalog displaying pricing, descriptions, specifications, and dynamic inquiry buttons.
- **FR-PUB-05**: **Contact & Enquiry Submission** — Integrated contact form validating sender details and storing messages in backend admin inbox.
- **FR-PUB-06**: **Legal & Policy Pages** — Dynamic rendering of Terms & Conditions and Privacy Policy.

### 2.2 Authentication & Account Management
- **FR-AUTH-01**: **Sponsor Real-Time Lookup API** — Validates Sponsor ID on signup form and returns sponsor's full name.
- **FR-AUTH-02**: **User Registration** — Validates email, 10-digit phone number, sponsor code, password (min 6 chars), transaction password, and bank details.
- **FR-AUTH-03**: **Dual Password Creation** — Enforces registration of both a Login Password and a Transaction Password.
- **FR-AUTH-04**: **Secure Sign-In** — Authenticates users via User ID / Email / Phone and Password; returns JWT access and refresh tokens.
- **FR-AUTH-05**: **Password Reset Workflow** — Allows members to request password reset via email OTP/token.

### 2.3 Member Dashboard & Refer & Earn Portal
- **FR-MEM-01**: **Member Overview Dashboard** — Key metric cards: Total Earnings, Available Wallet Balance, Direct Referrals Count, Downline Team Size, Active Package status.
- **FR-MEM-02**: **Referral Link & Code Sharing** — Generates unique referral link (`https://.../register?sponsor=USER_CODE`) with one-click copy and QR code.
- **FR-MEM-03**: **Referral Tree / Downline View** — Interactive visual tree showing direct sponsor referrals and multi-tier downline structure.
- **FR-MEM-04**: **Commission & Wallet Ledger** — Detailed audit log of earned commissions (direct bonus, team referral points) with timestamp and status.
- **FR-MEM-05**: **Payout Request System** — Form allowing members to request wallet payout to linked bank account, secured by Transaction Password validation.
- **FR-MEM-06**: **Profile & Bank Account Management** — Allows members to view and update personal profile and bank account details (subject to admin verification).

### 2.4 Admin Control Panel
- **FR-ADM-01**: **Executive Analytics Dashboard** — System-wide stats: Total Members, Active Members, Total Commissions Paid, Pending Payout Requests, Total Products, Open Contact Enquiries.
- **FR-ADM-02**: **Member Management** — Searchable table of members with filters by status, registration date, or sponsor ID; abilities to activate, deactivate, view sponsor tree, or edit profile.
- **FR-ADM-03**: **Payout Approval System** — Review pending payout requests, inspect member bank account details, mark requests as Approved/Rejected with transaction reference notes.
- **FR-ADM-04**: **Product Management** — Full CRUD management of product categories and products (Title, Description, Price, Category, Images, Stock status).
- **FR-ADM-05**: **CMS & Banner Management** — Admin controls to upload home hero banners, edit site announcements, update legal policy pages.
- **FR-ADM-06**: **Enquiry Management** — Inbox displaying contact form submissions with status tags (New, In Progress, Resolved).

---

## 3. Non-Functional Requirements (NFRs)

### 3.1 Security & Protection
- **NFR-SEC-01**: Password and Transaction Password storage encrypted via `bcrypt` (cost factor 12).
- **NFR-SEC-02**: Stateless JWT authentication with short-lived access tokens (15m) and secure refresh tokens (7d).
- **NFR-SEC-03**: Input validation on all incoming API requests using Zod schemas.
- **NFR-SEC-04**: Defense-in-depth API middleware: `Helmet` (HTTP security headers), `CORS` (restricted origins), and `express-rate-limit` (anti-bruteforce).

### 3.2 Performance & Responsiveness
- **NFR-PERF-01**: Mobile-first responsive UI built with Tailwind CSS, ensuring smooth rendering across mobile, tablet, and desktop screens.
- **NFR-PERF-02**: API response time < 200ms for standard database reads.
- **NFR-PERF-03**: Optimized bundle size using Vite code splitting and lazy loading of dashboard pages.

### 3.3 Maintainability & Clean Architecture
- **NFR-MAINT-01**: Strict separation of concerns between Frontend (React SPA) and Backend (Node/Express REST API).
- **NFR-MAINT-02**: Type-safe database queries and migrations via Prisma ORM with MySQL.
- **NFR-MAINT-03**: Zero hardcoded secrets; configuration driven strictly through `.env` environment variables.
