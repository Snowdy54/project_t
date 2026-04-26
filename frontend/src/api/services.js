// src/api/services.js
import { api } from './axios';

export const authService = {
  // Вход
  login: async (username, password) => {
    const response = await api.post('token/', { username, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  },
  
  // Регистрация
  register: async (userData) => {
    return await api.post('register/', userData);
  },

  // Выход
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Получить профиль текущего пользователя
  getProfile: async () => {
      const response = await api.get('profile/');
      return response.data;
  },

    // Добавьте это:
  updateProfile: async (profileData) => {
      const isFormData = profileData instanceof FormData;
    
      const response = await api.patch('profile/', profileData, {
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
        }
      });
      return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.post('change-password/', passwordData);
    return response.data;
  }
};


export const pointService = {
  // Получить все точки
  getAll: async () => {
    const response = await api.get('points/');
    return response.data;
  },

  // Создать новую точку
  create: async (pointData) => {
    const response = await api.post('points/', pointData);
    return response.data;
  }
};