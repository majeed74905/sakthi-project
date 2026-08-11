import nodemailer from 'nodemailer';
import prisma from '../config/db.js';

// Controlled Email Types Constants
export const EMAIL_TYPES = {
  WELCOME: 'WELCOME',
  PASSWORD_RESET: 'PASSWORD_RESET',
  PAYOUT_APPROVED: 'PAYOUT_APPROVED',
  PAYOUT_REJECTED: 'PAYOUT_REJECTED',
  PAYOUT_PROCESSING: 'PAYOUT_PROCESSING',
  PAYOUT_PAID: 'PAYOUT_PAID',
  SYSTEM_NOTIFICATION: 'SYSTEM_NOTIFICATION',
  TEST: 'TEST'
};

// Create Nodemailer Transporter from Environment Variables
function getTransporter() {
  const host = process.env.SMTP_HOST || 'localhost';
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const config = {
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
  };

  return nodemailer.createTransport(config);
}

/**
 * Diagnostic method to check SMTP connection health.
 * Never exposes credentials.
 */
export async function verifyTransporter() {
  const host = process.env.SMTP_HOST || 'localhost';
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const configured = !!(process.env.SMTP_HOST || process.env.SMTP_USER);

  try {
    const transporter = getTransporter();
    await transporter.verify();
    return {
      configured,
      provider: 'SMTP',
      host,
      port,
      connection: 'healthy'
    };
  } catch (err) {
    return {
      configured,
      provider: 'SMTP',
      host,
      port,
      connection: 'unavailable',
      error: sanitizeError(err).message
    };
  }
}

/**
 * Sanitizes Nodemailer / system error objects for logging.
 * Strips out any sensitive passwords or tokens.
 */
function sanitizeError(err) {
  if (!err) return { code: 'UNKNOWN_ERROR', message: 'Unknown error occurred' };
  const message = err.message || String(err);
  const code = err.code || err.name || 'SMTP_ERROR';

  // Sanitize out credentials or tokens if present in error strings
  const cleanMessage = message.replace(/(password|pass|secret|token)=[\w\d_-]+/gi, '$1=***MASKED***');

  return { code, message: cleanMessage };
}

/**
 * Core Email Dispatcher with DB Delivery Logging.
 * Creates an EmailLog entry before delivery attempt.
 */
export async function sendEmail({ recipient, subject, emailType, html, text }) {
  const fromName = process.env.MAIL_FROM_NAME || 'My Sakthi Marketing';
  const fromAddress = process.env.MAIL_FROM_ADDRESS || 'no-reply@mysakthimarketing.in';
  const from = `"${fromName}" <${fromAddress}>`;

  // 1. Create DB Delivery Tracking Record (PENDING/SENDING)
  let logRecord;
  try {
    logRecord = await prisma.emailLog.create({
      data: {
        recipient,
        subject,
        emailType: emailType || EMAIL_TYPES.SYSTEM_NOTIFICATION,
        status: 'SENDING',
        attemptCount: 1,
        lastAttemptAt: new Date()
      }
    });
  } catch (dbErr) {
    console.error('Failed to create EmailLog database record:', dbErr);
  }

  // 2. Attempt SMTP Delivery via Nodemailer
  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from,
      to: recipient,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''),
      html
    });

    // 3. Mark as SENT on success
    if (logRecord) {
      await prisma.emailLog.update({
        where: { id: logRecord.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          messageId: info.messageId || 'SENT_OK'
        }
      });
    }

    return { success: true, emailLogId: logRecord?.id, messageId: info.messageId };
  } catch (err) {
    const { code, message } = sanitizeError(err);

    // 4. Mark as FAILED on error (Does NOT throw to primary caller)
    if (logRecord) {
      await prisma.emailLog.update({
        where: { id: logRecord.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          errorCode: code,
          errorMessage: message
        }
      });
    }

    return { success: false, emailLogId: logRecord?.id, error: message };
  }
}

/**
 * Specialized Email: Member Registration Welcome
 */
export async function sendWelcomeEmail({ email, fullName, userCode }) {
  const subject = `Welcome to My Sakthi Marketing! Your User ID: ${userCode}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
      <h2 style="color: #dc2626;">Welcome to My Sakthi Marketing!</h2>
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>Your associate member account has been created successfully.</p>
      <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;"><strong>Distributor User Code:</strong> <span style="font-family: monospace; font-size: 16px; color: #dc2626;">${userCode}</span></p>
        <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Portal URL:</strong> https://mysakthimarketing.in/login</p>
      </div>
      <p>You can now log into your member portal to access your referral link, downline network tree, and earnings dashboard.</p>
      <p>Best regards,<br/>My Sakthi Marketing Team</p>
    </div>
  `;

  return sendEmail({
    recipient: email,
    subject,
    emailType: EMAIL_TYPES.WELCOME,
    html
  });
}

/**
 * Specialized Email: Password Reset Instructions
 */
export async function sendPasswordResetEmail({ email, token }) {
  const subject = 'Password Reset Request — My Sakthi Marketing';
  const resetUrl = `https://mysakthimarketing.in/reset-password?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #dc2626;">Password Reset Request</h2>
      <p>We received a request to reset your password for your My Sakthi Marketing account.</p>
      <p>Click the link below to set a new password. This link is valid for 1 hour:</p>
      <p><a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #dc2626; color: #fff; text-decoration: none; border-radius: 8px;">Reset Password</a></p>
      <p>If you did not request a password reset, please ignore this email.</p>
    </div>
  `;

  return sendEmail({
    recipient: email,
    subject,
    emailType: EMAIL_TYPES.PASSWORD_RESET,
    html
  });
}

/**
 * Specialized Email: Payout Status Updates
 */
export async function sendPayoutStatusEmail({ email, amount, status, transactionRef, rejectionReason }) {
  let subject = `Payout Request Update: ${status}`;
  let type = EMAIL_TYPES.PAYOUT_PROCESSING;

  if (status === 'APPROVED') {
    subject = 'Your My Sakthi Marketing payout has been approved';
    type = EMAIL_TYPES.PAYOUT_APPROVED;
  } else if (status === 'PAID') {
    subject = 'Payment Completed — My Sakthi Marketing Payout';
    type = EMAIL_TYPES.PAYOUT_PAID;
  } else if (status === 'REJECTED') {
    subject = 'Payout Request Update — Action Required';
    type = EMAIL_TYPES.PAYOUT_REJECTED;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #dc2626;">Payout Request Update</h2>
      <p>Your withdrawal request for <strong>₹${amount}</strong> is currently: <strong>${status}</strong>.</p>
      ${transactionRef ? `<p><strong>Bank Transaction Ref:</strong> <span style="font-family: monospace;">${transactionRef}</span></p>` : ''}
      ${rejectionReason ? `<p style="color: #b91c1c;"><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
      <p>Best regards,<br/>My Sakthi Marketing Finance Team</p>
    </div>
  `;

  return sendEmail({
    recipient: email,
    subject,
    emailType: type,
    html
  });
}

/**
 * Retry a Failed Email Delivery (Admin Action)
 */
export async function retryEmail(emailLogId) {
  const logRecord = await prisma.emailLog.findUnique({
    where: { id: emailLogId }
  });

  if (!logRecord) {
    throw new Error('Email delivery record not found');
  }

  if (logRecord.status !== 'FAILED' && logRecord.status !== 'RETRYING') {
    throw new Error(`Only FAILED email logs can be retried. Current status is ${logRecord.status}`);
  }

  // Update status to RETRYING and increment attempt counter
  await prisma.emailLog.update({
    where: { id: emailLogId },
    data: {
      status: 'RETRYING',
      attemptCount: { increment: 1 },
      lastAttemptAt: new Date()
    }
  });

  const fromName = process.env.MAIL_FROM_NAME || 'My Sakthi Marketing';
  const fromAddress = process.env.MAIL_FROM_ADDRESS || 'no-reply@mysakthimarketing.in';

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: logRecord.recipient,
      subject: logRecord.subject,
      text: `Retry attempt for ${logRecord.subject}`,
      html: `<p>${logRecord.subject}</p>`
    });

    const updated = await prisma.emailLog.update({
      where: { id: emailLogId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        messageId: info.messageId || 'RETRY_SENT_OK'
      }
    });

    return { success: true, emailLog: updated };
  } catch (err) {
    const { code, message } = sanitizeError(err);
    const updated = await prisma.emailLog.update({
      where: { id: emailLogId },
      data: {
        status: 'FAILED',
        failedAt: new Date(),
        errorCode: code,
        errorMessage: message
      }
    });

    return { success: false, emailLog: updated, error: message };
  }
}

/**
 * Retry All Failed Email Logs (Admin Action)
 */
export async function retryAllFailedEmails() {
  const failedLogs = await prisma.emailLog.findMany({
    where: { status: 'FAILED' },
    take: 50
  });

  const results = [];
  for (const log of failedLogs) {
    const res = await retryEmail(log.id);
    results.push(res);
  }

  return { processedCount: failedLogs.length, results };
}

/**
 * Send Test Email (Admin Action)
 */
export async function sendTestEmail(recipient) {
  const subject = 'Test Email — My Sakthi Marketing SMTP Verification';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h3 style="color: #16a34a;">SMTP Configuration Test Successful!</h3>
      <p>This email verifies that Nodemailer and your SMTP server settings are working cleanly.</p>
      <p>Timestamp: ${new Date().toISOString()}</p>
    </div>
  `;

  return sendEmail({
    recipient,
    subject,
    emailType: EMAIL_TYPES.TEST,
    html
  });
}
