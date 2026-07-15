const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function toQuery(params = {}) {
  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
  ).toString();
  return q ? `?${q}` : '';
}

export const publicAPI = {
  getPages: (params) =>
    fetch(`${BASE}/public/pages${toQuery(params)}`).then((r) => r.json()),

  getPage: (slug) =>
    fetch(`${BASE}/public/pages/${slug}`).then((r) => {
      if (!r.ok) throw new Error('Page not found');
      return r.json();
    }),

  getCategories: () =>
    fetch(`${BASE}/public/categories`).then((r) => r.json()).catch(() => []),
};
