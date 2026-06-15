const API_BASE = '/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const authApi = {
  signUp: (body) =>
    request('/auth/signUp', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
};

export const taskApi = {
  getAll: () => request('/protacted/tasks'),

  create: (body) =>
    request('/protacted/task', { method: 'POST', body: JSON.stringify(body) }),

  update: (id, body) =>
    request(`/protacted/task/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: (id) =>
    request(`/protacted/task/${id}`, { method: 'DELETE' }),
};
