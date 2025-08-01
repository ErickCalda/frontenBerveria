import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://barbershor.onrender.com/api",
});

// ⛑ Añade el token automáticamente antes de cada request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); 
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

  export default axiosInstance;
  //
