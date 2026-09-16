const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function fetchDonors(filters = {}) {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/donors?${query}`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.error('[BloodLink API] Unable to load donors', err);
    throw err;
  }
}

export async function createBloodRequest(data, paymentMethod = 'Direct', transactionRef) {
  try {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, paymentMethod, transactionRef })
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.error('[BloodLink API] Unable to create request', err);
    throw err;
  }
}

export async function updateRequestStatus(id, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.error('[BloodLink API] Unable to update request', err);
    throw err;
  }
}

export async function toggleDonorAvailability(id, availability) {
  try {
    const res = await fetch(`${API_BASE_URL}/donors/${id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availability })
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.error('[BloodLink API] Unable to update availability', err);
    throw err;
  }
}

export async function fetchAdminStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.error('[BloodLink API] Unable to load admin data', err);
    throw err;
  }
}

export async function toggleUserBlock(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/block`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.error('[BloodLink API] Unable to update user status', err);
    throw err;
  }
}

export async function registerUser(data) {
  return request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function loginUser(data) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function editUser(id, data) {
  return request(`/admin/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id) {
  return request(`/admin/users/${id}`, {
    method: 'DELETE',
  });
}
