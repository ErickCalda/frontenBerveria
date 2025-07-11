export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const saveAccessToken = (token) => localStorage.setItem('accessToken', token);
export const saveRefreshToken = (token) => localStorage.setItem('refreshToken', token);

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
