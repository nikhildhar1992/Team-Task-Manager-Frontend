import axios from 'axios';
import { clearSession, getSession, setAuthNotice } from './session';

export const SESSION_EXPIRED_EVENT = 'auth:session-expired';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://192.168.1.17:3000/api/v1',
  timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearSession();
      setAuthNotice('Your session expired. Please log in again.');
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);
