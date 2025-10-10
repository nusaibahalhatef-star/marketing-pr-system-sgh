/**
 * خدمة التحليلات والتقارير
 * Analytics and Reporting Service
 */

import { apiHelpers } from './api';

export const analyticsService = {
  /**
   * الحصول على لوحة التحكم الرئيسية
   * Get main dashboard data
   */
  getDashboard: async () => {
    return await apiHelpers.get('/analytics/dashboard');
  },

  /**
   * الحصول على إحصائيات المهام
   * Get tasks analytics
   */
  getTasksAnalytics: async (params = {}) => {
    return await apiHelpers.get('/analytics/tasks', params);
  },

  /**
   * الحصول على إحصائيات الحملات
   * Get campaigns analytics
   */
  getCampaignsAnalytics: async (params = {}) => {
    return await apiHelpers.get('/analytics/campaigns', params);
  },

  /**
   * الحصول على إحصائيات المرضى
   * Get patients analytics
   */
  getPatientsAnalytics: async (params = {}) => {
    return await apiHelpers.get('/analytics/patients', params);
  },

  /**
   * الحصول على إحصائيات المحتوى
   * Get content analytics
   */
  getContentAnalytics: async (params = {}) => {
    return await apiHelpers.get('/analytics/content', params);
  },

  /**
   * الحصول على تقرير الأداء
   * Get performance report
   */
  getPerformanceReport: async (startDate, endDate) => {
    return await apiHelpers.get('/analytics/performance', {
      start_date: startDate,
      end_date: endDate,
    });
  },

  /**
   * الحصول على تقرير مخصص
   * Get custom report
   */
  getCustomReport: async (reportType, params = {}) => {
    return await apiHelpers.get(`/analytics/reports/${reportType}`, params);
  },

  /**
   * تصدير تقرير
   * Export report
   */
  exportReport: async (reportType, format = 'pdf', params = {}) => {
    return await apiHelpers.get(`/analytics/export/${reportType}`, {
      format,
      ...params,
    });
  },
};

export default analyticsService;

