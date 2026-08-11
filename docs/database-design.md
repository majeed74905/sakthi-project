# Database Design: My Sakthi Marketing Platform

## 1. Entity-Relationship (ER) Architecture

The database architecture is designed for high performance, transactional safety, and multi-level referral tracking using MySQL and Prisma ORM.

```
┌─────────────────┐       1:1       ┌─────────────────────┐
│      users      ├─────────────────┤  user_bank_details  │
└────────┬────────┘                 └─────────────────────┘
         │
         │ 1:N (Sponsor Self-Relation)
         ├─── (Parent Sponsor -> Child Referral)
         │
         │ 1:N                       1:N
         ├──────────────────┐        ├─────────────────────┐
         │                  │        │                     │
┌────────▼────────┐ ┌───────▼────────┐ ┌───────────────────▼─┐
│  referral_links │ │   commissions  │ │  payout_requests  │
└─────────────────┘ └────────────────┘ └───────────────────┘

┌─────────────────┐ 1:N             ┌─────────────────────┐
│    categories   ├─────────────────┤       products      │
└─────────────────┘                 └─────────────────────┘

┌─────────────────┐ ┌────────────────┐ ┌───────────────────┐
│     banners     │ │contact_enquiry │ │     cms_pages     │
└─────────────────┘ └────────────────┘ └───────────────────┘
```

---

## 2. Table Specifications & Schema Definitions

### 2.1 `users`
Stores member and administrator accounts.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | UUID primary key |
| `user_code` | `VARCHAR(20)` | `UNIQUE, NOT NULL` | Unique Distributor ID (e.g., `MSM10001`) |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | Member's full name |
| `email` | `VARCHAR(100)` | `UNIQUE, NOT NULL` | Member's email address |
| `phone` | `VARCHAR(15)` | `UNIQUE, NOT NULL` | 10-digit mobile number with prefix |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hash for login |
| `transaction_password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hash for financial transactions |
| `role` | `ENUM` | `DEFAULT 'MEMBER'` | Values: `MEMBER`, `ADMIN`, `SUPER_ADMIN` |
| `status` | `ENUM` | `DEFAULT 'ACTIVE'` | Values: `PENDING`, `ACTIVE`, `SUSPENDED` |
| `sponsor_id` | `VARCHAR(36)` | `NULLABLE, FK(users.id)`| Direct referrer sponsor's User ID |
| `created_at` | `DATETIME` | `DEFAULT NOW()` | Account registration timestamp |
| `updated_at` | `DATETIME` | `UPDATED AT` | Last profile update timestamp |

### 2.2 `user_bank_details`
Stores financial payout account details per member.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | UUID primary key |
| `user_id` | `VARCHAR(36)` | `UNIQUE, FK(users.id)` | Associated member ID |
| `account_name` | `VARCHAR(100)` | `NOT NULL` | Bank account holder name |
| `account_number` | `VARCHAR(35)` | `NOT NULL` | Bank account number |
| `ifsc_code` | `VARCHAR(15)` | `NOT NULL` | Bank IFSC Code |
| `bank_name` | `VARCHAR(100)` | `NOT NULL` | Bank institution name |
| `branch_name` | `VARCHAR(100)` | `NOT NULL` | Branch location |
| `is_verified` | `BOOLEAN` | `DEFAULT FALSE` | Admin verification flag |
| `updated_at` | `DATETIME` | `UPDATED AT` | Last modification timestamp |

### 2.3 `commissions`
Ledger of referral commissions and bonuses.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | UUID primary key |
| `user_id` | `VARCHAR(36)` | `FK(users.id)` | Earning member ID |
| `source_user_id` | `VARCHAR(36)` | `FK(users.id)` | Member whose purchase/signup generated commission |
| `amount` | `DECIMAL(10,2)` | `NOT NULL` | Earned commission amount in INR |
| `type` | `ENUM` | `NOT NULL` | Values: `DIRECT_REFERRAL`, `LEVEL_BONUS`, `PACKAGE_BONUS` |
| `status` | `ENUM` | `DEFAULT 'APPROVED'`| Values: `PENDING`, `APPROVED`, `PAID`, `CANCELLED` |
| `created_at` | `DATETIME` | `DEFAULT NOW()` | Commission calculation timestamp |

### 2.4 `payout_requests`
Tracks wallet withdrawal requests to members' bank accounts.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | UUID primary key |
| `user_id` | `VARCHAR(36)` | `FK(users.id)` | Requesting member ID |
| `amount` | `DECIMAL(10,2)` | `NOT NULL` | Requested withdrawal amount |
| `bank_snapshot` | `JSON` | `NOT NULL` | JSON snapshot of bank details at time of request |
| `status` | `ENUM` | `DEFAULT 'PENDING'` | Values: `PENDING`, `APPROVED`, `REJECTED` |
| `transaction_ref` | `VARCHAR(100)`| `NULLABLE` | Bank IMPS/NEFT transaction reference code |
| `admin_notes` | `TEXT` | `NULLABLE` | Approval or rejection reason |
| `created_at` | `DATETIME` | `DEFAULT NOW()` | Request submission time |
| `processed_at` | `DATETIME` | `NULLABLE` | Admin processing time |

### 2.5 `categories` & `products`
Store household products, appliances, and catalog metadata.

- `categories`: `id`, `name`, `slug`, `description`, `image_url`, `is_active`.
- `products`: `id`, `category_id`, `name`, `slug`, `description`, `price`, `specifications` (JSON), `image_url`, `stock`, `is_active`.

### 2.6 `banners`, `contact_enquiries`, `cms_pages`
- `banners`: `id`, `title`, `subtitle`, `image_url`, `link_url`, `display_order`, `is_active`.
- `contact_enquiries`: `id`, `name`, `email`, `phone`, `message`, `status` (`NEW`, `IN_PROGRESS`, `RESOLVED`), `created_at`.
- `cms_pages`: `id`, `slug` (`terms`, `privacy`, `who-we-are`), `title`, `content` (LONGTEXT), `updated_at`.

---

## 3. Prisma Schema Reference (`schema.prisma`)

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  MEMBER
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  PENDING
  ACTIVE
  SUSPENDED
}

enum PayoutStatus {
  PENDING
  APPROVED
  REJECTED
}

enum EnquiryStatus {
  NEW
  IN_PROGRESS
  RESOLVED
}

model User {
  id                      String            @id @default(uuid())
  userCode                String            @unique @map("user_code")
  fullName                String            @map("full_name")
  email                   String            @unique
  phone                   String            @unique
  passwordHash            String            @map("password_hash")
  transactionPasswordHash String            @map("transaction_password_hash")
  role                    Role              @default(MEMBER)
  status                  UserStatus        @default(ACTIVE)
  sponsorId               String?           @map("sponsor_id")
  sponsor                 User?             @relation("SponsorRelation", fields: [sponsorId], references: [id], onDelete: SetNull)
  referrals               User[]            @relation("SponsorRelation")
  bankDetails             UserBankDetails?
  commissionsEarned       Commission[]      @relation("MemberCommissions")
  commissionsGenerated    Commission[]      @relation("SourceCommissions")
  payoutRequests          PayoutRequest[]
  createdAt               DateTime          @default(now()) @map("created_at")
  updatedAt               DateTime          @updatedAt @map("updated_at")

  @@map("users")
}

model UserBankDetails {
  id            String   @id @default(uuid())
  userId        String   @unique @map("user_id")
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  accountName   String   @map("account_name")
  accountNumber String   @map("account_number")
  ifscCode      String   @map("ifsc_code")
  bankName      String   @map("bank_name")
  branchName    String   @map("branch_name")
  isVerified    Boolean  @default(false) @map("is_verified")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@map("user_bank_details")
}

model Commission {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  user         User     @relation("MemberCommissions", fields: [userId], references: [id])
  sourceUserId String   @map("source_user_id")
  sourceUser   User     @relation("SourceCommissions", fields: [sourceUserId], references: [id])
  amount       Decimal  @db.Decimal(10, 2)
  type         String   
  status       String   @default("APPROVED")
  createdAt    DateTime @default(now()) @map("created_at")

  @@map("commissions")
}

model PayoutRequest {
  id             String       @id @default(uuid())
  userId         String       @map("user_id")
  user           User         @relation(fields: [userId], references: [id])
  amount         Decimal      @db.Decimal(10, 2)
  bankSnapshot   Json         @map("bank_snapshot")
  status         PayoutStatus @default(PENDING)
  transactionRef String?      @map("transaction_ref")
  adminNotes     String?      @map("admin_notes") @db.Text
  createdAt      DateTime     @default(now()) @map("created_at")
  processedAt    DateTime?    @map("processed_at")

  @@map("payout_requests")
}

model Category {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?   @db.Text
  imageUrl    String?   @map("image_url")
  isActive    Boolean   @default(true) @map("is_active")
  products    Product[]
  createdAt   DateTime  @default(now()) @map("created_at")

  @@map("categories")
}

model Product {
  id            String   @id @default(uuid())
  categoryId    String   @map("category_id")
  category      Category @relation(fields: [categoryId], references: [id])
  name          String
  slug          String   @unique
  description   String   @db.Text
  price         Decimal  @db.Decimal(10, 2)
  specifications Json?
  imageUrl      String?  @map("image_url")
  stock         Int      @default(0)
  isActive      Boolean  @default(true) @map("is_active")
  createdAt     DateTime @default(now()) @map("created_at")

  @@map("products")
}

model Banner {
  id           String   @id @default(uuid())
  title        String
  subtitle     String?
  imageUrl     String   @map("image_url")
  linkUrl      String?  @map("link_url")
  displayOrder Int      @default(0) @map("display_order")
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")

  @@map("banners")
}

model ContactEnquiry {
  id        String        @id @default(uuid())
  name      String
  email     String
  phone     String?
  message   String        @db.Text
  status    EnquiryStatus @default(NEW)
  createdAt DateTime      @default(now()) @map("created_at")

  @@map("contact_enquiries")
}

model CmsPage {
  id        String   @id @default(uuid())
  slug      String   @unique
  title     String
  content   String   @db.LongText
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("cms_pages")
}
```
