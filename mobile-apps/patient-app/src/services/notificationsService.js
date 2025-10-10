/**
 * خدمة الإشعارات
 * Notifications Service
 */

import { apiHelpers } from './api';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// إعدادات الإشعارات
// Notifications configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationsService = {
  /**
   * تسجيل جهاز للحصول على الإشعارات
   * Register device for push notifications
   */
  registerForPushNotifications: async () => {
    try {
      if (!Device.isDevice) {
        console.log('يجب استخدام جهاز حقيقي للإشعارات الفورية');
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('فشل الحصول على إذن الإشعارات');
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })).data;

      // إرسال الرمز إلى الخادم
      // Send token to server
      await apiHelpers.post('/notifications/register-device', {
        push_token: token,
        device_type: Device.osName,
      });

      return token;
    } catch (error) {
      console.error('خطأ في تسجيل الإشعارات:', error);
      return null;
    }
  },

  /**
   * الحصول على قائمة الإشعارات
   * Get notifications list
   */
  getNotifications: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      per_page: params.perPage || 20,
      is_read: params.isRead,
      notification_type: params.notificationType,
    };

    return await apiHelpers.get('/notifications', queryParams);
  },

  /**
   * تعليم إشعار كمقروء
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    return await apiHelpers.post(`/notifications/${notificationId}/read`);
  },

  /**
   * تعليم جميع الإشعارات كمقروءة
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    return await apiHelpers.post('/notifications/read-all');
  },

  /**
   * حذف إشعار
   * Delete notification
   */
  deleteNotification: async (notificationId) => {
    return await apiHelpers.delete(`/notifications/${notificationId}`);
  },

  /**
   * الحصول على عدد الإشعارات غير المقروءة
   * Get unread notifications count
   */
  getUnreadCount: async () => {
    return await apiHelpers.get('/notifications/unread-count');
  },

  /**
   * الحصول على إعدادات الإشعارات
   * Get notification settings
   */
  getNotificationSettings: async () => {
    return await apiHelpers.get('/notifications/settings');
  },

  /**
   * تحديث إعدادات الإشعارات
   * Update notification settings
   */
  updateNotificationSettings: async (settings) => {
    return await apiHelpers.put('/notifications/settings', settings);
  },

  /**
   * إرسال إشعار محلي
   * Send local notification
   */
  sendLocalNotification: async (title, body, data = {}) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Send immediately
    });
  },
};

export default notificationsService;

