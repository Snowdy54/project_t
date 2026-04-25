// src/api/axios.js
import axios from 'axios';

// Базовый URL нашего Django бекенда
const BASE_URL = 'http://localhost:8000/api/';

// Создаем "инстанс" (экземпляр) axios с базовыми настройками
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем "перехватчик" (interceptor) для всех исходящих запросов.
// Перед каждым запросом к серверу, axios будет проверять, есть ли у нас токен,
// и если есть - автоматически прикреплять его в заголовок Authorization.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов (на случай, если токен протух)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если сервер вернул 401 (Не авторизован) и мы еще не пытались обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('Нет refresh токена');

        // Пытаемся получить новый access_token
        const response = await axios.post(`${BASE_URL}token/refresh/`, {
          refresh: refreshToken
        });

        // Сохраняем новый токен и повторяем оригинальный запрос
        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
        
        return api(originalRequest);
      } catch (err) {
        // Если обновить не удалось (refresh тоже протух), разлогиниваем юзера
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Опционально: можно кинуть событие (event) для принудительного редиректа
        window.dispatchEvent(new Event('auth-expired'));
      }
    }
    return Promise.reject(error);
  }
);