import apiClient from './apiClient';

export async function getProfile() {
  const response = await apiClient.get('/member/profile');
  return response.data;
}

export async function updateProfile(payload) {
  const response = await apiClient.put('/member/profile', payload);
  return response.data;
}

export async function getBankDetails() {
  const response = await apiClient.get('/member/bank-details');
  return response.data;
}

export async function updateBankDetails(payload) {
  const response = await apiClient.put('/member/bank-details', payload);
  return response.data;
}

export async function getDashboard() {
  const response = await apiClient.get('/member/dashboard');
  return response.data;
}

export async function getReferrals(params = {}) {
  const response = await apiClient.get('/member/referrals', { params });
  return response.data;
}

export async function getNetworkTree() {
  const response = await apiClient.get('/member/network-tree');
  return response.data;
}

export async function getEarnings(params = {}) {
  const response = await apiClient.get('/member/earnings', { params });
  return response.data;
}

export async function getPayouts(params = {}) {
  const response = await apiClient.get('/member/payouts', { params });
  return response.data;
}

export async function submitPayoutRequest(payload) {
  const response = await apiClient.post('/member/payout-request', payload);
  return response.data;
}

export async function getNotifications() {
  const response = await apiClient.get('/member/notifications');
  return response.data;
}

export async function markNotificationRead(id) {
  const response = await apiClient.put(`/member/notifications/${id}/read`);
  return response.data;
}

export async function changePassword(payload) {
  const response = await apiClient.put('/member/change-password', payload);
  return response.data;
}
