# Developer Setup and System Architecture Guide

## 1. Stack & Architecture Overview
- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons + Recharts
- **Backend**: Node.js + Express REST API + Prisma ORM + JWT + Helmet + Cookie Parser
- **Database**: MySQL 8.0 (`mysakthimarketing`)
- **Authentication**: Dual password model (Login & Transaction Passwords) with memory-only Access Tokens and `Secure`, `HttpOnly`, `SameSite` Refresh Cookies.

---

## 2. Local Setup & Commands

### Prerequisites
- Node.js `v18+` or `v20+` LTS
- MySQL 8.0 server listening on `127.0.0.1:3306`

### Backend Setup
```bash
cd backend
npm install
npx prisma migrate deploy
node src/server.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 3. Database Schema & Prisma Migrations
- Prisma schema location: `backend/prisma/schema.prisma`
- Baseline migration location: `backend/prisma/migrations/20260809000000_init_baseline/migration.sql`
- Generate Prisma client: `npx prisma generate`
- Deploy schema changes: `npx prisma migrate deploy`

---

## 4. Master QA Test Suite
Run the master automated test runner executing 72 E2E assertions:
```bash
cd backend
node test-master-e2e.js
```
