import prisma from '../config/db.js';

/**
 * Generates next sequential Distributor / User Code (e.g. MSM10007) safely.
 * Queries highest numeric MSM code to guarantee non-colliding increment.
 */
export async function generateUserCode(tx = prisma) {
  const users = await tx.user.findMany({
    where: {
      userCode: {
        startsWith: 'MSM'
      }
    },
    select: {
      userCode: true
    }
  });

  if (!users || users.length === 0) {
    return 'MSM10001';
  }

  let maxNumber = 10000;
  for (const u of users) {
    const num = parseInt(u.userCode.replace('MSM', ''), 10);
    if (!isNaN(num) && num > maxNumber) {
      maxNumber = num;
    }
  }

  const nextNumber = maxNumber + 1;
  return `MSM${nextNumber.toString().padStart(5, '0')}`;
}
