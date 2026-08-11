import { Router } from 'express';
import {
  getStatsHandler,
  getMembersHandler,
  updateUserStatusHandler,
  getPayoutsHandler,
  processPayoutHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getAuditLogsHandler,
  getAdminCategoriesHandler,
  createAdminCategoryHandler,
  updateAdminCategoryHandler,
  deleteAdminCategoryHandler,
  getAdminBannersHandler,
  createAdminBannerHandler,
  updateAdminBannerHandler,
  deleteAdminBannerHandler,
  getAdminCmsPagesHandler,
  upsertAdminCmsPageHandler,
  deleteAdminCmsPageHandler,
  getAdminTestimonialsHandler,
  createAdminTestimonialHandler,
  updateAdminTestimonialHandler,
  deleteAdminTestimonialHandler,
  getAdminFaqsHandler,
  createAdminFaqHandler,
  updateAdminFaqHandler,
  deleteAdminFaqHandler,
  getAdminEnquiriesHandler,
  updateEnquiryStatusHandler,
  getAdminReferralsHandler,
  getAdminRewardRulesHandler,
  upsertRewardRuleHandler,
  broadcastNotificationHandler,
  getAdminSettingsHandler,
  updateAdminSettingsHandler,
  getAdminEmailLogsHandler,
  getAdminEmailLogByIdHandler,
  retryAdminEmailHandler,
  retryAllAdminFailedEmailsHandler,
  getAdminEmailStatusHandler,
  sendAdminTestEmailHandler
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes with authentication and ADMIN/SUPER_ADMIN role check
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/stats', getStatsHandler);
router.get('/members', getMembersHandler);
router.put('/members/:id/status', updateUserStatusHandler);
router.get('/payouts', getPayoutsHandler);
router.put('/payouts/:id', processPayoutHandler);

// Products
router.post('/products', createProductHandler);
router.put('/products/:id', updateProductHandler);
router.delete('/products/:id', deleteProductHandler);

// Categories
router.get('/categories', getAdminCategoriesHandler);
router.post('/categories', createAdminCategoryHandler);
router.put('/categories/:id', updateAdminCategoryHandler);
router.delete('/categories/:id', deleteAdminCategoryHandler);

// Banners
router.get('/banners', getAdminBannersHandler);
router.post('/banners', createAdminBannerHandler);
router.put('/banners/:id', updateAdminBannerHandler);
router.delete('/banners/:id', deleteAdminBannerHandler);

// CMS Pages
router.get('/cms', getAdminCmsPagesHandler);
router.post('/cms', upsertAdminCmsPageHandler);
router.delete('/cms/:id', deleteAdminCmsPageHandler);

// Testimonials
router.get('/testimonials', getAdminTestimonialsHandler);
router.post('/testimonials', createAdminTestimonialHandler);
router.put('/testimonials/:id', updateAdminTestimonialHandler);
router.delete('/testimonials/:id', deleteAdminTestimonialHandler);

// FAQs
router.get('/faqs', getAdminFaqsHandler);
router.post('/faqs', createAdminFaqHandler);
router.put('/faqs/:id', updateAdminFaqHandler);
router.delete('/faqs/:id', deleteAdminFaqHandler);

// Enquiries
router.get('/enquiries', getAdminEnquiriesHandler);
router.put('/enquiries/:id/status', updateEnquiryStatusHandler);

// Referrals & Rewards
router.get('/referrals', getAdminReferralsHandler);
router.get('/reward-rules', getAdminRewardRulesHandler);
router.post('/reward-rules', upsertRewardRuleHandler);

// Notifications & Settings
router.post('/notifications/broadcast', broadcastNotificationHandler);
router.get('/settings', getAdminSettingsHandler);
router.put('/settings', updateAdminSettingsHandler);

// Audit logs
router.get('/audit-logs', getAuditLogsHandler);

// Email Logs & Diagnostics
router.get('/email-logs', getAdminEmailLogsHandler);
router.get('/email-logs/:id', getAdminEmailLogByIdHandler);
router.post('/email-logs/:id/retry', retryAdminEmailHandler);
router.post('/email-logs/retry-failed', retryAllAdminFailedEmailsHandler);
router.get('/email/status', getAdminEmailStatusHandler);
router.post('/email/test', sendAdminTestEmailHandler);

export default router;
