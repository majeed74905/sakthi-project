import apiClient from './apiClient';

export async function verifySponsor(userCode) {
  const response = await apiClient.get(`/auth/verify-sponsor/${userCode}`);
  return response.data;
}

export async function registerUser(payload) {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
}

export async function loginUser(credentials) {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
}

export async function refreshToken() {
  const response = await apiClient.post('/auth/refresh', {});
  return response.data;
}

export async function logoutUser() {
  const response = await apiClient.post('/auth/logout', {});
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get('/auth/me');
  return response.data;
}

export async function forgotPassword(email) {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
}

export async function resetPassword(payload) {
  const response = await apiClient.post('/auth/reset-password', payload);
  return response.data;
}
