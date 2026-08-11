# Pre-Deployment & Production Onboarding Manual

This document details the exact 7-step sequence required before turning on commercial operations for **My Sakthi Marketing Platform**.

```text
                 PRE-DEPLOYMENT SEQUENCE
                            │
                            ▼
               1. Server & DB Provisioning
                            │
                            ▼
             2. Production .env Configuration
                            │
                            ▼
              3. Demo Data Purge Execution
                            │
                            ▼
             4. Company Business Rules Sign-Off
                            │
                            ▼
               5. Legal Content Approval
                            │
                            ▼
             6. Operational Backup Restore Test
                            │
                            ▼
             7. Staging Flow Verification
                            │
                            ▼
                      🚀 GO LIVE
```

---

## Step 1: Server & Database Provisioning
- Provision a dedicated Ubuntu 22.04 LTS or RHEL server.
- Install Nginx, Node.js v20 LTS, and MySQL 8.0 server.
- Execute database schema creation safely:
  ```bash
  cd backend
  npx prisma db push --skip-generate
  ```
- **CRITICAL**: Do NOT run `npx prisma db seed` on production instances.

---

## Step 2: Separate Production Environment Configuration (`.env`)
Create `/backend/.env` with production secrets (never commit to git):
```env
PORT=5000
NODE_ENV=production
DATABASE_URL="mysql://PRODUCTION_DB_USER:STRONG_PROD_PASSWORD@127.0.0.1:3306/mysakthimarketing"

# Generate 32-character random string for secrets (e.g. openssl rand -hex 32)
JWT_SECRET="GENERATE_UNIQUE_32_CHAR_RANDOM_STRING_SECRET"
JWT_REFRESH_SECRET="GENERATE_UNIQUE_32_CHAR_REFRESH_SECRET"

CLIENT_URL="https://mysakthimarketing.in"
```

---

## Step 3: Demo Data Cleanup
Flush all development seed records:
```bash
cd backend
node scripts/clean-demo-data.js --force
```

---

## Step 4: Company Business Rules Confirmation
Confirm key commercial parameters in [business-rule-verification.md](file:///c:/Users/Sivaprashanna/OneDrive/Desktop/project/docs/business-rule-verification.md):
- Sponsor eligibility requirements
- Referral commission amounts
- Minimum payout threshold (e.g. ₹500)
- Payout approval SLA

---

## Step 5: Legal Content Sign-Off
Obtain legal approval for:
- Terms & Conditions
- Privacy Policy & Data Masking Disclosure
- Income & Rewards Disclaimer
- Product Return & Refund Policy

---

## Step 6: Backup Restoration Test
Execute an operational test restore as documented in [backup-recovery.md](file:///c:/Users/Sivaprashanna/OneDrive/Desktop/project/docs/backup-recovery.md):
```bash
# 1. Take dump
mysqldump -u root -p mysakthimarketing | gzip > /tmp/test_backup.sql.gz
# 2. Test restore on staging DB
gunzip -c /tmp/test_backup.sql.gz | mysql -u root -p mysakthimarketing_stage
# 3. Validate
cd backend && npx prisma validate
```

---

## Step 7: Final Staging Flow Test
Run end-to-end user flow on staging URL:
1. Public Visitor $\rightarrow$ Products $\rightarrow$ Product Details $\rightarrow$ Contact Form
2. New Member Registration $\rightarrow$ Live Sponsor Check $\rightarrow$ MSM ID Assignment
3. Login $\rightarrow$ Dashboard $\rightarrow$ Bank Details Update $\rightarrow$ Payout Request
4. Admin Login $\rightarrow$ Payout Queue Review $\rightarrow$ Transition `APPROVED` $\rightarrow$ `PAID` $\rightarrow$ Audit Log entry
