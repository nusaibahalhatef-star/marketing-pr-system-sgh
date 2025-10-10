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
      const response = await api.post('/auth/patient-login', {
        email,
        password,
      });

      const { access_token, refresh_token, patient } = response.data;

      // حفظ الرموز والمريض بشكل آمن
      // Save tokens and patient securely
      await SecureStore.setItemAsync('access_token', access_token);
      await SecureStore.setItemAsync('refresh_token', refresh_token);
      await SecureStore.setItemAsync('patient', JSON.stringify(patient));

      return {
        success: true,
        patient,
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
   * التسجيل كمريض جديد
   * Register as new patient
   */
  register: async (patientData) => {
    try {
      const response = await api.post('/auth/patient-register', patientData);

      const { access_token, refresh_token, patient } = response.data;

      await SecureStore.setItemAsync('access_token', access_token);
      await SecureStore.setItemAsync('refresh_token', refresh_token);
      await SecureStore.setItemAsync('patient', JSON.stringify(patient));

      return {
        success: true,
        patient,
        message: 'تم التسجيل بنجاح',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'فشل التسجيل',
      };
    }
  },

  /**
   * تسجيل الخروج
   * Logout
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('patient');
    }
  },

  /**
   * الحصول على بيانات المريض الحالي
   * Get current patient
   */
  getCurrentPatient: async () => {
    try {
      const patientString = await SecureStore.getItemAsync('patient');
      return patientString ? JSON.parse(patientString) : null;
    } catch (error) {
      console.error('Error getting current patient:', error);
      return null;
    }
  },

  /**
   * التحقق من حالة تسجيل الدخول
   * Check if patient is logged in
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
   * تحديث بيانات المريض المحفوظة
   * Update saved patient data
   */
  updatePatientData: async (patientData) => {
    try {
      await SecureStore.setItemAsync('patient', JSON.stringify(patientData));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'فشل تحديث بيانات المريض',
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

  /**
   * تحديث الملف الشخصي
   * Update profile
   */
  updateProfile: async (profileData) => {
    return await apiHelpers.put('/auth/profile', profileData);
  },
};

export default authService;

