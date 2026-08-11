# Email Failure Handling & Retry Management Manual

## 1. Primary Business Transaction Separation
An email delivery failure **NEVER** rolls back or invalidates a primary business transaction.

For example:
- **Member Registration**: If SMTP fails during registration, the member account creation in MySQL remains valid and active. The `EmailLog` status is recorded as `FAILED`, allowing administrators to resend the welcome email from `/admin/email-logs`.
- **Payout Approval**: If SMTP fails when an administrator approves a payout request, the payout state transition `APPROVED` persists in the database. The notification email failure is logged independently as `FAILED`.

---

## 2. Sanitized Error Logging
Error codes and messages stored in `email_logs.error_message` are automatically sanitized by `emailService.js` to prevent leaking SMTP credentials, passwords, or tokens in logs or Admin UI displays.

---

## 3. Administrative Resend / Retry Workflow
1. Navigate to `/admin/email-logs`.
2. Filter by status: `FAILED`.
3. Click **View Details** to inspect sanitized error diagnostics (e.g. `ECONNREFUSED`, `AUTH_FAILED`).
4. Click **Retry** on an individual log or **Retry All Failed** to trigger bulk resend attempts.
5. The system increments `attemptCount`, sets status to `RETRYING`, attempts SMTP delivery, and updates the status to `SENT` or `FAILED`.
