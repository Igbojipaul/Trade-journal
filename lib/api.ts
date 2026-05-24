import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If access token expired, try refreshing automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh token');

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh/`,
          { refresh }
        );

        const newAccess = res.data.access;
        localStorage.setItem('access_token', newAccess);

        // Retry the original request with new token
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);

      } catch (refreshError) {
        // Refresh failed — clear everything and send to login - it can be caused by expired refresh token too 🤔
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        console.error('Token refresh failed:', refreshError);
        globalThis.location.href = '/login';
      }
    }

    throw error;
  }
);

export default api;