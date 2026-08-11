import { Router } from 'express';
import { getProductsHandler, getProductByIdHandler, getCategoriesHandler } from '../controllers/productController.js';

const router = Router();

router.get('/products', getProductsHandler);
router.get('/products/:id', getProductByIdHandler);
router.get('/categories', getCategoriesHandler);

export default router;
