import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '@/store';

// Створюємо базовий екземпляр axios
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api', // Backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додаємо інтерцептор для автоматичного додавання токена до запитів
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Додаємо інтерцептор для обробки помилок
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Обробляємо 401 помилку (неавторизований)
    if (error.response && error.response.status === 401) {
      // Якщо сервер повертає 401, це означає, що токен не дійсний
      // або закінчився термін його дії
      store.dispatch({ type: 'auth/clearCredentials' });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;