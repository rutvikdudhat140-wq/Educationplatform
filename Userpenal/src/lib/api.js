export const getApiBaseUrl = () => {
  // Use environment variable if available (for production like Netlify)
  if (import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Fallback for local development
  return 'http://localhost:5001/api';
};

export const API = getApiBaseUrl();

export const getHeaders = () => {
  const token = localStorage.getItem('userToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createApiUrl = (endpoint) => `${getApiBaseUrl()}${endpoint}`;