const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  const stored = localStorage.getItem('cms_user');
  return stored ? JSON.parse(stored).token : null;
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('cms_user');
    window.location.href = '/login';
    return;
  }

  const data = await res.json();
  if (!res.ok) throw { status: res.status, message: data.message || 'Request failed.' };
  return data;
}

function toQuery(params = {}) {
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  ).toString();
  return q ? `?${q}` : '';
}

export const authAPI = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
};

export const usersAPI = {
  getAll: (params)       => request(`/users${toQuery(params)}`),
  getById: (id)          => request(`/users/${id}`),
  create: (data)         => request('/users',     { method: 'POST',   body: JSON.stringify(data) }),
  update: (id, data)     => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id)           => request(`/users/${id}`, { method: 'DELETE' }),
};

export const pagesAPI = {
  getAll: (params)       => request(`/pages${toQuery(params)}`),
  getById: (id)          => request(`/pages/${id}`),
  create: (data)         => request('/pages',     { method: 'POST',   body: JSON.stringify(data) }),
  update: (id, data)     => request(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id)           => request(`/pages/${id}`, { method: 'DELETE' }),
};

export const categoriesAPI = {
  getAll: ()             => request('/categories'),
  create: (data)         => request('/categories',     { method: 'POST',   body: JSON.stringify(data) }),
  update: (id, data)     => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id)           => request(`/categories/${id}`, { method: 'DELETE' }),
};

export const mediaAPI = {
  getAll: () => request('/media'),
  upload: (formData) => {
    const token = getToken();
    return fetch(`${BASE_URL}/media/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(async (res) => {
      if (res.status === 401) { localStorage.removeItem('cms_user'); window.location.href = '/login'; return; }
      const data = await res.json();
      if (!res.ok) throw { status: res.status, message: data.message };
      return data;
    });
  },
  remove: (id) => request(`/media/${id}`, { method: 'DELETE' }),
};
