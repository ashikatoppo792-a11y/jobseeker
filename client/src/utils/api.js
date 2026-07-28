const API_BASE = '/api';

const getHeaders = (token, isFormData = false) => {
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const savedToken = token || localStorage.getItem('jobseeker_token');
  if (savedToken) {
    headers['Authorization'] = `Bearer ${savedToken}`;
  }
  return headers;
};

export const apiFetch = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers = { ...getHeaders(options.token, isFormData), ...options.headers };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`API call ${endpoint} notice:`, err.message);
    throw err;
  }
};
