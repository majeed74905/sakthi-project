# My Sakthi Marketing Platform

A modern, production-ready full-stack web application and member management platform for **My Sakthi Marketing**.

---

## 🚀 System Architecture & Tech Stack
- **Frontend**: React 18 SPA + Vite + Tailwind CSS + Lucide Icons + Recharts + React Hook Form + Zod
- **Backend**: Node.js + Express REST API + Prisma ORM + JWT + Helmet + Express Rate Limit + Cookie Parser
- **Database**: MySQL 8.0 (`mysakthimarketing`)
- **Security**: Dual Passwords (Login & Transaction), Memory-only Access Tokens, `Secure` `HttpOnly` `SameSite` Refresh Cookies, Sensitive Bank Account Masking (`XXXXXX1002`).

---

## 📁 Repository Structure
```text
project/
├── backend/                  # Express REST API & Prisma ORM
│   ├── prisma/               # Database schema & baseline migrations
│   ├── src/                  # Controllers, services, routes, middleware
│   ├── scripts/              # Demo cleanup & utility scripts
│   └── test-master-e2e.js    # Master 72-assertion E2E QA test suite
├── frontend/                 # Vite + React SPA
│   ├── src/                  # Components, pages, context, services, utils
│   └── dist/                 # Production static build output
└── docs/                     # Comprehensive architecture & operational manuals
```

---

## 🛠️ Quick Start Guide

### 1. Backend API Setup
```bash
cd backend
npm install
npx prisma migrate deploy
node src/server.js
```
The REST API will be active on `http://localhost:5000/api/v1`.

### 2. Frontend SPA Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

---

## 🧪 Master QA Test Execution
Run the automated master E2E test runner:
```bash
cd backend
node test-master-e2e.js
```
- **Total Assertions**: 72
- **Target Pass Rate**: 100% (72 / 72 PASS)

---

## 📚 Complete Project Documentation
- [developer-guide.md](file:///c:/Users/Sivaprashanna/OneDrive/Desktop/project/docs/developer-guide.md) — Developer setup & architecture handbook
- [admin-user-manual.md](file:///c:/Users/Sivaprashanna/OneDrive/Desktop/project/docs/admin-user-manual.md) — Administrative control suite manual
- [member-user-manual.md](file:///c:/Users/Sivaprashanna/OneDrive/Desktop/project/docs/member-user-manual.md) — Associate member portal manual
- [pre-deployment-audit.md](file:///c:/Users/Sivaprashanna/OneDrive/Desktop/project/docs/pre-deployment-audit.md) — Pre-deployment readiness audit
- [aws-production-deployment.md](file:///c:/Users/Sivaprashanna/OneDrive/Desktop/project/docs/aws-production-deployment.md) — AWS 24-step master deployment execution manual
