import apiClient from './apiClient';

export async function getStats() {
  const response = await apiClient.get('/admin/stats');
  return response.data;
}

export async function getMembers(params = {}) {
  const response = await apiClient.get('/admin/members', { params });
  return response.data;
}

export async function updateUserStatus(id, status) {
  const response = await apiClient.put(`/admin/members/${id}/status`, { status });
  return response.data;
}

export async function getPayouts(params = {}) {
  const response = await apiClient.get('/admin/payouts', { params });
  return response.data;
}

export async function processPayout(id, payload) {
  const response = await apiClient.put(`/admin/payouts/${id}`, payload);
  return response.data;
}

export async function getProducts(params = {}) {
  const response = await apiClient.get('/public/products', { params });
  return response.data;
}

export async function createProduct(payload) {
  const response = await apiClient.post('/admin/products', payload);
  return response.data;
}

export async function updateProduct(id, payload) {
  const response = await apiClient.put(`/admin/products/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await apiClient.delete(`/admin/products/${id}`);
  return response.data;
}

export async function getCategories() {
  const response = await apiClient.get('/admin/categories');
  return response.data;
}

export async function createCategory(payload) {
  const response = await apiClient.post('/admin/categories', payload);
  return response.data;
}

export async function updateCategory(id, payload) {
  const response = await apiClient.put(`/admin/categories/${id}`, payload);
  return response.data;
}

export async function deleteCategory(id) {
  const response = await apiClient.delete(`/admin/categories/${id}`);
  return response.data;
}

export async function getBanners() {
  const response = await apiClient.get('/admin/banners');
  return response.data;
}

export async function createBanner(payload) {
  const response = await apiClient.post('/admin/banners', payload);
  return response.data;
}

export async function updateBanner(id, payload) {
  const response = await apiClient.put(`/admin/banners/${id}`, payload);
  return response.data;
}

export async function deleteBanner(id) {
  const response = await apiClient.delete(`/admin/banners/${id}`);
  return response.data;
}

export async function getCmsPages() {
  const response = await apiClient.get('/admin/cms');
  return response.data;
}

export async function upsertCmsPage(payload) {
  const response = await apiClient.post('/admin/cms', payload);
  return response.data;
}

export async function deleteCmsPage(id) {
  const response = await apiClient.delete(`/admin/cms/${id}`);
  return response.data;
}

export async function getTestimonials() {
  const response = await apiClient.get('/admin/testimonials');
  return response.data;
}

export async function createTestimonial(payload) {
  const response = await apiClient.post('/admin/testimonials', payload);
  return response.data;
}

export async function updateTestimonial(id, payload) {
  const response = await apiClient.put(`/admin/testimonials/${id}`, payload);
  return response.data;
}

export async function deleteTestimonial(id) {
  const response = await apiClient.delete(`/admin/testimonials/${id}`);
  return response.data;
}

export async function getFaqs() {
  const response = await apiClient.get('/admin/faqs');
  return response.data;
}

export async function createFaq(payload) {
  const response = await apiClient.post('/admin/faqs', payload);
  return response.data;
}

export async function updateFaq(id, payload) {
  const response = await apiClient.put(`/admin/faqs/${id}`, payload);
  return response.data;
}

export async function deleteFaq(id) {
  const response = await apiClient.delete(`/admin/faqs/${id}`);
  return response.data;
}

export async function getEnquiries(params = {}) {
  const response = await apiClient.get('/admin/enquiries', { params });
  return response.data;
}

export async function updateEnquiryStatus(id, payload) {
  const response = await apiClient.put(`/admin/enquiries/${id}/status`, payload);
  return response.data;
}

export async function getReferrals(params = {}) {
  const response = await apiClient.get('/admin/referrals', { params });
  return response.data;
}

export async function getRewardRules() {
  const response = await apiClient.get('/admin/reward-rules');
  return response.data;
}

export async function upsertRewardRule(payload) {
  const response = await apiClient.post('/admin/reward-rules', payload);
  return response.data;
}

export async function broadcastNotification(payload) {
  const response = await apiClient.post('/admin/notifications/broadcast', payload);
  return response.data;
}

export async function getAuditLogs(params = {}) {
  const response = await apiClient.get('/admin/audit-logs', { params });
  return response.data;
}

export async function getSettings() {
  const response = await apiClient.get('/admin/settings');
  return response.data;
}

export async function updateSettings(payload) {
  const response = await apiClient.put('/admin/settings', payload);
  return response.data;
}

// Email Management Services
export async function getEmailLogs(params = {}) {
  const response = await apiClient.get('/admin/email-logs', { params });
  return response.data;
}

export async function getEmailLogById(id) {
  const response = await apiClient.get(`/admin/email-logs/${id}`);
  return response.data;
}

export async function retryEmail(id) {
  const response = await apiClient.post(`/admin/email-logs/${id}/retry`, {});
  return response.data;
}

export async function retryFailedEmails() {
  const response = await apiClient.post('/admin/email-logs/retry-failed', {});
  return response.data;
}

export async function getEmailStatus() {
  const response = await apiClient.get('/admin/email/status');
  return response.data;
}

export async function sendTestEmail(recipient) {
  const response = await apiClient.post('/admin/email/test', { recipient });
  return response.data;
}
