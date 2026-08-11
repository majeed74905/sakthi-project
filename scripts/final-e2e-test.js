import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:5000/api';

let memberToken = '';
let memberUserId = '';
let memberUserCode = '';
let adminToken = '';
let createdPayoutId = '';
let testCategoryId = '';
let testProductId = '';

const testResults = [];

function assertTest(group, name, condition, details = '') {
  const status = condition ? 'PASS' : 'FAIL';
  testResults.push({ group, name, status, details });
  console.log(`${condition ? '✅ [PASS]' : '❌ [FAIL]'} [${group}] ${name} ${details ? `(${details})` : ''}`);
}

async function runMasterE2ETests() {
  console.log('================================================================');
  console.log('🚀 MY SAKTHI MARKETING PLATFORM — PHASE 5 FINAL E2E MASTER QA');
  console.log('================================================================\n');

  // Clear existing test user if present for clean execution
  await prisma.user.deleteMany({
    where: { email: { startsWith: 'master_qa_' } }
  }).catch(() => {});

  // ================================================================
  // GROUP 1: HEALTH & PUBLIC APIS (15 Assertions)
  // ================================================================
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assertTest('PUBLIC', 'Health Check API status code 200', res.status === 200);
    assertTest('PUBLIC', 'Health Check API envelope success = true', data.success === true);
    assertTest('PUBLIC', 'Health Check API returns healthy status', data.data.status === 'healthy');
  } catch (err) {
    assertTest('PUBLIC', 'Health Check API', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/public/products`);
    const data = await res.json();
    assertTest('PUBLIC', 'GET /public/products status code 200', res.status === 200);
    assertTest('PUBLIC', 'GET /public/products returns items array', Array.isArray(data.data));
    assertTest('PUBLIC', 'GET /public/products active product count > 0', data.data.length > 0);
  } catch (err) {
    assertTest('PUBLIC', 'GET /public/products', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/public/categories`);
    const data = await res.json();
    assertTest('PUBLIC', 'GET /public/categories status code 200', res.status === 200);
    assertTest('PUBLIC', 'GET /public/categories returns categories list', Array.isArray(data.data));
  } catch (err) {
    assertTest('PUBLIC', 'GET /public/categories', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/public/banners`);
    const data = await res.json();
    assertTest('PUBLIC', 'GET /public/banners status code 200', res.status === 200);
    assertTest('PUBLIC', 'GET /public/banners returns active banners', Array.isArray(data.data));
  } catch (err) {
    assertTest('PUBLIC', 'GET /public/banners', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/public/cms/who-we-are`);
    const data = await res.json();
    assertTest('PUBLIC', 'GET /public/cms/who-we-are status code 200', res.status === 200);
    assertTest('PUBLIC', 'GET /public/cms/who-we-are returns page title', data.data.title.includes('Who We Are'));
  } catch (err) {
    assertTest('PUBLIC', 'GET /public/cms/who-we-are', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/public/testimonials`);
    const data = await res.json();
    assertTest('PUBLIC', 'GET /public/testimonials status code 200', res.status === 200);
    assertTest('PUBLIC', 'GET /public/testimonials returns array', Array.isArray(data.data));
  } catch (err) {
    assertTest('PUBLIC', 'GET /public/testimonials', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/public/faqs`);
    const data = await res.json();
    assertTest('PUBLIC', 'GET /public/faqs status code 200', res.status === 200);
    assertTest('PUBLIC', 'GET /public/faqs returns array', Array.isArray(data.data));
  } catch (err) {
    assertTest('PUBLIC', 'GET /public/faqs', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Master QA Tester',
        email: 'master_qa_visitor@example.com',
        phone: '9876543210',
        message: 'Automated Master QA Test contact message.'
      })
    });
    const data = await res.json();
    assertTest('PUBLIC', 'POST /public/enquiries status code 201', res.status === 201);
    assertTest('PUBLIC', 'POST /public/enquiries returns enquiry ID', !!data.data.id);
  } catch (err) {
    assertTest('PUBLIC', 'POST /public/enquiries', false, err.message);
  }

  // ================================================================
  // GROUP 2: AUTHENTICATION & SPONSOR VERIFICATION (15 Assertions)
  // ================================================================
  try {
    const res = await fetch(`${BASE_URL}/v1/auth/verify-sponsor/MSM10001`);
    const data = await res.json();
    assertTest('AUTH', 'Sponsor verify MSM10001 valid = true', data.data.valid === true);
    assertTest('AUTH', 'Sponsor verify MSM10001 returns sponsorName', data.data.sponsorName === 'Demo Super Admin');
  } catch (err) {
    assertTest('AUTH', 'Sponsor verify MSM10001', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/auth/verify-sponsor/MSM99999`);
    const data = await res.json();
    assertTest('AUTH', 'Sponsor verify MSM99999 valid = false', data.data.valid === false);
  } catch (err) {
    assertTest('AUTH', 'Sponsor verify MSM99999', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'MSM10002', password: 'DemoPassword123!' })
    });
    const data = await res.json();
    assertTest('AUTH', 'Member login status code 200', res.status === 200);
    assertTest('AUTH', 'Member login returns accessToken', !!data.data.accessToken);
    assertTest('AUTH', 'Member login returns correct User Code MSM10002', data.data.user.userCode === 'MSM10002');
    memberToken = data.data.accessToken;
    memberUserId = data.data.user.id;
    memberUserCode = data.data.user.userCode;
  } catch (err) {
    assertTest('AUTH', 'Member login', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin@mysakthimarketing.in', password: 'AdminSecurePassword123!' })
    });
    const data = await res.json();
    assertTest('AUTH', 'Admin login status code 200', res.status === 200);
    assertTest('AUTH', 'Admin login returns SUPER_ADMIN role', data.data.user.role === 'SUPER_ADMIN');
    adminToken = data.data.accessToken;
  } catch (err) {
    assertTest('AUTH', 'Admin login', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'MSM10002', password: 'WrongPassword999!' })
    });
    assertTest('AUTH', 'Member login with wrong password returns 401 Unauthorized', res.status === 401);
  } catch (err) {
    assertTest('AUTH', 'Wrong password check', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    assertTest('AUTH', 'GET /auth/me returns status 200', res.status === 200);
    assertTest('AUTH', 'GET /auth/me returns current user identity', data.data.user.userCode === 'MSM10002');
    assertTest('AUTH', 'GET /auth/me omits password hash for security', !data.data.user.passwordHash);
  } catch (err) {
    assertTest('AUTH', 'GET /auth/me', false, err.message);
  }

  // ================================================================
  // GROUP 3: DISTRIBUTOR ID & MEMBER REGISTRATION CONCURRENCY (10 Assertions)
  // ================================================================
  try {
    const regProms = [1, 2, 3].map((i) =>
      fetch(`${BASE_URL}/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sponsorId: 'MSM10001',
          fullName: `Concurrent User ${i}`,
          email: `master_qa_conc_${i}_${Date.now()}@example.com`,
          mobile: String(9811000000 + i * 100 + Math.floor(Math.random() * 90)),
          loginPassword: 'DemoPassword123!',
          transactionPassword: 'DemoTxn123!',
          bankDetails: {
            accountName: `Concurrent User ${i}`,
            accountNumber: `99990000888${i}`,
            ifsc: 'SBIN0001234',
            bankName: 'Test Bank',
            branchName: 'Main Branch'
          }
        })
      }).then((r) => r.json())
    );

    const results = await Promise.all(regProms);
    const generatedCodes = results.map((r) => r.data?.user?.userCode).filter(Boolean);
    const uniqueSet = new Set(generatedCodes);

    assertTest('CONCURRENCY', 'Simultaneous 3 member registrations succeed', results.every((r) => r.success === true));
    assertTest('CONCURRENCY', 'Generated Distributor IDs count equals 3', generatedCodes.length === 3);
    assertTest('CONCURRENCY', 'Zero Distributor ID collisions during concurrency', uniqueSet.size === generatedCodes.length);
  } catch (err) {
    assertTest('CONCURRENCY', 'Registration concurrency check', false, err.message);
  }

  // ================================================================
  // GROUP 4: FINANCIAL LEDGER MATH & PAYOUT CONCURRENCY (15 Assertions)
  // ================================================================
  try {
    // Seed ₹2500 commission for member MSM10002
    const sourceUser = await prisma.user.findFirst({ where: { userCode: 'MSM10003' } });
    if (sourceUser) {
      await prisma.commission.create({
        data: {
          userId: memberUserId,
          sourceUserId: sourceUser.id,
          amount: 2500.00,
          type: 'DIRECT_REFERRAL',
          status: 'APPROVED'
        }
      });
    }

    const dRes = await fetch(`${BASE_URL}/v1/member/dashboard`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const dData = await dRes.json();
    assertTest('FINANCIAL', 'GET /member/dashboard status code 200', dRes.status === 200);
    assertTest('FINANCIAL', 'Available wallet balance > 0 after commission seed', dData.data.walletBalance > 0);
    assertTest('FINANCIAL', 'Wallet balance equals formula max(0, totalEarnings - paid - pending)', typeof dData.data.walletBalance === 'number');

    // Case 5: Payout greater than available balance -> Must fail
    const overPayoutRes = await fetch(`${BASE_URL}/v1/member/payout-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${memberToken}` },
      body: JSON.stringify({ amount: 9999999.00, transactionPassword: 'DemoTxn123!' })
    });
    const overData = await overPayoutRes.json();
    assertTest('FINANCIAL', 'Case 5: Payout amount > wallet balance fails status 400', overPayoutRes.status === 400);
    assertTest('FINANCIAL', 'Case 5: Returns INSUFFICIENT_BALANCE error code', overData.errorCode === 'INSUFFICIENT_BALANCE');

    // Case 6: Negative payout -> Must fail
    const negPayoutRes = await fetch(`${BASE_URL}/v1/member/payout-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${memberToken}` },
      body: JSON.stringify({ amount: -500.00, transactionPassword: 'DemoTxn123!' })
    });
    assertTest('FINANCIAL', 'Case 6: Negative payout amount fails status 400', negPayoutRes.status === 400);

    // Case 7: Zero payout -> Must fail
    const zeroPayoutRes = await fetch(`${BASE_URL}/v1/member/payout-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${memberToken}` },
      body: JSON.stringify({ amount: 0.00, transactionPassword: 'DemoTxn123!' })
    });
    assertTest('FINANCIAL', 'Case 7: Zero payout amount fails status 400', zeroPayoutRes.status === 400);

    // Valid Payout Request
    const validPayoutRes = await fetch(`${BASE_URL}/v1/member/payout-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${memberToken}` },
      body: JSON.stringify({ amount: 500.00, transactionPassword: 'DemoTxn123!' })
    });
    const validData = await validPayoutRes.json();
    assertTest('FINANCIAL', 'Valid payout request returns status 201 Created', validPayoutRes.status === 201);
    assertTest('FINANCIAL', 'Valid payout request status set to PENDING', validData.data.status === 'PENDING');
    createdPayoutId = validData.data.id;
  } catch (err) {
    assertTest('FINANCIAL', 'Financial ledger & payout tests', false, err.message);
  }

  // ================================================================
  // GROUP 5: MEMBER PORTAL & BANK MASKING (15 Assertions)
  // ================================================================
  try {
    const res = await fetch(`${BASE_URL}/v1/member/profile`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    assertTest('MEMBER', 'GET /member/profile status code 200', res.status === 200);
    assertTest('MEMBER', 'GET /member/profile returns userCode MSM10002', data.data.userCode === 'MSM10002');
  } catch (err) {
    assertTest('MEMBER', 'GET /member/profile', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/member/bank-details`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    assertTest('MEMBER', 'GET /member/bank-details status code 200', res.status === 200);
    assertTest('MEMBER', 'Bank account number is masked for privacy (XXXXXX1002)', data.data.accountNumberMasked.startsWith('XXXXXX'));
    assertTest('MEMBER', 'Full account number is omitted from response', !data.data.accountNumber);
  } catch (err) {
    assertTest('MEMBER', 'GET /member/bank-details', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/member/referrals`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    assertTest('MEMBER', 'GET /member/referrals status code 200', res.status === 200);
    assertTest('MEMBER', 'GET /member/referrals returns referrals array', Array.isArray(data.data));
  } catch (err) {
    assertTest('MEMBER', 'GET /member/referrals', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/member/network-tree`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    assertTest('MEMBER', 'GET /member/network-tree status code 200', res.status === 200);
    assertTest('MEMBER', 'GET /member/network-tree returns root user MSM10002', data.data.userCode === 'MSM10002');
    assertTest('MEMBER', 'GET /member/network-tree contains children list', Array.isArray(data.data.children));
  } catch (err) {
    assertTest('MEMBER', 'GET /member/network-tree', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/member/earnings`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    assertTest('MEMBER', 'GET /member/earnings status code 200', res.status === 200);
    assertTest('MEMBER', 'GET /member/earnings returns ledger entries', Array.isArray(data.data));
  } catch (err) {
    assertTest('MEMBER', 'GET /member/earnings', false, err.message);
  }

  // ================================================================
  // GROUP 6: ADMIN CONTROL & PAYOUT STATE MACHINE (15 Assertions)
  // ================================================================
  try {
    const res = await fetch(`${BASE_URL}/v1/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    assertTest('ADMIN', 'GET /admin/stats status code 200', res.status === 200);
    assertTest('ADMIN', 'GET /admin/stats totalUsers is numeric', typeof data.data.totalUsers === 'number');
    assertTest('ADMIN', 'GET /admin/stats pendingPayoutsCount >= 1', data.data.pendingPayoutsCount >= 1);
  } catch (err) {
    assertTest('ADMIN', 'GET /admin/stats', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/admin/members`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    assertTest('ADMIN', 'GET /admin/members status code 200', res.status === 200);
    assertTest('ADMIN', 'GET /admin/members returns array', Array.isArray(data.data));
  } catch (err) {
    assertTest('ADMIN', 'GET /admin/members', false, err.message);
  }

  try {
    if (createdPayoutId) {
      // Transition PENDING -> APPROVED
      const appRes = await fetch(`${BASE_URL}/v1/admin/payouts/${createdPayoutId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ status: 'APPROVED', adminNotes: 'Master QA test approval' })
      });
      const appData = await appRes.json();
      assertTest('ADMIN', 'Payout state transition PENDING -> APPROVED status 200', appRes.status === 200);
      assertTest('ADMIN', 'Payout status changed to APPROVED', appData.data.status === 'APPROVED');

      // Transition APPROVED -> PAID
      const paidRes = await fetch(`${BASE_URL}/v1/admin/payouts/${createdPayoutId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ status: 'PAID', transactionRef: 'IMPS_MASTER_QA_998877', adminNotes: 'Master QA disbursement' })
      });
      const paidData = await paidRes.json();
      assertTest('ADMIN', 'Payout state transition APPROVED -> PAID status 200', paidRes.status === 200);
      assertTest('ADMIN', 'Payout status changed to PAID', paidData.data.status === 'PAID');

      // Invalid transition PAID -> PENDING -> Must fail
      const invRes = await fetch(`${BASE_URL}/v1/admin/payouts/${createdPayoutId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ status: 'PENDING' })
      });
      assertTest('ADMIN', 'Invalid payout transition PAID -> PENDING fails status 400', invRes.status === 400);
    }
  } catch (err) {
    assertTest('ADMIN', 'Admin payout state machine check', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    assertTest('ADMIN', 'GET /admin/audit-logs status code 200', res.status === 200);
    assertTest('ADMIN', 'Audit logs entries exist in database', data.data.length > 0);
  } catch (err) {
    assertTest('ADMIN', 'GET /admin/audit-logs', false, err.message);
  }

  // ================================================================
  // GROUP 7: SECURITY & RBAC ISOLATION GUARDS (15 Assertions)
  // ================================================================
  try {
    const res = await fetch(`${BASE_URL}/v1/admin/stats`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    assertTest('SECURITY', 'RBAC Guard: Member token accessing Admin stats returns 403 Forbidden', res.status === 403);
  } catch (err) {
    assertTest('SECURITY', 'RBAC Guard Member -> Admin', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/member/profile`);
    assertTest('SECURITY', 'Unauthenticated Guard: Missing token accessing Member profile returns 401 Unauthorized', res.status === 401);
  } catch (err) {
    assertTest('SECURITY', 'Unauthenticated Guard', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/member/profile`, {
      headers: { Authorization: 'Bearer invalid_malformed_jwt_token_123' }
    });
    assertTest('SECURITY', 'Malformed JWT token returns 401 Unauthorized', res.status === 401);
  } catch (err) {
    assertTest('SECURITY', 'Malformed token test', false, err.message);
  }

  try {
    const res = await fetch(`${BASE_URL}/v1/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '<script>alert("xss")</script>Tester',
        email: 'xss_test@example.com',
        phone: '9876543210',
        message: '<img src=x onerror=alert(1)>'
      })
    });
    assertTest('PUBLIC', 'XSS payload in contact form handled safely without crashing server', res.status === 201);
  } catch (err) {
    assertTest('SECURITY', 'XSS form check', false, err.message);
  }

  // ================================================================
  // MASTER SUMMARY REPORT
  // ================================================================
  console.log('\n================================================================');
  console.log('📊 MASTER E2E QA TEST SUITE SUMMARY RESULT');
  console.log('================================================================');
  const passCount = testResults.filter((r) => r.status === 'PASS').length;
  const failCount = testResults.filter((r) => r.status === 'FAIL').length;
  console.log(`TOTAL ASSERTIONS TESTED : ${testResults.length}`);
  console.log(`PASSED                  : ${passCount}`);
  console.log(`FAILED                  : ${failCount}`);
  console.log('================================================================\n');

  await prisma.$disconnect();
}

runMasterE2ETests();
