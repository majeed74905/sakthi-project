import apiClient from './apiClient';

export async function getProducts(params = {}) {
  const response = await apiClient.get('/public/products', { params });
  return response.data;
}

export async function getProductById(idOrSlug) {
  const response = await apiClient.get(`/public/products/${idOrSlug}`);
  return response.data;
}

export async function getCategories() {
  const response = await apiClient.get('/public/categories');
  return response.data;
}

export async function getBanners() {
  const response = await apiClient.get('/public/banners');
  return response.data;
}

export async function getCmsPage(slug) {
  const response = await apiClient.get(`/public/cms/${slug}`);
  return response.data;
}

export async function getTestimonials() {
  const response = await apiClient.get('/public/testimonials');
  return response.data;
}

export async function getFaqs() {
  const response = await apiClient.get('/public/faqs');
  return response.data;
}

export async function submitEnquiry(payload) {
  const response = await apiClient.post('/public/enquiries', payload);
  return response.data;
}
