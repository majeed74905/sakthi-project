import { Router } from 'express';
import {
  getBannersHandler,
  getCmsPageHandler,
  createEnquiryHandler,
  getTestimonialsHandler,
  getFaqsHandler,
  getSettingsHandler
} from '../controllers/cmsController.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many enquiry submissions. Please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED'
  }
});

router.get('/banners', getBannersHandler);
router.get('/cms/:slug', getCmsPageHandler);
router.post('/enquiries', enquiryLimiter, createEnquiryHandler);
router.get('/testimonials', getTestimonialsHandler);
router.get('/faqs', getFaqsHandler);
router.get('/settings', getSettingsHandler);

export default router;
