# Route Map: My Sakthi Marketing Platform

## Public Unauthenticated Routes (`/api/v1/public`)

| HTTP Method | Route Endpoint | Controller Handler | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | `getHealth` | System health status check |
| `GET` | `/api/v1/public/products` | `getProductsHandler` | Fetch product catalog with filtering & search |
| `GET` | `/api/v1/public/products/:id` | `getProductByIdHandler` | Fetch single product by ID or Slug |
| `GET` | `/api/v1/public/categories` | `getCategoriesHandler` | Fetch list of active product categories |
| `GET` | `/api/v1/public/banners` | `getBannersHandler` | Fetch active promotional hero banners |
| `GET` | `/api/v1/public/cms/:slug` | `getCmsPageHandler` | Fetch CMS dynamic page content by slug |
| `POST` | `/api/v1/public/enquiries` | `createEnquiryHandler` | Submit contact form enquiry (Rate limited) |

---

## Authentication Routes (`/api/v1/auth`)

| HTTP Method | Route Endpoint | Middleware | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/auth/verify-sponsor/:userCode` | None | Verify sponsor user code against database |
| `POST` | `/api/v1/auth/register` | Rate Limiter | Member onboarding signup (Atomic transaction) |
| `POST` | `/api/v1/auth/login` | Rate Limiter | User login (User Code, Email, Mobile + Password) |
| `POST` | `/api/v1/auth/refresh` | None | Refresh access token using valid refresh token |
| `GET` | `/api/v1/auth/me` | `authenticate` | Fetch current authenticated user info |
| `POST` | `/api/v1/auth/forgot-password` | Rate Limiter | Request password reset token |
| `POST` | `/api/v1/auth/reset-password` | Rate Limiter | Reset password with token |

---

## Member Portal Protected Routes (`/api/v1/member`)

*Requires `authenticate` and `authorize('MEMBER', 'ADMIN', 'SUPER_ADMIN')`.*

| HTTP Method | Route Endpoint | Controller Handler | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/member/profile` | `getProfileHandler` | Fetch personal member profile |
| `PUT` | `/api/v1/member/profile` | `updateProfileHandler` | Update personal member profile |
| `GET` | `/api/v1/member/bank-details` | `getBankDetailsHandler` | Fetch member bank details (Masked account number) |
| `PUT` | `/api/v1/member/bank-details` | `updateBankDetailsHandler` | Update bank details (Transaction password required) |
| `GET` | `/api/v1/member/dashboard` | `getDashboardHandler` | Fetch wallet balance, total earnings, team size |
| `GET` | `/api/v1/member/referrals` | `getReferralsHandler` | Fetch direct referrals list |
| `GET` | `/api/v1/member/network-tree` | `getNetworkTreeHandler` | Fetch downline tree visualizer structure |
| `GET` | `/api/v1/member/earnings` | `getEarningsHandler` | Fetch commission ledger entries |
| `POST` | `/api/v1/member/payout-request` | `createPayoutRequestHandler` | Submit payout withdrawal request |
| `GET` | `/api/v1/member/payouts` | `getMemberPayoutsHandler` | Fetch member payout withdrawal history |

---

## Admin Portal Protected Routes (`/api/v1/admin`)

*Requires `authenticate` and `authorize('ADMIN', 'SUPER_ADMIN')`.*

| HTTP Method | Route Endpoint | Controller Handler | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/stats` | `getStatsHandler` | Fetch executive administrative metrics |
| `GET` | `/api/v1/admin/members` | `getMembersHandler` | Search & filter member list |
| `PUT` | `/api/v1/admin/members/:id/status` | `updateUserStatusHandler` | Update user status (PENDING, ACTIVE, SUSPENDED) |
| `GET` | `/api/v1/admin/payouts` | `getPayoutsHandler` | Fetch payout approval queue (Masked bank details) |
| `PUT` | `/api/v1/admin/payouts/:id` | `processPayoutHandler` | Process payout state transition (PENDING -> APPROVED -> PAID) |
| `POST` | `/api/v1/admin/products` | `createProductHandler` | Create new catalog product |
| `PUT` | `/api/v1/admin/products/:id` | `updateProductHandler` | Update existing catalog product |
| `DELETE` | `/api/v1/admin/products/:id` | `deleteProductHandler` | Delete catalog product |
| `GET` | `/api/v1/admin/audit-logs` | `getAuditLogsHandler` | View system security and administrative audit trail |
