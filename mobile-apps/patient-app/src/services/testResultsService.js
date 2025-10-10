/**
 * خدمة نتائج الفحوصات
 * Test Results Service
 */

import { apiHelpers } from './api';

export const testResultsService = {
  /**
   * الحصول على قائمة نتائج الفحوصات
   * Get test results list
   */
  getTestResults: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      per_page: params.perPage || 20,
      test_type: params.testType,
      date_from: params.dateFrom,
      date_to: params.dateTo,
      status: params.status,
    };

    return await apiHelpers.get('/test-results', queryParams);
  },

  /**
   * الحصول على تفاصيل نتيجة فحص
   * Get test result details
   */
  getTestResult: async (resultId) => {
    return await apiHelpers.get(`/test-results/${resultId}`);
  },

  /**
   * الحصول على أنواع الفحوصات المتاحة
   * Get available test types
   */
  getTestTypes: async () => {
    return await apiHelpers.get('/test-results/types');
  },

  /**
   * الحصول على الفحوصات المعلقة
   * Get pending test results
   */
  getPendingResults: async () => {
    return await apiHelpers.get('/test-results/pending');
  },

  /**
   * الحصول على آخر الفحوصات
   * Get recent test results
   */
  getRecentResults: async (limit = 10) => {
    return await apiHelpers.get('/test-results/recent', { limit });
  },

  /**
   * تنزيل نتيجة فحص
   * Download test result
   */
  downloadTestResult: async (resultId) => {
    return await apiHelpers.get(`/test-results/${resultId}/download`);
  },

  /**
   * مشاركة نتيجة فحص
   * Share test result
   */
  shareTestResult: async (resultId, email) => {
    return await apiHelpers.post(`/test-results/${resultId}/share`, { email });
  },

  /**
   * الحصول على إحصائيات الفحوصات
   * Get test results statistics
   */
  getTestResultsStats: async () => {
    return await apiHelpers.get('/test-results/stats');
  },
};

export default testResultsService;

