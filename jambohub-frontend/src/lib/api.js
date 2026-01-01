// src/lib/api.js
// API client for JamboHub backend

const API_BASE = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('jambohub-token');
}

function setToken(token) {
  localStorage.setItem('jambohub-token', token);
}

function clearToken() {
  localStorage.removeItem('jambohub-token');
  localStorage.removeItem('jambohub-user');
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  
  return data;
}

// ==========================================
// AUTH
// ==========================================

export async function login(email, password) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  setToken(data.token);
  localStorage.setItem('jambohub-user', JSON.stringify(data.user));
  
  return data.user;
}

export function logout() {
  clearToken();
}

export async function getCurrentUser() {
  try {
    return await apiRequest('/api/auth/me');
  } catch {
    return null;
  }
}

export async function changePassword(currentPassword, newPassword) {
  return apiRequest('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ 
      current_password: currentPassword, 
      new_password: newPassword 
    })
  });
}

export function getStoredUser() {
  const stored = localStorage.getItem('jambohub-user');
  return stored ? JSON.parse(stored) : null;
}

export function isAuthenticated() {
  return !!getToken();
}

// ==========================================
// CHANNELS
// ==========================================

export async function getChannels() {
  return apiRequest('/api/channels');
}

export async function updateChannel(channelId, data) {
  return apiRequest(`/api/admin/channels/${channelId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// ==========================================
// MESSAGES
// ==========================================

export async function getMessages(channelId) {
  return apiRequest(`/api/channels/${channelId}/messages`);
}

export async function postMessage(channelId, content, imageUrl = null) {
  return apiRequest(`/api/channels/${channelId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content, imageUrl })
  });
}

export async function uploadImage(formData) {
  const token = localStorage.getItem('jambohub-token');
  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Upload failed');
  }
  
  return response.json();
}

export async function togglePinMessage(messageId) {
  return apiRequest(`/api/messages/${messageId}/pin`, {
    method: 'POST'
  });
}

// ==========================================
// ADMIN - USERS
// ==========================================

export async function getAllUsers() {
  return apiRequest('/api/admin/users');
}

export async function createUser(userData) {
  return apiRequest('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

export async function updateUser(userId, userData) {
  return apiRequest(`/api/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
}

export async function deleteUser(userId) {
  return apiRequest(`/api/admin/users/${userId}`, {
    method: 'DELETE'
  });
}

export async function resetUserPassword(userId) {
  return apiRequest(`/api/admin/users/${userId}/reset-password`, {
    method: 'POST'
  });
}

// ==========================================
// ADMIN - UNITS
// ==========================================

export async function getUnits() {
  return apiRequest('/api/admin/units');
}

export async function createUnit(unitData) {
  return apiRequest('/api/admin/units', {
    method: 'POST',
    body: JSON.stringify(unitData)
  });
}

export async function updateUnit(unitId, unitData) {
  return apiRequest(`/api/admin/units/${unitId}`, {
    method: 'PUT',
    body: JSON.stringify(unitData)
  });
}

export async function deleteUnit(unitId) {
  return apiRequest(`/api/admin/units/${unitId}`, {
    method: 'DELETE'
  });
}

// ==========================================
// SETTINGS
// ==========================================

export async function updateNotificationSettings(emailNotifications) {
  return apiRequest('/api/settings/notifications', {
    method: 'PUT',
    body: JSON.stringify({ email_notifications: emailNotifications })
  });
}

// ==========================================
// STATS
// ==========================================

export async function getStats() {
  return apiRequest('/api/stats');
}

// ==========================================
// INFO CARDS
// ==========================================

export async function getInfoCards() {
  return apiRequest('/api/info-cards');
}

export async function getAllInfoCards() {
  return apiRequest('/api/admin/info-cards');
}

export async function createInfoCard(data) {
  return apiRequest('/api/admin/info-cards', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateInfoCard(cardId, data) {
  return apiRequest(`/api/admin/info-cards/${cardId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteInfoCard(cardId) {
  return apiRequest(`/api/admin/info-cards/${cardId}`, {
    method: 'DELETE'
  });
}

// ==========================================
// PUSH NOTIFICATIONS
// ==========================================

export async function getVapidPublicKey() {
  return apiRequest('/api/push/vapid-public-key');
}

export async function subscribeToPush(subscription) {
  return apiRequest('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription)
  });
}

export async function unsubscribeFromPush(endpoint) {
  return apiRequest('/api/push/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ endpoint })
  });
}

// Helper to convert VAPID key from base64 to Uint8Array
export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
