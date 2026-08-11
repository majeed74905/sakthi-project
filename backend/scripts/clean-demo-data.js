import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDemoData() {
  console.log('🧹 MY SAKTHI MARKETING — DEMO DATA PURGE SCRIPT');
  console.log('------------------------------------------------');

  const isProduction = process.env.NODE_ENV === 'production';
  const forceProdPurge = process.argv.includes('--force-production-purge');
  const confirmArg = process.argv.includes('--force') || forceProdPurge;

  if (isProduction && !forceProdPurge) {
    console.error('❌ ERROR: Running demo data cleanup in production mode requires explicit --force-production-purge flag.');
    process.exit(1);
  }

  if (!confirmArg) {
    console.log('⚠️ WARNING: This script purges test records matching demo patterns (master_qa_*, testuser_*, demo_*, example.com).');
    console.log('To execute the purge, run: node scripts/clean-demo-data.js --force\n');
    process.exit(0);
  }

  console.log('Executing targeted database cleanup...');

  try {
    const DEMO_EMAIL_CONDITIONS = [
      { email: { contains: 'master_qa_' } },
      { email: { contains: 'testuser_' } },
      { email: { contains: 'demo_' } },
      { email: { contains: 'example.com' } }
    ];

    // 1. Delete Demo Payout Requests
    const deletedPayouts = await prisma.payoutRequest.deleteMany({
      where: {
        OR: [
          { adminNotes: { contains: 'Master QA' } },
          { user: { OR: DEMO_EMAIL_CONDITIONS } }
        ]
      }
    });
    console.log(`- Deleted ${deletedPayouts.count} demo payout requests.`);

    // 2. Delete Demo Commissions
    const deletedCommissions = await prisma.commission.deleteMany({
      where: {
        user: { OR: DEMO_EMAIL_CONDITIONS }
      }
    });
    console.log(`- Deleted ${deletedCommissions.count} demo commission records.`);

    // 3. Delete Demo Referrals
    const deletedReferrals = await prisma.referral.deleteMany({
      where: {
        OR: [
          { sponsorCode: { startsWith: 'TEST' } },
          { referredUserCode: { startsWith: 'TEST' } }
        ]
      }
    });
    console.log(`- Deleted ${deletedReferrals.count} demo referral relationships.`);

    // 4. Delete Demo Contact Enquiries
    const deletedEnquiries = await prisma.contactEnquiry.deleteMany({
      where: {
        OR: [
          { email: { contains: 'master_qa' } },
          { email: { contains: 'test' } },
          { message: { contains: 'Master QA' } }
        ]
      }
    });
    console.log(`- Deleted ${deletedEnquiries.count} test contact enquiries.`);

    // 5. Delete Non-Admin Demo Members (Matches ONLY explicit test/demo email patterns; never arbitrary MSM codes)
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        role: 'MEMBER',
        OR: DEMO_EMAIL_CONDITIONS
      }
    });
    console.log(`- Deleted ${deletedUsers.count} demo member accounts.`);

    console.log('\n✅ Demo data cleanup finished successfully!');
  } catch (err) {
    console.error('❌ Error during demo data cleanup:', err);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDemoData();
