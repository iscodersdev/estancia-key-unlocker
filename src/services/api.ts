
import axios from 'axios';

const API_BASE_URL = 'https://portalestancias.com.ar/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autorización
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Usar el formato correcto para el token UAT
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token agregado a la request:', token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('Token expirado o inválido, limpiando sesión...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('USER');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
