/**
 * خدمة المصادقة
 * Authentication Service
 */

import api, { apiHelpers } from './api';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  /**
   * تسجيل الدخول
   * Login
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { access_token, refresh_token, user } = response.data;

      // حفظ الرموز والمستخدم بشكل آمن
      // Save tokens and user securely
      await SecureStore.setItemAsync('access_token', access_token);
      await SecureStore.setItemAsync('refresh_token', refresh_token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      return {
        success: true,
        user,
        message: 'تم تسجيل الدخول بنجاح',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'فشل تسجيل الدخول',
      };
    }
  },

  /**
   * تسجيل الخروج
   * Logout
   */
  logout: async () => {
    try {
      // إرسال طلب تسجيل الخروج إلى الخادم (اختياري)
      // Send logout request to server (optional)
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // حذف جميع البيانات المحفوظة
      // Delete all saved data
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('user');
    }
  },

  /**
   * الحصول على المستخدم الحالي
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      const userString = await SecureStore.getItemAsync('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * التحقق من حالة تسجيل الدخول
   * Check if user is logged in
   */
  isLoggedIn: async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  /**
   * تحديث بيانات المستخدم المحفوظة
   * Update saved user data
   */
  updateUserData: async (userData) => {
    try {
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'فشل تحديث بيانات المستخدم',
      };
    }
  },

  /**
   * تغيير كلمة المرور
   * Change password
   */
  changePassword: async (currentPassword, newPassword) => {
    return await apiHelpers.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  /**
   * إعادة تعيين كلمة المرور
   * Reset password
   */
  resetPassword: async (email) => {
    return await apiHelpers.post('/auth/reset-password', { email });
  },

  /**
   * تأكيد إعادة تعيين كلمة المرور
   * Confirm password reset
   */
  confirmResetPassword: async (token, newPassword) => {
    return await apiHelpers.post('/auth/confirm-reset-password', {
      token,
      new_password: newPassword,
    });
  },
};

export default authService;
