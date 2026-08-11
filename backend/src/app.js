import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { setupSecurityMiddleware } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Setup Helmet, CORS, Rate Limiter
setupSecurityMiddleware(app);

// Serve static uploads folder
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.resolve(__dirname, '..', uploadDir)));

// Mount API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export default app;
