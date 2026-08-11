# Frontend Architecture: My Sakthi Marketing Platform

## Architectural Overview

The frontend is a modern React 18 single-page application built with Vite 5, Tailwind CSS 3, Lucide React, and React Router v6.

```
frontend/src/
├── components/
│   └── common/             # Reusable UI primitives (Button, Input, Card, Modal, Table, LoadingSpinner, EmptyState, ErrorState, PageContainer, ErrorBoundary)
├── context/
│   └── AuthContext.jsx     # Centralized authentication & token session state management
├── services/
│   ├── apiClient.js        # Axios HTTP client with JWT Bearer header interceptor & 401 handler
│   ├── authService.js      # Sponsor check, register, login, reset password APIs
│   ├── publicService.js    # Products, categories, banners, testimonials, FAQs, enquiry submission APIs
│   ├── memberService.js    # Profile, bank details, dashboard ledger, referrals, downline tree, payout request APIs
│   └── adminService.js     # System stats, member status, payout state machine, product/CMS CRUD APIs
├── layouts/
│   ├── PublicLayout.jsx    # Corporate public site header & footer wrapper
│   ├── AuthLayout.jsx      # Onboarding & authentication card wrapper
│   ├── MemberLayout.jsx    # Associate member SaaS portal sidebar & header
│   └── AdminLayout.jsx     # Executive admin control portal sidebar & header
├── pages/
│   ├── public/             # HomePage, AboutPage, ProductsPage, ProductDetailPage, ReferAndEarnPage, ContactPage, TermsPage, PrivacyPage, RefundPolicyPage, DisclaimerPage
│   ├── auth/               # LoginPage, RegisterPage, ForgotPasswordPage
│   ├── member/             # MemberDashboard, ReferralsPage, NetworkTreePage, EarningsPage, PayoutsPage, ProfilePage, BankDetailsPage
│   └── admin/              # AdminDashboard, MembersManagement, ProductsManagement, PayoutsManagement, EnquiriesManagement, BannersManagement, CmsPagesManagement
├── routes/
│   ├── ProtectedRoutes.jsx # Route protection guards (PublicOnlyRoute, MemberRoute, AdminRoute)
│   └── AppRouter.jsx       # Complete URL route mapping
└── App.jsx                 # Application root wrapped in ErrorBoundary, BrowserRouter, AuthProvider, and Toaster
```

---

## Authentication & Authorization Flow

1. **Token Persistence**: JWT Access Token (15m) and Refresh Token (7d) stored securely in `localStorage`.
2. **Axios Interceptor**: `apiClient.js` automatically attaches `Authorization: Bearer <token>` to all outgoing requests.
3. **Session Restoration**: `AuthContext.jsx` invokes `GET /api/v1/auth/me` on initial load. If valid, populates user identity.
4. **Route Guards**:
   - `PublicOnlyRoute`: Redirects logged-in users away from `/login` or `/register` to their respective portal dashboard.
   - `MemberRoute`: Guarded route accessible by `MEMBER`, `ADMIN`, `SUPER_ADMIN`.
   - `AdminRoute`: Guarded route requiring `ADMIN` or `SUPER_ADMIN`. Returns `403 Access Denied` for non-admin users.
