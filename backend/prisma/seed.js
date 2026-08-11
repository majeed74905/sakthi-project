import { PrismaClient, Role, UserStatus, PayoutStatus, EnquiryStatus, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting development database seeding...');

  // Hash standard demo passwords
  const defaultPasswordHash = await bcrypt.hash('DemoPassword123!', 10);
  const defaultTxnPasswordHash = await bcrypt.hash('DemoTxn123!', 10);
  
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePassword123!';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  // 1. Clean existing demo data safely
  console.log('🧹 Cleaning existing records...');
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.passwordResetToken.deleteMany({});
  await prisma.payoutRequest.deleteMany({});
  await prisma.commission.deleteMany({});
  await prisma.referral.deleteMany({});
  await prisma.userBankDetails.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.faq.deleteMany({});
  await prisma.contactEnquiry.deleteMany({});
  await prisma.rewardRule.deleteMany({});
  await prisma.cmsPage.deleteMany({});
  await prisma.siteSetting.deleteMany({});

  // 2. Create Super Admin (Demo / Development Admin)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mysakthimarketing.in';
  console.log(`👤 Creating Development Admin (${adminEmail})...`);
  const adminUser = await prisma.user.create({
    data: {
      userCode: 'MSM10001',
      fullName: 'Demo Super Admin',
      email: adminEmail,
      phone: '+919900000001',
      passwordHash: adminPasswordHash,
      transactionPasswordHash: defaultTxnPasswordHash,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      bankDetails: {
        create: {
          accountName: 'Demo Super Admin',
          accountNumber: '999900001001',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India',
          branchName: 'Chennai Main Branch',
          isVerified: true
        }
      }
    }
  });

  // 3. Create Demo Members (Hierarchy: Admin -> M1, M2 -> M3, M4 -> M5)
  console.log('👥 Creating Demo Members...');
  const member1 = await prisma.user.create({
    data: {
      userCode: 'MSM10002',
      fullName: 'Demo Member 01',
      email: 'member01@example.com',
      phone: '+919900000002',
      passwordHash: defaultPasswordHash,
      transactionPasswordHash: defaultTxnPasswordHash,
      role: Role.MEMBER,
      status: UserStatus.ACTIVE,
      sponsorId: adminUser.id,
      bankDetails: {
        create: {
          accountName: 'Demo Member 01',
          accountNumber: '999900001002',
          ifscCode: 'HDFC0005678',
          bankName: 'HDFC Bank',
          branchName: 'Kolathur Branch',
          isVerified: true
        }
      }
    }
  });

  const member2 = await prisma.user.create({
    data: {
      userCode: 'MSM10003',
      fullName: 'Demo Member 02',
      email: 'member02@example.com',
      phone: '+919900000003',
      passwordHash: defaultPasswordHash,
      transactionPasswordHash: defaultTxnPasswordHash,
      role: Role.MEMBER,
      status: UserStatus.ACTIVE,
      sponsorId: adminUser.id,
      bankDetails: {
        create: {
          accountName: 'Demo Member 02',
          accountNumber: '999900001003',
          ifscCode: 'ICIC0009012',
          bankName: 'ICICI Bank',
          branchName: 'Anna Nagar Branch',
          isVerified: true
        }
      }
    }
  });

  const member3 = await prisma.user.create({
    data: {
      userCode: 'MSM10004',
      fullName: 'Demo Member 03',
      email: 'member03@example.com',
      phone: '+919900000004',
      passwordHash: defaultPasswordHash,
      transactionPasswordHash: defaultTxnPasswordHash,
      role: Role.MEMBER,
      status: UserStatus.ACTIVE,
      sponsorId: member1.id,
      bankDetails: {
        create: {
          accountName: 'Demo Member 03',
          accountNumber: '999900001004',
          ifscCode: 'UTIB0003456',
          bankName: 'Axis Bank',
          branchName: 'Perambur Branch',
          isVerified: false
        }
      }
    }
  });

  const member4 = await prisma.user.create({
    data: {
      userCode: 'MSM10005',
      fullName: 'Demo Member 04',
      email: 'member04@example.com',
      phone: '+919900000005',
      passwordHash: defaultPasswordHash,
      transactionPasswordHash: defaultTxnPasswordHash,
      role: Role.MEMBER,
      status: UserStatus.ACTIVE,
      sponsorId: member1.id,
      bankDetails: {
        create: {
          accountName: 'Demo Member 04',
          accountNumber: '999900001005',
          ifscCode: 'IOBA0007890',
          bankName: 'Indian Overseas Bank',
          branchName: 'Villivakkam Branch',
          isVerified: false
        }
      }
    }
  });

  const member5 = await prisma.user.create({
    data: {
      userCode: 'MSM10006',
      fullName: 'Demo Member 05',
      email: 'member05@example.com',
      phone: '+919900000006',
      passwordHash: defaultPasswordHash,
      transactionPasswordHash: defaultTxnPasswordHash,
      role: Role.MEMBER,
      status: UserStatus.PENDING,
      sponsorId: member2.id,
      bankDetails: {
        create: {
          accountName: 'Demo Member 05',
          accountNumber: '999900001006',
          ifscCode: 'CNRB0001122',
          bankName: 'Canara Bank',
          branchName: 'Redhills Branch',
          isVerified: false
        }
      }
    }
  });

  // 4. Create Product Categories
  console.log('📦 Creating Product Categories & Products...');
  const catKitchen = await prisma.category.create({
    data: {
      name: 'Kitchen Appliances',
      slug: 'kitchen-appliances',
      description: 'High-performance durable kitchen appliances and cookware.',
      displayOrder: 1
    }
  });

  const catEntertainment = await prisma.category.create({
    data: {
      name: 'Home Entertainment',
      slug: 'home-entertainment',
      description: 'Smart LED TVs and home audio systems.',
      displayOrder: 2
    }
  });

  const catUtilities = await prisma.category.create({
    data: {
      name: 'Home Utilities',
      slug: 'home-utilities',
      description: 'Water purifiers, fans, and lifestyle home accessories.',
      displayOrder: 3
    }
  });

  // 5. Create Demo Products
  await prisma.product.create({
    data: {
      categoryId: catKitchen.id,
      name: 'Sakthi Multi-Grind Mixer 750W',
      slug: 'sakthi-multi-grind-mixer-750w',
      shortDescription: 'Heavy duty 750-watt copper motor mixer grinder with 4 stainless steel jars.',
      description: 'The Sakthi Multi-Grind 750W features stainless steel leak-proof jars, high-grade motor overload protector, and ergonomic shockproof ABS body designed for traditional Indian cooking.',
      price: 4999.00,
      stock: 50,
      isFeatured: true,
      displayOrder: 1,
      images: {
        create: [
          { imageUrl: '/images/products/mixer.jpg', isPrimary: true, displayOrder: 1 }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catEntertainment.id,
      name: 'Sakthi Vision 43-Inch Ultra HD Smart LED TV',
      slug: 'sakthi-vision-43-inch-uhd-smart-tv',
      shortDescription: '4K Ultra HD Smart LED TV with Dolby Audio and dual-band Wi-Fi.',
      description: 'Experience immersive visuals with Sakthi Vision 43-inch 4K Smart TV. Powered by Android OS, Google Assistant, 20W speakers, and bezel-less display design.',
      price: 24999.00,
      stock: 25,
      isFeatured: true,
      displayOrder: 2,
      images: {
        create: [
          { imageUrl: '/images/products/tv.jpg', isPrimary: true, displayOrder: 1 }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catKitchen.id,
      name: 'Sakthi Chef Wet Grinder 2L',
      slug: 'sakthi-chef-wet-grinder-2l',
      shortDescription: '2-Litre tabletop wet grinder with sturdy granite stones.',
      description: 'Designed for fast and uniform batter grinding with low noise motor, stainless steel drum, and easy-clean stones.',
      price: 5499.00,
      stock: 30,
      isFeatured: false,
      displayOrder: 3,
      images: {
        create: [
          { imageUrl: '/images/products/wet-grinder.jpg', isPrimary: true, displayOrder: 1 }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catUtilities.id,
      name: 'Sakthi Aqua Pure RO+UV Water Purifier',
      slug: 'sakthi-aqua-pure-water-purifier',
      shortDescription: 'Advanced 7-stage RO+UV+UF water purification system with mineralizer.',
      description: 'Ensures 100% pure drinking water with 8-litre storage capacity, smart LED indicator, and automated auto-flush technology.',
      price: 11999.00,
      stock: 40,
      isFeatured: true,
      displayOrder: 4,
      images: {
        create: [
          { imageUrl: '/images/products/water-purifier.jpg', isPrimary: true, displayOrder: 1 }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      categoryId: catKitchen.id,
      name: 'Sakthi Anodized 5L Pressure Cooker',
      slug: 'sakthi-anodized-5l-pressure-cooker',
      shortDescription: 'Hard anodized induction bottom safety pressure cooker.',
      description: 'Corrosion-resistant hard anodized body, precision weight valve, and gasket release safety system.',
      price: 2299.00,
      stock: 100,
      isFeatured: false,
      displayOrder: 5,
      images: {
        create: [
          { imageUrl: '/images/products/cooker.jpg', isPrimary: true, displayOrder: 1 }
        ]
      }
    }
  });

  // 6. Create Demo Referrals
  console.log('🔗 Creating Demo Referral Records...');
  const referralsData = [
    { sponsorCode: 'MSM10001', referredUserCode: 'MSM10002', eligibilityStatus: 'QUALIFIED' },
    { sponsorCode: 'MSM10001', referredUserCode: 'MSM10003', eligibilityStatus: 'QUALIFIED' },
    { sponsorCode: 'MSM10002', referredUserCode: 'MSM10004', eligibilityStatus: 'QUALIFIED' },
    { sponsorCode: 'MSM10002', referredUserCode: 'MSM10005', eligibilityStatus: 'QUALIFIED' },
    { sponsorCode: 'MSM10003', referredUserCode: 'MSM10006', eligibilityStatus: 'PENDING' },
    { sponsorCode: 'MSM10001', referredUserCode: 'MSM10007', eligibilityStatus: 'QUALIFIED' },
    { sponsorCode: 'MSM10002', referredUserCode: 'MSM10008', eligibilityStatus: 'PENDING' },
    { sponsorCode: 'MSM10004', referredUserCode: 'MSM10009', eligibilityStatus: 'QUALIFIED' },
    { sponsorCode: 'MSM10004', referredUserCode: 'MSM10010', eligibilityStatus: 'PENDING' },
    { sponsorCode: 'MSM10003', referredUserCode: 'MSM10011', eligibilityStatus: 'QUALIFIED' }
  ];
  for (const ref of referralsData) {
    await prisma.referral.create({ data: ref });
  }

  // 7. Create Demo Reward Rules
  console.log('🏆 Creating Configurable Reward Rules...');
  const rewardRulesData = [
    { code: 'RULE_DIR_100', name: 'Direct Associate Referral Bonus', description: 'Base bonus allocated for direct associate onboarding.', bonusAmount: 500.00, levelRequirement: 1 },
    { code: 'RULE_LVL2_50', name: 'Tier-2 Team Incentive', description: 'Secondary tier incentive for downline associate growth.', bonusAmount: 250.00, levelRequirement: 2 },
    { code: 'RULE_PKG_PRO', name: 'Household Electronics Associate Milestone', description: 'Milestone reward for associate product purchases.', bonusAmount: 1000.00, levelRequirement: 1 },
    { code: 'RULE_LEADER_LVL3', name: 'Regional Team Leadership Bonus', description: 'Leadership level performance reward.', bonusAmount: 2000.00, levelRequirement: 3 },
    { code: 'RULE_SPECIAL_FEST', name: 'Festival Season Associate Incentive', description: 'Seasonal promotional bonus allocation.', bonusAmount: 1500.00, levelRequirement: 1 }
  ];
  for (const rule of rewardRulesData) {
    await prisma.rewardRule.create({ data: rule });
  }

  // 8. Create Demo Banners
  console.log('🖼️ Creating Hero Banners...');
  await prisma.banner.createMany({
    data: [
      {
        title: 'Empowering Lives Through Quality Products',
        subtitle: 'Discover top household appliances with My Sakthi Marketing',
        imageUrl: '/assets/images/banners/banner-1.jpg',
        linkUrl: '/products',
        displayOrder: 1
      },
      {
        title: 'Lead Your Future on Your Own Terms',
        subtitle: 'Transparent Associate & Member Marketing Platform',
        imageUrl: '/assets/images/banners/banner-2.jpg',
        linkUrl: '/about',
        displayOrder: 2
      }
    ]
  });

  // 9. Create Demo Testimonials
  console.log('💬 Creating Demo Testimonials...');
  const testimonialsData = [
    { name: 'R. Soundararajan', designation: 'Business Associate, Chennai', content: 'My Sakthi Marketing provided me with top quality products and a transparent growth system.', rating: 5, displayOrder: 1 },
    { name: 'K. Meenakshi', designation: 'Member, Madurai', content: 'Very reliable household products and excellent support team in Kolathur.', rating: 5, displayOrder: 2 },
    { name: 'S. Venkatesh', designation: 'Associate, Coimbatore', content: 'Professional platform with great clarity on member workflows and banking updates.', rating: 5, displayOrder: 3 },
    { name: 'P. Anitha', designation: 'Member, Trichy', content: 'Great kitchen appliances and easy to navigate member dashboard.', rating: 4, displayOrder: 4 },
    { name: 'M. Karthik', designation: 'Business Associate, Salem', content: 'Empowering direct associate model with strong team leadership.', rating: 5, displayOrder: 5 }
  ];
  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }

  // 10. Create Demo FAQs
  console.log('❓ Creating Demo FAQs...');
  const faqsData = [
    { question: 'What is My Sakthi Marketing?', answer: 'My Sakthi Marketing is a marketing platform offering household appliances and empowering members with autonomous business opportunity.', category: 'General', displayOrder: 1 },
    { question: 'How do I register as a member?', answer: 'You can register online by providing a valid Sponsor ID, your contact details, and bank account details for member payouts.', category: 'Registration', displayOrder: 2 },
    { question: 'What is a Transaction Password?', answer: 'A Transaction Password is a secondary security password created during registration to authorize financial transactions and payout requests.', category: 'Security', displayOrder: 3 },
    { question: 'Where is the corporate office located?', answer: 'Our head office is located at No.2, Venus Nagar 5th Street, Kolathur, Chennai - 600099.', category: 'Contact', displayOrder: 4 },
    { question: 'How are payout requests reviewed?', answer: 'Members submit payout requests from their dashboard. Admin verifies bank account details and logs IMPS/NEFT reference codes upon approval.', category: 'Payouts', displayOrder: 5 }
  ];
  for (const f of faqsData) {
    await prisma.faq.create({ data: f });
  }

  // 11. Create Demo Notifications
  console.log('🔔 Creating Demo Notifications...');
  await prisma.notification.createMany({
    data: [
      { userId: adminUser.id, title: 'System Initialized', message: 'Development database seeded successfully.', type: NotificationType.SYSTEM },
      { userId: member1.id, title: 'Welcome to My Sakthi Marketing', message: 'Your member account MSM10002 is active.', type: NotificationType.SUCCESS },
      { userId: member1.id, title: 'New Direct Referral', message: 'Member Demo Member 03 (MSM10004) registered under your Sponsor ID.', type: NotificationType.INFO },
      { userId: member2.id, title: 'Account Activated', message: 'Your Associate profile MSM10003 is active.', type: NotificationType.SUCCESS },
      { userId: member3.id, title: 'Bank Verification Pending', message: 'Please ensure your IFSC code and account details are accurate.', type: NotificationType.WARNING }
    ]
  });

  // 12. Create Demo Contact Enquiry
  console.log('✉️ Creating Demo Contact Enquiry...');
  await prisma.contactEnquiry.create({
    data: {
      name: 'Demo Visitor',
      email: 'visitor@example.com',
      phone: '+919876543210',
      message: 'I would like to inquire about product bulk availability and associate membership in Chennai.',
      status: EnquiryStatus.NEW
    }
  });

  // 13. Create CMS Pages
  console.log('📄 Creating Initial CMS Pages...');
  await prisma.cmsPage.createMany({
    data: [
      {
        slug: 'who-we-are',
        title: 'Who We Are — About My Sakthi Marketing',
        content: `<h3>My Sakthi Marketing</h3><p>We believe in empowering members with the opportunity to lead their lives on their own terms. With the motto of spreading wealth, My Sakthi Marketing has continued to enrich the lives of everyone who is a part of the company and those who believe in its products.</p><p>We lend full autonomy for Our Business Associates to stand and think on their own and aid them to tower the peaks.</p>`
      },
      {
        slug: 'terms',
        title: 'Terms & Conditions',
        content: `<h3>Terms & Conditions</h3><p>Welcome to My Sakthi Marketing. By registering as a member or associate, you agree to comply with our code of ethics, accurate sponsor registration rules, and system usage guidelines.</p>`
      },
      {
        slug: 'privacy',
        title: 'Privacy Policy',
        content: `<h3>Privacy Policy</h3><p>My Sakthi Marketing values your privacy. Personal contact details and financial bank information are stored securely and never shared with unauthorized third parties.</p>`
      }
    ]
  });

  // 14. Create Site Settings
  console.log('⚙️ Creating Site Settings...');
  await prisma.siteSetting.createMany({
    data: [
      { key: 'company_name', value: 'My Sakthi Marketing', description: 'Official corporate title' },
      { key: 'company_email', value: 'info@mysakthimarketing.in', description: 'Official support email' },
      { key: 'company_phone', value: '+91 78456 01441', description: 'Official support phone' },
      { key: 'company_address', value: 'No.2, Venus Nagar 5th Street, Kolathur, Chennai - 600099', description: 'Head office location' }
    ]
  });

  console.log('✅ Development seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
