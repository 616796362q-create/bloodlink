const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function fetchDonors(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE_URL}/donors?${query}`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to fetch donors');
  }
  return await res.json();
}

export async function createBloodRequest(data, paymentMethod = 'Direct', transactionRef) {
  return await request('/requests', {
    method: 'POST',
    body: JSON.stringify({ ...data, paymentMethod, transactionRef })
  });
}

export async function updateRequestStatus(id, status) {
  return await request(`/requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function toggleDonorAvailability(id, availability) {
  return await request(`/donors/${id}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ availability })
  });
}

export async function fetchAdminStats() {
  return await request('/admin/stats');
}

export async function toggleUserBlock(userId) {
  return await request(`/admin/users/${userId}/block`, {
    method: 'PATCH'
  });
}

export async function registerUser(data) {
  return await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginUser(data) {
  return await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function editUser(id, data) {
  return await request(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id) {
  return await request(`/admin/users/${id}`, {
    method: 'DELETE',
  });
}
