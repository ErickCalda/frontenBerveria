import axiosInstance from './axiosInstance';
import { getAccessToken, getRefreshToken, saveAccessToken, clearTokens } from '../utils/tokenStorage';
import { refreshToken } from '../services/authService';

axiosInstance.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  res => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { accessToken } = await refreshToken(getRefreshToken());
        saveAccessToken(accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(original);
      } catch (e) {
        clearTokens();
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);
