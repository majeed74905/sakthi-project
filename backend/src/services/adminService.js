import prisma from '../config/db.js';
import { maskAccountNumber } from '../utils/maskData.js';
import { createAuditLog } from '../utils/auditLog.js';
import * as emailService from './emailService.js';

/**
 * Real Database System Analytics for Admin Dashboard
 */
export async function getAdminStats() {
  const [
    totalUsers,
    activeMembers,
    totalProducts,
    totalReferrals,
    pendingPayoutsCount,
    approvedPayoutsCount,
    paidPayoutsAgg,
    pendingEnquiriesCount
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'MEMBER', status: 'ACTIVE' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.referral.count(),
    prisma.payoutRequest.count({ where: { status: 'PENDING' } }),
    prisma.payoutRequest.count({ where: { status: 'APPROVED' } }),
    prisma.payoutRequest.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true }
    }),
    prisma.contactEnquiry.count({ where: { status: 'NEW' } })
  ]);

  return {
    totalUsers,
    activeMembers,
    totalProducts,
    totalReferrals,
    pendingPayoutsCount,
    approvedPayoutsCount,
    totalPaidVolume: Number(paidPayoutsAgg._sum.amount) || 0,
    pendingEnquiriesCount
  };
}

/**
 * Fetch member list with search, status filter, pagination
 */
export async function getAdminMembers({ page = 1, limit = 10, search = '', status = '', role = '' }) {
  const skip = (page - 1) * limit;

  const where = {
    ...(status ? { status } : {}),
    ...(role ? { role } : {}),
    ...(search
      ? {
          OR: [
            { userCode: { contains: search } },
            { fullName: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } }
          ]
        }
      : {})
  };

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userCode: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        sponsor: {
          select: {
            userCode: true,
            fullName: true
          }
        },
        createdAt: true
      }
    })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Update User Account Status (PENDING, ACTIVE, SUSPENDED)
 */
export async function updateUserStatus(userId, status, adminId, ipAddress) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.errorCode = 'NOT_FOUND';
    throw error;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status }
  });

  await createAuditLog({
    userId: adminId,
    action: 'USER_STATUS_UPDATED',
    entityType: 'User',
    entityId: userId,
    description: `Admin changed status of ${user.userCode} to ${status}`,
    ipAddress
  });

  return updated;
}

/**
 * Admin Payout Requests Queue with masked bank details
 */
export async function getAdminPayouts({ page = 1, limit = 10, status = '' }) {
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const [total, rawItems] = await Promise.all([
    prisma.payoutRequest.count({ where }),
    prisma.payoutRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            userCode: true,
            fullName: true,
            email: true,
            phone: true
          }
        }
      }
    })
  ]);

  // Mask bank snapshot account numbers for safe display
  const items = rawItems.map((p) => {
    const bank = p.bankSnapshot || {};
    return {
      ...p,
      bankSnapshot: {
        accountName: bank.accountName || 'N/A',
        accountNumberMasked: bank.accountNumberMasked || maskAccountNumber(bank.accountNumber),
        ifscCode: bank.ifscCode || 'N/A',
        bankName: bank.bankName || 'N/A',
        branchName: bank.branchName || 'N/A'
      }
    };
  });

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Process Payout Request with strict State Machine transitions
 * Valid transitions:
 * - PENDING -> APPROVED or REJECTED or CANCELLED
 * - APPROVED -> PROCESSING
 * - PROCESSING -> PAID
 */
export async function processAdminPayout(payoutId, data, adminId, ipAddress) {
  const { status: targetStatus, transactionRef, adminNotes } = data;

  const payout = await prisma.payoutRequest.findUnique({
    where: { id: payoutId },
    include: { user: { select: { userCode: true, email: true } } }
  });

  if (!payout) {
    const error = new Error('Payout request not found');
    error.statusCode = 404;
    error.errorCode = 'NOT_FOUND';
    throw error;
  }

  // Strict State Transition Validation
  const currentStatus = payout.status;
  const validTransitions = {
    PENDING: ['APPROVED', 'REJECTED', 'CANCELLED'],
    APPROVED: ['PROCESSING', 'REJECTED', 'CANCELLED'],
    PROCESSING: ['PAID', 'CANCELLED'],
    PAID: [],
    REJECTED: [],
    CANCELLED: []
  };

  if (!validTransitions[currentStatus].includes(targetStatus)) {
    const error = new Error(`Invalid payout state transition from '${currentStatus}' to '${targetStatus}'`);
    error.statusCode = 400;
    error.errorCode = 'INVALID_STATE_TRANSITION';
    throw error;
  }

  const updated = await prisma.payoutRequest.update({
    where: { id: payoutId },
    data: {
      status: targetStatus,
      transactionRef: transactionRef || payout.transactionRef,
      adminNotes: adminNotes || payout.adminNotes,
      reviewedById: adminId,
      reviewedAt: new Date()
    },
    include: { user: { select: { userCode: true, email: true } } }
  });

  await createAuditLog({
    userId: adminId,
    action: 'PAYOUT_STATUS_CHANGED',
    entityType: 'PayoutRequest',
    entityId: payoutId,
    description: `Admin transition payout ${payoutId} for ${payout.user.userCode} from ${currentStatus} to ${targetStatus}`,
    ipAddress
  });

  return updated;
}

/**
 * Admin Product CRUD
 */
export async function createAdminProduct(data, adminId, ipAddress) {
  const product = await prisma.product.create({
    data: {
      categoryId: data.categoryId,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      stock: data.stock,
      isFeatured: data.isFeatured || false,
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive !== undefined ? data.isActive : true
    }
  });

  await createAuditLog({
    userId: adminId,
    action: 'PRODUCT_CREATED',
    entityType: 'Product',
    entityId: product.id,
    description: `Created product '${product.name}'`,
    ipAddress
  });

  return product;
}

export async function updateAdminProduct(id, data, adminId, ipAddress) {
  const updated = await prisma.product.update({
    where: { id },
    data
  });

  await createAuditLog({
    userId: adminId,
    action: 'PRODUCT_UPDATED',
    entityType: 'Product',
    entityId: id,
    description: `Updated product '${updated.name}'`,
    ipAddress
  });

  return updated;
}

export async function deleteAdminProduct(id, adminId, ipAddress) {
  const deleted = await prisma.product.delete({
    where: { id }
  });

  await createAuditLog({
    userId: adminId,
    action: 'PRODUCT_DELETED',
    entityType: 'Product',
    entityId: id,
    description: `Deleted product '${deleted.name}'`,
    ipAddress
  });

  return deleted;
}

/**
 * Admin Audit Logs Viewer
 */
export async function getAuditLogs({ page = 1, limit = 20, action = '' }) {
  const skip = (page - 1) * limit;
  const where = action ? { action } : {};

  const [total, items] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            userCode: true,
            fullName: true,
            role: true
          }
        }
      }
    })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Category CRUD
 */
export async function getAdminCategories() {
  return await prisma.category.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function createAdminCategory(data) {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return await prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive !== undefined ? data.isActive : true
    }
  });
}

export async function updateAdminCategory(id, data) {
  return await prisma.category.update({ where: { id }, data });
}

export async function deleteAdminCategory(id) {
  const productsCount = await prisma.product.count({ where: { categoryId: id } });
  if (productsCount > 0) {
    const error = new Error('Cannot delete category because it contains active products');
    error.statusCode = 400;
    error.errorCode = 'CATEGORY_HAS_PRODUCTS';
    throw error;
  }
  return await prisma.category.delete({ where: { id } });
}

/**
 * Banner CRUD
 */
export async function getAdminBanners() {
  return await prisma.banner.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function createAdminBanner(data) {
  return await prisma.banner.create({ data });
}

export async function updateAdminBanner(id, data) {
  return await prisma.banner.update({ where: { id }, data });
}

export async function deleteAdminBanner(id) {
  return await prisma.banner.delete({ where: { id } });
}

/**
 * CMS Pages CRUD
 */
export async function getAdminCmsPages() {
  return await prisma.cmsPage.findMany({ orderBy: { title: 'asc' } });
}

export async function upsertAdminCmsPage(data) {
  const slug = data.slug.toLowerCase().trim();
  return await prisma.cmsPage.upsert({
    where: { slug },
    update: {
      title: data.title,
      content: data.content,
      metaDescription: data.metaDescription,
      isPublished: data.isPublished !== undefined ? data.isPublished : true
    },
    create: {
      slug,
      title: data.title,
      content: data.content,
      metaDescription: data.metaDescription,
      isPublished: data.isPublished !== undefined ? data.isPublished : true
    }
  });
}

export async function deleteAdminCmsPage(id) {
  return await prisma.cmsPage.delete({ where: { id } });
}

/**
 * Testimonial CRUD
 */
export async function getAdminTestimonials() {
  return await prisma.testimonial.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function createAdminTestimonial(data) {
  return await prisma.testimonial.create({ data });
}

export async function updateAdminTestimonial(id, data) {
  return await prisma.testimonial.update({ where: { id }, data });
}

export async function deleteAdminTestimonial(id) {
  return await prisma.testimonial.delete({ where: { id } });
}

/**
 * FAQ CRUD
 */
export async function getAdminFaqs() {
  return await prisma.faq.findMany({ orderBy: { displayOrder: 'asc' } });
}

export async function createAdminFaq(data) {
  return await prisma.faq.create({ data });
}

export async function updateAdminFaq(id, data) {
  return await prisma.faq.update({ where: { id }, data });
}

export async function deleteAdminFaq(id) {
  return await prisma.faq.delete({ where: { id } });
}

/**
 * Contact Enquiries Management
 */
export async function getAdminEnquiries({ page = 1, limit = 10, status = '' }) {
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const [total, items] = await Promise.all([
    prisma.contactEnquiry.count({ where }),
    prisma.contactEnquiry.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
}

export async function updateEnquiryStatus(id, { status, adminNotes }) {
  return await prisma.contactEnquiry.update({
    where: { id },
    data: { status, adminNotes }
  });
}

/**
 * Referral & Reward Rules Management
 */
export async function getAdminReferrals({ page = 1, limit = 10, search = '' }) {
  const skip = (page - 1) * limit;
  const where = search
    ? {
        OR: [
          { sponsorCode: { contains: search } },
          { referredUserCode: { contains: search } }
        ]
      }
    : {};

  const [total, items] = await Promise.all([
    prisma.referral.count({ where }),
    prisma.referral.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
}

export async function getAdminRewardRules() {
  return await prisma.rewardRule.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function upsertRewardRule(data) {
  if (data.id) {
    return await prisma.rewardRule.update({
      where: { id: data.id },
      data
    });
  }
  return await prisma.rewardRule.create({ data });
}

/**
 * Broadcast Notification to All Members
 */
export async function broadcastNotification({ title, message }) {
  return await prisma.notification.create({
    data: {
      userId: null, // Null indicates global broadcast
      title,
      message,
      type: 'ANNOUNCEMENT'
    }
  });
}

/**
 * Admin Site Settings
 */
export async function getAdminSettings() {
  return await prisma.siteSetting.findMany();
}

export async function updateAdminSettings(settingsObject) {
  const operations = Object.entries(settingsObject).map(([key, value]) =>
    prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    })
  );
  return await prisma.$transaction(operations);
}

/**
 * Admin Email Delivery Logs Management & Diagnostics
 */
export async function getAdminEmailLogs({ page = 1, limit = 10, status = '', emailType = '', recipient = '', search = '' }) {
  const skip = (page - 1) * limit;
  const where = {
    ...(status ? { status } : {}),
    ...(emailType ? { emailType } : {}),
    ...(recipient ? { recipient: { contains: recipient } } : {}),
    ...(search
      ? {
          OR: [
            { recipient: { contains: search } },
            { subject: { contains: search } },
            { errorCode: { contains: search } }
          ]
        }
      : {})
  };

  const [total, items, countsByStatus] = await Promise.all([
    prisma.emailLog.count({ where }),
    prisma.emailLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.emailLog.groupBy({
      by: ['status'],
      _count: { id: true }
    })
  ]);

  const stats = {
    totalEmails: await prisma.emailLog.count(),
    sentCount: countsByStatus.find((c) => c.status === 'SENT')?._count?.id || 0,
    failedCount: countsByStatus.find((c) => c.status === 'FAILED')?._count?.id || 0,
    pendingCount: countsByStatus.find((c) => c.status === 'PENDING')?._count?.id || 0,
    retryingCount: countsByStatus.find((c) => c.status === 'RETRYING')?._count?.id || 0
  };

  return {
    items,
    stats,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getAdminEmailLogById(id) {
  const logRecord = await prisma.emailLog.findUnique({ where: { id } });
  if (!logRecord) {
    const error = new Error('Email log not found');
    error.statusCode = 404;
    error.errorCode = 'NOT_FOUND';
    throw error;
  }
  return logRecord;
}

export async function retryAdminEmail(id, adminUserId, ipAddress) {
  const result = await emailService.retryEmail(id);
  await createAuditLog({
    userId: adminUserId,
    action: 'EMAIL_RETRY',
    entityType: 'EmailLog',
    entityId: id,
    description: `Admin manually retried email delivery for ID ${id}. Result: ${result.success ? 'SENT' : 'FAILED'}`,
    ipAddress
  });
  return result;
}

export async function retryAllAdminFailedEmails(adminUserId, ipAddress) {
  const result = await emailService.retryAllFailedEmails();
  await createAuditLog({
    userId: adminUserId,
    action: 'EMAIL_RETRY_ALL',
    entityType: 'EmailLog',
    description: `Admin triggered bulk retry for ${result.processedCount} failed emails`,
    ipAddress
  });
  return result;
}

export async function getAdminEmailStatus() {
  return await emailService.verifyTransporter();
}

export async function sendAdminTestEmail(recipient, adminUserId, ipAddress) {
  const result = await emailService.sendTestEmail(recipient);
  await createAuditLog({
    userId: adminUserId,
    action: 'EMAIL_TEST',
    entityType: 'EmailLog',
    description: `Admin dispatched test email to ${recipient}. Result: ${result.success ? 'SENT' : 'FAILED'}`,
    ipAddress
  });
  return result;
}
