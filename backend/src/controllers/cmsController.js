import { apiSuccess } from '../utils/response.js';
import * as cmsService from '../services/cmsService.js';
import { enquirySchema } from '../validators/publicValidator.js';

export async function getBannersHandler(req, res, next) {
  try {
    const banners = await cmsService.getPublicBanners();
    return apiSuccess(res, 'Hero slider banners retrieved', banners);
  } catch (err) {
    next(err);
  }
}

export async function getCmsPageHandler(req, res, next) {
  try {
    const { slug } = req.params;
    const page = await cmsService.getPublicCmsPage(slug);
    return apiSuccess(res, 'CMS page content retrieved', page);
  } catch (err) {
    next(err);
  }
}

export async function createEnquiryHandler(req, res, next) {
  try {
    const validated = enquirySchema.parse(req.body);
    const enquiry = await cmsService.createEnquiry(validated);
    return apiSuccess(res, 'Thank you for contacting My Sakthi Marketing! Your enquiry has been received.', enquiry, 201);
  } catch (err) {
    next(err);
  }
}

export async function getTestimonialsHandler(req, res, next) {
  try {
    const testimonials = await cmsService.getPublicTestimonials();
    return apiSuccess(res, 'Public testimonials retrieved', testimonials);
  } catch (err) {
    next(err);
  }
}

export async function getFaqsHandler(req, res, next) {
  try {
    const faqs = await cmsService.getPublicFaqs();
    return apiSuccess(res, 'Public FAQs retrieved', faqs);
  } catch (err) {
    next(err);
  }
}

export async function getSettingsHandler(req, res, next) {
  try {
    const settings = await cmsService.getPublicSettings();
    return apiSuccess(res, 'Public site settings retrieved', settings);
  } catch (err) {
    next(err);
  }
}
