const BASE_URL = 'http://localhost:5000/api';
let memberToken = '';
let adminToken = '';
let memberUserCode = '';
let createdPayoutId = '';

const results = [];

function recordTest(group, name, passed, details = '') {
  results.push({ group, name, status: passed ? 'PASS' : 'FAIL', details });
  console.log(`${passed ? '✅ [PASS]' : '❌ [FAIL]'} [${group}] ${name} ${details ? `- ${details}` : ''}`);
}

async function runTests() {
  console.log('🚀 Running Phase 4 E2E API & Frontend Integration Tests...\n');

  // 1. Health Check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    recordTest('HEALTH', 'GET /api/health', data.success === true, `Status: ${data.data.status}`);
  } catch (err) {
    recordTest('HEALTH', 'GET /api/health', false, err.message);
  }

  // 2. Sponsor Verification (Valid)
  try {
    const res = await fetch(`${BASE_URL}/v1/auth/verify-sponsor/MSM10001`);
    const data = await res.json();
    recordTest('AUTH', 'Verify Sponsor (Valid MSM10001)', data.data.valid === true, `Name: ${data.data.sponsorName}`);
  } catch (err) {
    recordTest('AUTH', 'Verify Sponsor (Valid MSM10001)', false, err.message);
  }

  // 3. Sponsor Verification (Invalid)
  try {
    const res = await fetch(`${BASE_URL}/v1/auth/verify-sponsor/MSM99999`);
    const data = await res.json();
    recordTest('AUTH', 'Verify Sponsor (Invalid MSM99999)', data.data.valid === false, 'Valid: false');
  } catch (err) {
    recordTest('AUTH', 'Verify Sponsor (Invalid MSM99999)', false, err.message);
  }

  // 4. Member Login (MSM10002)
  try {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'MSM10002', password: 'DemoPassword123!' })
    });
    const data = await res.json();
    memberToken = data.data.accessToken;
    memberUserCode = data.data.user.userCode;
    recordTest('AUTH', 'Member Login (MSM10002)', data.success === true, `User: ${memberUserCode}`);
  } catch (err) {
    recordTest('AUTH', 'Member Login (MSM10002)', false, err.message);
  }

  // 5. Admin Login (MSM10001)
  try {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin@mysakthimarketing.in', password: 'AdminSecurePassword123!' })
    });
    const data = await res.json();
    adminToken = data.data.accessToken;
    recordTest('AUTH', 'Admin Login (admin@mysakthimarketing.in)', data.success === true, `Role: ${data.data.user.role}`);
  } catch (err) {
    recordTest('AUTH', 'Admin Login (admin@mysakthimarketing.in)', false, err.message);
  }

  // 6. Register New Member (Atomic Transaction & User Code Generation)
  try {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const uniqueMobile = String(9900000000 + Math.floor(Math.random() * 9999));
    const res = await fetch(`${BASE_URL}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sponsorId: 'MSM10001',
        fullName: 'Automated Test User',
        email: uniqueEmail,
        mobile: uniqueMobile,
        loginPassword: 'DemoPassword123!',
        transactionPassword: 'DemoTxn123!',
        bankDetails: {
          accountName: 'Automated Test User',
          accountNumber: '999900009999',
          ifsc: 'SBIN0001234',
          bankName: 'Test Bank',
          branchName: 'Test Branch'
        }
      })
    });
    const data = await res.json();
    recordTest('AUTH', 'Register New Member', data.success === true, `Generated Code: ${data.data.user.userCode}`);
  } catch (err) {
    recordTest('AUTH', 'Register New Member', false, err.message);
  }

  // 7. Get Current User (/auth/me)
  try {
    const res = await fetch(`${BASE_URL}/v1/auth/me`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    recordTest('AUTH', 'GET /auth/me', data.data.user.userCode === 'MSM10002', `Code: ${data.data.user.userCode}`);
  } catch (err) {
    recordTest('AUTH', 'GET /auth/me', false, err.message);
  }

  // 8. Member Profile
  try {
    const res = await fetch(`${BASE_URL}/v1/member/profile`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    recordTest('MEMBER', 'GET /member/profile', data.data.userCode === 'MSM10002', `Name: ${data.data.fullName}`);
  } catch (err) {
    recordTest('MEMBER', 'GET /member/profile', false, err.message);
  }

  // 9. Member Bank Details (Masked)
  try {
    const res = await fetch(`${BASE_URL}/v1/member/bank-details`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    const masked = data.data.accountNumberMasked;
    recordTest('MEMBER', 'GET /member/bank-details', masked.startsWith('XXXXXX'), `Account Masked: ${masked}`);
  } catch (err) {
    recordTest('MEMBER', 'GET /member/bank-details', false, err.message);
  }

  // 10. Member Dashboard Metrics
  try {
    const res = await fetch(`${BASE_URL}/v1/member/dashboard`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    recordTest('MEMBER', 'GET /member/dashboard', typeof data.data.walletBalance === 'number', `Wallet Balance: ₹${data.data.walletBalance}`);
  } catch (err) {
    recordTest('MEMBER', 'GET /member/dashboard', false, err.message);
  }

  // 11. Member Direct Referrals
  try {
    const res = await fetch(`${BASE_URL}/v1/member/referrals`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    recordTest('MEMBER', 'GET /member/referrals', Array.isArray(data.data), `Direct Count: ${data.data.length}`);
  } catch (err) {
    recordTest('MEMBER', 'GET /member/referrals', false, err.message);
  }

  // 12. Member Network Tree
  try {
    const res = await fetch(`${BASE_URL}/v1/member/network-tree`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    const data = await res.json();
    recordTest('MEMBER', 'GET /member/network-tree', data.data.userCode === 'MSM10002', `Children count: ${data.data.children.length}`);
  } catch (err) {
    recordTest('MEMBER', 'GET /member/network-tree', false, err.message);
  }

  // 13. Public Products Catalogue
  try {
    const res = await fetch(`${BASE_URL}/v1/public/products`);
    const data = await res.json();
    recordTest('PUBLIC', 'GET /public/products', data.data.length > 0, `Found ${data.data.length} active products`);
  } catch (err) {
    recordTest('PUBLIC', 'GET /public/products', false, err.message);
  }

  // 14. Public Banners
  try {
    const res = await fetch(`${BASE_URL}/v1/public/banners`);
    const data = await res.json();
    recordTest('PUBLIC', 'GET /public/banners', data.data.length > 0, `Found ${data.data.length} active hero banners`);
  } catch (err) {
    recordTest('PUBLIC', 'GET /public/banners', false, err.message);
  }

  // 15. Public Testimonials
  try {
    const res = await fetch(`${BASE_URL}/v1/public/testimonials`);
    const data = await res.json();
    recordTest('PUBLIC', 'GET /public/testimonials', data.data.length >= 0, `Testimonials: ${data.data.length}`);
  } catch (err) {
    recordTest('PUBLIC', 'GET /public/testimonials', false, err.message);
  }

  // 16. Public FAQs
  try {
    const res = await fetch(`${BASE_URL}/v1/public/faqs`);
    const data = await res.json();
    recordTest('PUBLIC', 'GET /public/faqs', data.data.length >= 0, `FAQs: ${data.data.length}`);
  } catch (err) {
    recordTest('PUBLIC', 'GET /public/faqs', false, err.message);
  }

  // 17. Public CMS Page (/public/cms/who-we-are)
  try {
    const res = await fetch(`${BASE_URL}/v1/public/cms/who-we-are`);
    const data = await res.json();
    recordTest('PUBLIC', 'GET /public/cms/who-we-are', data.data.slug === 'who-we-are', `Page Title: ${data.data.title}`);
  } catch (err) {
    recordTest('PUBLIC', 'GET /public/cms/who-we-are', false, err.message);
  }

  // 18. Submit Public Contact Enquiry
  try {
    const res = await fetch(`${BASE_URL}/v1/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Integration Test Visitor',
        email: 'integration@example.com',
        phone: '9876543210',
        message: 'Automated test message for contact enquiry inbox.'
      })
    });
    const data = await res.json();
    recordTest('PUBLIC', 'POST /public/enquiries', data.success === true, `Enquiry ID: ${data.data.id}`);
  } catch (err) {
    recordTest('PUBLIC', 'POST /public/enquiries', false, err.message);
  }

  // 19. Admin Stats
  try {
    const res = await fetch(`${BASE_URL}/v1/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    recordTest('ADMIN', 'GET /admin/stats', typeof data.data.totalUsers === 'number', `Total Users: ${data.data.totalUsers}`);
  } catch (err) {
    recordTest('ADMIN', 'GET /admin/stats', false, err.message);
  }

  // 20. Admin Members List
  try {
    const res = await fetch(`${BASE_URL}/v1/admin/members`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    recordTest('ADMIN', 'GET /admin/members', data.data.length > 0, `Total Members Listed: ${data.data.length}`);
  } catch (err) {
    recordTest('ADMIN', 'GET /admin/members', false, err.message);
  }

  // 21. Admin Payout Queue
  try {
    const res = await fetch(`${BASE_URL}/v1/admin/payouts`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    recordTest('ADMIN', 'GET /admin/payouts', Array.isArray(data.data), `Pending Payouts: ${data.data.length}`);
  } catch (err) {
    recordTest('ADMIN', 'GET /admin/payouts', false, err.message);
  }

  // 22. Admin Audit Logs
  try {
    const res = await fetch(`${BASE_URL}/v1/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    recordTest('ADMIN', 'GET /admin/audit-logs', data.data.length > 0, `Audit Logs Count: ${data.data.length}`);
  } catch (err) {
    recordTest('ADMIN', 'GET /admin/audit-logs', false, err.message);
  }

  // 23. SECURITY RBAC TEST: Member Token attempting Admin route -> Should return 403 Forbidden
  try {
    const res = await fetch(`${BASE_URL}/v1/admin/stats`, {
      headers: { Authorization: `Bearer ${memberToken}` }
    });
    recordTest('SECURITY', 'RBAC Guard (Member token -> Admin Route)', res.status === 403, `HTTP Status: ${res.status}`);
  } catch (err) {
    recordTest('SECURITY', 'RBAC Guard (Member token -> Admin Route)', false, err.message);
  }

  // 24. SECURITY TEST: Unauthenticated Request to Member Route -> Should return 401 Unauthorized
  try {
    const res = await fetch(`${BASE_URL}/v1/member/profile`);
    recordTest('SECURITY', 'Unauthenticated Guard (No Token -> Member Profile)', res.status === 401, `HTTP Status: ${res.status}`);
  } catch (err) {
    recordTest('SECURITY', 'Unauthenticated Guard (No Token -> Member Profile)', false, err.message);
  }

  // Summary
  console.log('\n========================================');
  console.log('📊 TEST SUITE SUMMARY RESULT');
  console.log('========================================');
  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.filter((r) => r.status === 'FAIL').length;
  console.log(`PASS: ${passCount} / ${results.length}`);
  console.log(`FAIL: ${failCount} / ${results.length}`);
  console.log('========================================\n');
}

runTests();
