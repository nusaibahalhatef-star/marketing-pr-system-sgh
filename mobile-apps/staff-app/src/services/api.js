/**
 * إعدادات API الأساسية
 * Base API Configuration
 */

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// عنوان الواجهة الخلفية
// Backend API URL
// ملاحظة: قم بتغيير هذا العنوان إلى عنوان الخادم الفعلي في بيئة الإنتاج
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api'  // Development
  : 'https://api.sgh-marketing.com/api';  // Production

// إنشاء نسخة Axios مخصصة
// Create custom Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor لإضافة JWT token إلى جميع الطلبات
// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    
    // Log request in development mode
    if (__DEV__) {
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor لمعالجة الاستجابات والأخطاء
// Response interceptor to handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log response in development mode
    if (__DEV__) {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error in development mode
    if (__DEV__) {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message,
        url: originalRequest?.url,
      });
    }
    
    // معالجة خطأ 401 (Unauthorized)
    // Handle 401 Unauthorized error
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // محاولة تحديث الرمز
        // Try to refresh token
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          await SecureStore.setItemAsync('access_token', access_token);
          
          // إعادة محاولة الطلب الأصلي
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // فشل تحديث الرمز - تسجيل الخروج
        // Refresh token failed - logout
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        await SecureStore.deleteItemAsync('user');
        
        // يمكن إضافة منطق إعادة التوجيه إلى شاشة تسجيل الدخول هنا
        // Navigation logic to login screen can be added here
      }
    }
    
    // معالجة أخطاء الشبكة
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.',
        type: 'network_error',
      });
    }
    
    // معالجة أخطاء الخادم
    // Handle server errors
    if (error.response.status >= 500) {
      return Promise.reject({
        message: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
        type: 'server_error',
        status: error.response.status,
      });
    }
    
    return Promise.reject(error);
  }
);

/**
 * دوال مساعدة للطلبات
 * Helper functions for requests
 */

export const apiHelpers = {
  /**
   * طلب GET
   * GET request
   */
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'حدث خطأ',
      };
    }
  },

  /**
   * طلب POST
   * POST request
   */
  post: async (url, data = {}) => {
    try {
      const response = await api.post(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'حدث خطأ',
      };
    }
  },

  /**
   * طلب PUT
   * PUT request
   */
  put: async (url, data = {}) => {
    try {
      const response = await api.put(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'حدث خطأ',
      };
    }
  },

  /**
   * طلب DELETE
   * DELETE request
   */
  delete: async (url) => {
    try {
      const response = await api.delete(url);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'حدث خطأ',
      };
    }
  },

  /**
   * رفع ملف
   * Upload file
   */
  upload: async (url, formData) => {
    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'فشل رفع الملف',
      };
    }
  },
};

export default api;
