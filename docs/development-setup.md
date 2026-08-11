# Development Setup Guide: My Sakthi Marketing Platform

## Prerequisites

- **Node.js**: v20.x or v24.x (Tested on Node v24.19.0)
- **Package Manager**: `npm` v10.x or v11.x
- **Database**: MySQL Server 8.0+ or XAMPP MySQL (Port 3306)

---

## 1. Project Installation

Clone the repository and install dependencies for both `frontend` and `backend`:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

## 2. Environment Configuration

### Backend Environment (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```env
DATABASE_URL="mysql://root:@localhost:3306/mysakthimarketing"
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

JWT_SECRET=dev_jwt_secret_key_sakthi_marketing_2026_super_secure_98765
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=dev_refresh_jwt_secret_key_sakthi_marketing_2026_12345
JWT_REFRESH_EXPIRES_IN=7d

UPLOAD_DIR=./uploads

ADMIN_EMAIL=admin@mysakthimarketing.in
ADMIN_PASSWORD=AdminSecurePassword123!
```

### Frontend Environment (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 3. Database Migration & Development Seeding

Ensure MySQL is running (e.g. start MySQL via XAMPP Control Panel on port 3306).

```bash
# From the backend directory:
cd backend

# Validate Prisma Schema
npm run prisma:validate

# Sync Schema with MySQL Database
npx prisma db push

# Seed Development Demo Data
npm run prisma:seed
```

### Development Seed Credentials

| User Code | Role | Email | Login Password | Transaction Password |
| :--- | :--- | :--- | :--- | :--- |
| **MSM10001** | `SUPER_ADMIN` | `admin@mysakthimarketing.in` | `AdminSecurePassword123!` | `DemoTxn123!` |
| **MSM10002** | `MEMBER` | `member01@example.com` | `DemoPassword123!` | `DemoTxn123!` |
| **MSM10003** | `MEMBER` | `member02@example.com` | `DemoPassword123!` | `DemoTxn123!` |
| **MSM10004** | `MEMBER` | `member03@example.com` | `DemoPassword123!` | `DemoTxn123!` |
| **MSM10005** | `MEMBER` | `member04@example.com` | `DemoPassword123!` | `DemoTxn123!` |

> [!CAUTION]
> **Safety Rules**:
> 1. Never connect development to a live production database.
> 2. All seed bank data is dummy data (`99990000100X`). Full bank account numbers are masked in logs and displays (`XXXXXX1002`).

---

## 4. Running the Application Locally

### Starting Backend Server (Port 5000)

```bash
cd backend
npm run dev
```

Verify backend health at: `http://localhost:5000/api/health`

### Starting Frontend Server (Port 5173)

```bash
cd frontend
npm run dev
```

Open browser at: `http://localhost:5173`
