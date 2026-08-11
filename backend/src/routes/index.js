import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import memberRoutes from './memberRoutes.js';
import productRoutes from './productRoutes.js';
import cmsRoutes from './cmsRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

// Health Check
router.use('/', healthRoutes);
router.use('/v1', healthRoutes);

// API v1 Modules
router.use('/v1/auth', authRoutes);
router.use('/v1/member', memberRoutes);
router.use('/v1/public', productRoutes);
router.use('/v1/public', cmsRoutes);
router.use('/v1/admin', adminRoutes);

export default router;
