import axios from '../api/axiosInstance'
import { saveAccessToken, saveRefreshToken, clearTokens } from '../utils/tokenStorage';

export async function loginGoogle(idToken) {
  const res = await axios.post('/auth/login/google', { idToken });
  // Asegúrate que backend devuelva accessToken y refreshToken, si no, ajusta aquí
  if(res.data.accessToken) saveAccessToken(res.data.accessToken);
  if(res.data.refreshToken) saveRefreshToken(res.data.refreshToken);

  // me devulve el usuario logueado  y el rol junto con lo demas datos menos el la clave 

  return res.data;
}

export async function refreshToken(refreshToken) {
  const res = await axios.post('/auth/refresh', { refreshToken });
  if(res.data.accessToken) saveAccessToken(res.data.accessToken);
  return res.data;
}

export async function logout() {
  await axios.post('/auth/logout');
  clearTokens();
}


export async function verify() {
  try {
    const res = await axios.get("/auth/verify");
   
    return res.data;
  } catch (error) {
   
    throw error;
  }
}

