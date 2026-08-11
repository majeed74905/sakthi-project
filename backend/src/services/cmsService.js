import prisma from '../config/db.js';

export async function getPublicBanners() {
  return await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' }
  });
}

export async function getPublicCmsPage(slug) {
  const page = await prisma.cmsPage.findUnique({
    where: { slug: slug.toLowerCase() }
  });

  if (!page) {
    const error = new Error(`CMS page with slug '${slug}' not found`);
    error.statusCode = 404;
    error.errorCode = 'PAGE_NOT_FOUND';
    throw error;
  }

  return page;
}

export async function createEnquiry(data) {
  return await prisma.contactEnquiry.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone ? data.phone.trim() : null,
      message: data.message.trim(),
      status: 'NEW'
    }
  });
}

export async function getPublicTestimonials() {
  return await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' }
  });
}

export async function getPublicFaqs() {
  return await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' }
  });
}

export async function getPublicSettings() {
  const settings = await prisma.siteSetting.findMany();
  const map = {};
  settings.forEach((s) => {
    map[s.key] = s.value;
  });
  return map;
}
