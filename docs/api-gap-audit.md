# API Gap Audit: My Sakthi Marketing Platform

This document logs the audit comparing required UI functionality against existing backend API endpoints to ensure **zero fake frontend mock data or hardcoded statistics**.

---

## Endpoint Audit Matrix

| UI Feature / Screen | Required Endpoint | Existing Status | Action Taken |
| :--- | :--- | :---: | :--- |
| **Public Testimonials** | `GET /api/v1/public/testimonials` | ❌ Missing | Added to `cmsController` & `cmsRoutes` |
| **Public FAQs** | `GET /api/v1/public/faqs` | ❌ Missing | Added to `cmsController` & `cmsRoutes` |
| **Public Site Settings** | `GET /api/v1/public/settings` | ❌ Missing | Added to `cmsController` & `cmsRoutes` |
| **Admin Category CRUD** | `GET/POST/PUT/DELETE /api/v1/admin/categories` | ❌ Missing | Added to `adminController` & `adminRoutes` |
| **Admin Banner CRUD** | `GET/POST/PUT/DELETE /api/v1/admin/banners` | ❌ Missing | Added to `adminController` & `adminRoutes` |
| **Admin CMS Page CRUD** | `GET/POST/PUT/DELETE /api/v1/admin/cms` | ❌ Missing | Added to `adminController` & `adminRoutes` |
| **Admin Testimonial CRUD** | `GET/POST/PUT/DELETE /api/v1/admin/testimonials` | ❌ Missing | Added to `adminController` & `adminRoutes` |
| **Admin FAQ CRUD** | `GET/POST/PUT/DELETE /api/v1/admin/faqs` | ❌ Missing | Added to `adminController` & `adminRoutes` |
| **Admin Enquiry Manager** | `GET/PUT /api/v1/admin/enquiries` | ❌ Missing | Added to `adminController` & `adminRoutes` |
| **Admin Referral Management** | `GET /api/v1/admin/referrals` | ❌ Missing | Added to `adminController` & `adminRoutes` |
| **Admin Reward Rules** | `GET/POST/PUT /api/v1/admin/reward-rules` | ❌ Missing | Added to `adminController` & `adminRoutes` |
| **Member Notifications** | `GET/PUT /api/v1/member/notifications` | ❌ Missing | Added to `memberController` & `memberRoutes` |
| **Admin Broadcast Notif** | `POST /api/v1/admin/notifications/broadcast` | ❌ Missing | Added to `adminController` & `adminRoutes` |
| **Member Password Change** | `PUT /api/v1/member/change-password` | ❌ Missing | Added to `memberController` & `memberRoutes` |
| **Admin Site Settings** | `GET/PUT /api/v1/admin/settings` | ❌ Missing | Added to `adminController` & `adminRoutes` |

---

## Conclusion
All 15 missing endpoints will be implemented in the Express backend codebase prior to connecting the React UI components, guaranteeing that **100% of dynamic frontend components connect directly to authoritative MySQL database APIs**.
