import { apiSuccess } from '../utils/response.js';
import * as adminService from '../services/adminService.js';
import * as emailService from '../services/emailService.js';
import { updateUserStatusSchema, processPayoutSchema, productSchema } from '../validators/adminValidator.js';

export async function getStatsHandler(req, res, next) {
  try {
    const stats = await adminService.getAdminStats();
    return apiSuccess(res, 'Admin system metrics retrieved', stats);
  } catch (err) {
    next(err);
  }
}

export async function getMembersHandler(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const role = req.query.role || '';

    const members = await adminService.getAdminMembers({ page, limit, search, status, role });
    return apiSuccess(res, 'Admin member list retrieved', members.items, 200, members.pagination);
  } catch (err) {
    next(err);
  }
}

export async function updateUserStatusHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = updateUserStatusSchema.parse(req.body);
    const ipAddress = req.ip || req.socket.remoteAddress;

    const updated = await adminService.updateUserStatus(id, status, req.user.id, ipAddress);
    return apiSuccess(res, `Member status updated to ${status}`, updated);
  } catch (err) {
    next(err);
  }
}

export async function getPayoutsHandler(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status || '';

    const payouts = await adminService.getAdminPayouts({ page, limit, status });
    return apiSuccess(res, 'Admin payout approval queue retrieved', payouts.items, 200, payouts.pagination);
  } catch (err) {
    next(err);
  }
}

export async function processPayoutHandler(req, res, next) {
  try {
    const { id } = req.params;
    const validated = processPayoutSchema.parse(req.body);
    const ipAddress = req.ip || req.socket.remoteAddress;

    const updated = await adminService.processAdminPayout(id, validated, req.user.id, ipAddress);

    // Trigger transactional payout status update email
    if (updated && updated.user?.email) {
      emailService.sendPayoutStatusEmail({
        email: updated.user.email,
        amount: updated.amount,
        status: updated.status,
        transactionRef: updated.transactionRef
      }).catch(err => console.error('[EMAIL ERROR] Payout email dispatch failed:', err));
    }

    return apiSuccess(res, `Payout request marked as ${validated.status}`, updated);
  } catch (err) {
    next(err);
  }
}

export async function createProductHandler(req, res, next) {
  try {
    const validated = productSchema.parse(req.body);
    const ipAddress = req.ip || req.socket.remoteAddress;

    const product = await adminService.createAdminProduct(validated, req.user.id, ipAddress);
    return apiSuccess(res, 'Product created successfully', product, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateProductHandler(req, res, next) {
  try {
    const { id } = req.params;
    const ipAddress = req.ip || req.socket.remoteAddress;

    const updated = await adminService.updateAdminProduct(id, req.body, req.user.id, ipAddress);
    return apiSuccess(res, 'Product updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteProductHandler(req, res, next) {
  try {
    const { id } = req.params;
    const ipAddress = req.ip || req.socket.remoteAddress;

    const deleted = await adminService.deleteAdminProduct(id, req.user.id, ipAddress);
    return apiSuccess(res, 'Product deleted successfully', deleted);
  } catch (err) {
    next(err);
  }
}

export async function getAuditLogsHandler(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const action = req.query.action || '';

    const logs = await adminService.getAuditLogs({ page, limit, action });
    return apiSuccess(res, 'Audit logs retrieved', logs.items, 200, logs.pagination);
  } catch (err) {
    next(err);
  }
}

// Category Handlers
export async function getAdminCategoriesHandler(req, res, next) {
  try {
    const categories = await adminService.getAdminCategories();
    return apiSuccess(res, 'Admin categories retrieved', categories);
  } catch (err) {
    next(err);
  }
}

export async function createAdminCategoryHandler(req, res, next) {
  try {
    const category = await adminService.createAdminCategory(req.body);
    return apiSuccess(res, 'Category created', category, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateAdminCategoryHandler(req, res, next) {
  try {
    const { id } = req.params;
    const category = await adminService.updateAdminCategory(id, req.body);
    return apiSuccess(res, 'Category updated', category);
  } catch (err) {
    next(err);
  }
}

export async function deleteAdminCategoryHandler(req, res, next) {
  try {
    const { id } = req.params;
    await adminService.deleteAdminCategory(id);
    return apiSuccess(res, 'Category deleted');
  } catch (err) {
    next(err);
  }
}

// Banner Handlers
export async function getAdminBannersHandler(req, res, next) {
  try {
    const banners = await adminService.getAdminBanners();
    return apiSuccess(res, 'Admin banners retrieved', banners);
  } catch (err) {
    next(err);
  }
}

export async function createAdminBannerHandler(req, res, next) {
  try {
    const banner = await adminService.createAdminBanner(req.body);
    return apiSuccess(res, 'Banner created', banner, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateAdminBannerHandler(req, res, next) {
  try {
    const { id } = req.params;
    const banner = await adminService.updateAdminBanner(id, req.body);
    return apiSuccess(res, 'Banner updated', banner);
  } catch (err) {
    next(err);
  }
}

export async function deleteAdminBannerHandler(req, res, next) {
  try {
    const { id } = req.params;
    await adminService.deleteAdminBanner(id);
    return apiSuccess(res, 'Banner deleted');
  } catch (err) {
    next(err);
  }
}

// CMS Pages Handlers
export async function getAdminCmsPagesHandler(req, res, next) {
  try {
    const pages = await adminService.getAdminCmsPages();
    return apiSuccess(res, 'Admin CMS pages retrieved', pages);
  } catch (err) {
    next(err);
  }
}

export async function upsertAdminCmsPageHandler(req, res, next) {
  try {
    const page = await adminService.upsertAdminCmsPage(req.body);
    return apiSuccess(res, 'CMS page saved', page);
  } catch (err) {
    next(err);
  }
}

export async function deleteAdminCmsPageHandler(req, res, next) {
  try {
    const { id } = req.params;
    await adminService.deleteAdminCmsPage(id);
    return apiSuccess(res, 'CMS page deleted');
  } catch (err) {
    next(err);
  }
}

// Testimonials Handlers
export async function getAdminTestimonialsHandler(req, res, next) {
  try {
    const testimonials = await adminService.getAdminTestimonials();
    return apiSuccess(res, 'Admin testimonials retrieved', testimonials);
  } catch (err) {
    next(err);
  }
}

export async function createAdminTestimonialHandler(req, res, next) {
  try {
    const t = await adminService.createAdminTestimonial(req.body);
    return apiSuccess(res, 'Testimonial created', t, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateAdminTestimonialHandler(req, res, next) {
  try {
    const { id } = req.params;
    const t = await adminService.updateAdminTestimonial(id, req.body);
    return apiSuccess(res, 'Testimonial updated', t);
  } catch (err) {
    next(err);
  }
}

export async function deleteAdminTestimonialHandler(req, res, next) {
  try {
    const { id } = req.params;
    await adminService.deleteAdminTestimonial(id);
    return apiSuccess(res, 'Testimonial deleted');
  } catch (err) {
    next(err);
  }
}

// FAQ Handlers
export async function getAdminFaqsHandler(req, res, next) {
  try {
    const faqs = await adminService.getAdminFaqs();
    return apiSuccess(res, 'Admin FAQs retrieved', faqs);
  } catch (err) {
    next(err);
  }
}

export async function createAdminFaqHandler(req, res, next) {
  try {
    const f = await adminService.createAdminFaq(req.body);
    return apiSuccess(res, 'FAQ created', f, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateAdminFaqHandler(req, res, next) {
  try {
    const { id } = req.params;
    const f = await adminService.updateAdminFaq(id, req.body);
    return apiSuccess(res, 'FAQ updated', f);
  } catch (err) {
    next(err);
  }
}

export async function deleteAdminFaqHandler(req, res, next) {
  try {
    const { id } = req.params;
    await adminService.deleteAdminFaq(id);
    return apiSuccess(res, 'FAQ deleted');
  } catch (err) {
    next(err);
  }
}

// Enquiry Handlers
export async function getAdminEnquiriesHandler(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status || '';

    const enquiries = await adminService.getAdminEnquiries({ page, limit, status });
    return apiSuccess(res, 'Admin contact enquiries retrieved', enquiries.items, 200, enquiries.pagination);
  } catch (err) {
    next(err);
  }
}

export async function updateEnquiryStatusHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const updated = await adminService.updateEnquiryStatus(id, { status, adminNotes });
    return apiSuccess(res, 'Enquiry status updated', updated);
  } catch (err) {
    next(err);
  }
}

// Referrals & Reward Rules Handlers
export async function getAdminReferralsHandler(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';

    const result = await adminService.getAdminReferrals({ page, limit, search });
    return apiSuccess(res, 'Admin referrals list retrieved', result.items, 200, result.pagination);
  } catch (err) {
    next(err);
  }
}

export async function getAdminRewardRulesHandler(req, res, next) {
  try {
    const rules = await adminService.getAdminRewardRules();
    return apiSuccess(res, 'Admin reward rules retrieved', rules);
  } catch (err) {
    next(err);
  }
}

export async function upsertRewardRuleHandler(req, res, next) {
  try {
    const rule = await adminService.upsertRewardRule(req.body);
    return apiSuccess(res, 'Reward rule saved', rule);
  } catch (err) {
    next(err);
  }
}

// Broadcast Notification Handler
export async function broadcastNotificationHandler(req, res, next) {
  try {
    const { title, message } = req.body;
    const notif = await adminService.broadcastNotification({ title, message });
    return apiSuccess(res, 'Broadcast notification sent to all members', notif, 201);
  } catch (err) {
    next(err);
  }
}

// Settings Handlers
export async function getAdminSettingsHandler(req, res, next) {
  try {
    const settings = await adminService.getAdminSettings();
    return apiSuccess(res, 'Admin settings retrieved', settings);
  } catch (err) {
    next(err);
  }
}

export async function updateAdminSettingsHandler(req, res, next) {
  try {
    await adminService.updateAdminSettings(req.body);
    return apiSuccess(res, 'Admin settings saved');
  } catch (err) {
    next(err);
  }
}

// Email Management Handlers
export async function getAdminEmailLogsHandler(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status || '';
    const emailType = req.query.emailType || '';
    const recipient = req.query.recipient || '';
    const search = req.query.search || '';

    const result = await adminService.getAdminEmailLogs({ page, limit, status, emailType, recipient, search });
    return apiSuccess(res, 'Admin email delivery logs retrieved', result.items, 200, {
      ...result.pagination,
      stats: result.stats
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminEmailLogByIdHandler(req, res, next) {
  try {
    const { id } = req.params;
    const log = await adminService.getAdminEmailLogById(id);
    return apiSuccess(res, 'Email log details retrieved', log);
  } catch (err) {
    next(err);
  }
}

export async function retryAdminEmailHandler(req, res, next) {
  try {
    const { id } = req.params;
    const ipAddress = req.ip || req.socket.remoteAddress;

    const result = await adminService.retryAdminEmail(id, req.user.id, ipAddress);
    return apiSuccess(res, result.success ? 'Email delivery retried successfully' : 'Email retry failed', result);
  } catch (err) {
    next(err);
  }
}

export async function retryAllAdminFailedEmailsHandler(req, res, next) {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress;

    const result = await adminService.retryAllAdminFailedEmails(req.user.id, ipAddress);
    return apiSuccess(res, `Bulk retry processed for ${result.processedCount} failed emails`, result);
  } catch (err) {
    next(err);
  }
}

export async function getAdminEmailStatusHandler(req, res, next) {
  try {
    const status = await adminService.getAdminEmailStatus();
    return apiSuccess(res, 'SMTP status diagnostics retrieved', status);
  } catch (err) {
    next(err);
  }
}

export async function sendAdminTestEmailHandler(req, res, next) {
  try {
    const { recipient } = req.body;
    if (!recipient) {
      return res.status(400).json({ success: false, message: 'Recipient email address is required' });
    }
    const ipAddress = req.ip || req.socket.remoteAddress;

    const result = await adminService.sendAdminTestEmail(recipient, req.user.id, ipAddress);
    return apiSuccess(res, result.success ? 'Test email dispatched' : 'Test email dispatch failed', result);
  } catch (err) {
    next(err);
  }
}
