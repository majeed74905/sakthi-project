import prisma from '../config/db.js';
import { sanitizeLogData } from './maskData.js';

export async function createAuditLog({ userId, action, entityType, entityId, description, ipAddress }) {
  try {
    const cleanDescription = typeof description === 'object' 
      ? JSON.stringify(sanitizeLogData(description))
      : String(description || '');

    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entityType,
        entityId: entityId ? String(entityId) : null,
        description: cleanDescription,
        ipAddress: ipAddress || null
      }
    });
  } catch (err) {
    console.error('Failed to create audit log:', err.message);
  }
}
