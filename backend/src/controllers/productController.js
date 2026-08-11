import { apiSuccess } from '../utils/response.js';
import * as productService from '../services/productService.js';

export async function getProductsHandler(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const category = req.query.category || '';
    const search = req.query.search || '';
    const featured = req.query.featured === 'true';

    const result = await productService.getPublicProducts({ page, limit, category, search, featured });
    return apiSuccess(res, 'Products catalogue retrieved', result.items, 200, result.pagination);
  } catch (err) {
    next(err);
  }
}

export async function getProductByIdHandler(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productService.getPublicProductById(id);
    return apiSuccess(res, 'Product details retrieved', product);
  } catch (err) {
    next(err);
  }
}

export async function getCategoriesHandler(req, res, next) {
  try {
    const categories = await productService.getPublicCategories();
    return apiSuccess(res, 'Product categories retrieved', categories);
  } catch (err) {
    next(err);
  }
}
