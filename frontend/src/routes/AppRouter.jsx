import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import MemberLayout from '../layouts/MemberLayout';
import AdminLayout from '../layouts/AdminLayout';

// Protection Guards
import { PublicOnlyRoute, MemberRoute, AdminRoute } from './ProtectedRoutes';

// Public Pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import ProductsPage from '../pages/public/ProductsPage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import ReferAndEarnPage from '../pages/public/ReferAndEarnPage';
import ContactPage from '../pages/public/ContactPage';
import TermsPage from '../pages/public/TermsPage';
import PrivacyPage from '../pages/public/PrivacyPage';
import RefundPolicyPage from '../pages/public/RefundPolicyPage';
import DisclaimerPage from '../pages/public/DisclaimerPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Member Pages
import MemberDashboard from '../pages/member/MemberDashboard';
import ReferralsPage from '../pages/member/ReferralsPage';
import NetworkTreePage from '../pages/member/NetworkTreePage';
import EarningsPage from '../pages/member/EarningsPage';
import PayoutsPage from '../pages/member/PayoutsPage';
import ProfilePage from '../pages/member/ProfilePage';
import BankDetailsPage from '../pages/member/BankDetailsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import MembersManagement from '../pages/admin/MembersManagement';
import ProductsManagement from '../pages/admin/ProductsManagement';
import PayoutsManagement from '../pages/admin/PayoutsManagement';
import EnquiriesManagement from '../pages/admin/EnquiriesManagement';
import BannersManagement from '../pages/admin/BannersManagement';
import CmsPagesManagement from '../pages/admin/CmsPagesManagement';
import EmailLogsManagement from '../pages/admin/EmailLogsManagement';

// 404 Page
import NotFoundPage from '../pages/NotFoundPage';

export function AppRouter() {
  return (
    <Routes>
      {/* Public Unprotected Corporate Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/who-we-are" element={<AboutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/refer-and-earn" element={<ReferAndEarnPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
      </Route>

      {/* Guest Only Auth Routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      {/* Member Portal Guarded Routes */}
      <Route element={<MemberRoute />}>
        <Route element={<MemberLayout />}>
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/member/referrals" element={<ReferralsPage />} />
          <Route path="/member/network-tree" element={<NetworkTreePage />} />
          <Route path="/member/earnings" element={<EarningsPage />} />
          <Route path="/member/payouts" element={<PayoutsPage />} />
          <Route path="/member/profile" element={<ProfilePage />} />
          <Route path="/member/bank-details" element={<BankDetailsPage />} />
        </Route>
      </Route>

      {/* Admin Portal Guarded Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<MembersManagement />} />
          <Route path="/admin/products" element={<ProductsManagement />} />
          <Route path="/admin/payouts" element={<PayoutsManagement />} />
          <Route path="/admin/enquiries" element={<EnquiriesManagement />} />
          <Route path="/admin/cms/banners" element={<BannersManagement />} />
          <Route path="/admin/cms/pages" element={<CmsPagesManagement />} />
          <Route path="/admin/email-logs" element={<EmailLogsManagement />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
