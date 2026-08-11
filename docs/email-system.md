# Nodemailer Email System & DB Delivery Logging Architecture

## 1. Executive Summary

Phase 10 introduced production-grade Nodemailer email infrastructure featuring database-backed delivery tracking (`EmailLog`), failure detection, error code sanitization, manual/bulk retry capabilities, SMTP health diagnostics, and an **Admin Email Management Portal** (`/admin/email-logs`).

---

## 2. Technical Architecture

```text
Application Event (Register / Payout / Reset Password)
                          │
                          ▼
                 emailService.sendEmail()
                          │
                          ▼
             Create EmailLog Entry (Status: SENDING)
                          │
                          ▼
             Nodemailer Transport Delivery Attempt
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
        [SUCCESS]                   [FAILURE]
            │                           │
  Set Status: SENT            Set Status: FAILED
  Set sentAt timestamp        Set failedAt timestamp
  Set messageId               Set errorCode & sanitized errorMessage
                                        │
                                        ▼
                            Admin Email Management Portal
                            (/admin/email-logs)
                                        │
                                        ▼
                            Manual / Bulk Retry Action
```

---

## 3. Database Model (`EmailLog`)

```prisma
enum EmailStatus {
  PENDING
  SENDING
  SENT
  FAILED
  RETRYING
}

model EmailLog {
  id           String      @id @default(uuid())
  recipient    String
  subject      String
  emailType    String      @map("email_type")
  status       EmailStatus @default(PENDING)
  attemptCount Int         @default(0) @map("attempt_count")
  lastAttemptAt DateTime?  @map("last_attempt_at")
  sentAt       DateTime?   @map("sent_at")
  failedAt     DateTime?   @map("failed_at")
  errorCode    String?     @map("error_code")
  errorMessage String?     @map("error_message") @db.Text
  messageId    String?     @map("message_id")
  createdAt    DateTime    @default(now()) @map("created_at")
  updatedAt    DateTime    @updatedAt @map("updated_at")

  @@index([status])
  @@index([recipient])
  @@index([emailType])
  @@index([createdAt])
  @@map("email_logs")
}
```

---

## 4. Controlled Email Types
- `WELCOME`: New associate member welcome email with User Code (`MSM...`).
- `PASSWORD_RESET`: Password reset token link dispatch.
- `PAYOUT_APPROVED`: Payout request approved notification.
- `PAYOUT_REJECTED`: Payout request rejected notification with reason.
- `PAYOUT_PROCESSING`: Bank transfer processing notification.
- `PAYOUT_PAID`: Payment completed notification with transaction reference.
- `TEST`: SMTP configuration test email.
