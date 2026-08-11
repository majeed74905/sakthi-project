# Admin Portal User Manual: My Sakthi Marketing

## 1. Overview
The Admin Control Suite (`/admin`) provides administrators with complete control over member accounts, payout approvals, product catalog CMS, contact enquiries, and security audit logs.

---

## 2. Key Administrative Modules

### A. Dashboard Metrics (`/admin/dashboard`)
- Displays real-time counts for active members, total payout disbursals, pending requests, active products, and team referrals.
- Visualizes financial disbursal trends via interactive charts.

### B. Member Management (`/admin/members`)
- Filter associates by status (`ACTIVE`, `PENDING`, `SUSPENDED`).
- Audit sponsor relationships and Distributor IDs (`MSM...`).
- Export full member list to CSV via **Export CSV**.

### C. Payout Approval Queue (`/admin/payouts`)
- Process requested wallet withdrawals.
- Enforces payout state machine: `PENDING` → `APPROVED` → `PROCESSING` → `PAID`.
- Requires bank transaction reference (IMPS/NEFT) when marking payout as `PAID`.
- Export queue to CSV via **Export CSV**.

### D. Product CMS (`/admin/products`)
- Create, edit, and toggle active/featured status for marketing products.
- Manage categories and display ordering.

### E. Enquiry Inbox (`/admin/enquiries`)
- Review contact submissions from public visitors with status tracking (`NEW`, `IN_PROGRESS`, `RESOLVED`).

### F. Security Audit Trail (`/admin/audit-logs`)
- Records administrative actions with timestamp, user ID, action name, and IP address for compliance.
