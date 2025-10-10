/**
 * خدمة المحتوى الرقمي
 * Digital Content Service
 */

import { apiHelpers } from './api';

export const contentService = {
  /**
   * الحصول على قائمة المحتوى
   * Get content list
   */
  getContent: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      per_page: params.perPage || 20,
      content_type: params.contentType,
      platform: params.platform,
      status: params.status,
    };

    return await apiHelpers.get('/content', queryParams);
  },

  /**
   * الحصول على تفاصيل محتوى
   * Get content details
   */
  getContentItem: async (contentId) => {
    return await apiHelpers.get(`/content/${contentId}`);
  },

  /**
   * إنشاء محتوى جديد
   * Create new content
   */
  createContent: async (contentData) => {
    return await apiHelpers.post('/content', contentData);
  },

  /**
   * تحديث محتوى
   * Update content
   */
  updateContent: async (contentId, contentData) => {
    return await apiHelpers.put(`/content/${contentId}`, contentData);
  },

  /**
   * حذف محتوى
   * Delete content
   */
  deleteContent: async (contentId) => {
    return await apiHelpers.delete(`/content/${contentId}`);
  },

  /**
   * نشر محتوى
   * Publish content
   */
  publishContent: async (contentId) => {
    return await apiHelpers.post(`/content/${contentId}/publish`);
  },

  /**
   * جدولة نشر محتوى
   * Schedule content publication
   */
  scheduleContent: async (contentId, scheduledDate) => {
    return await apiHelpers.post(`/content/${contentId}/schedule`, {
      scheduled_date: scheduledDate,
    });
  },

  /**
   * رفع صورة/ملف للمحتوى
   * Upload image/file for content
   */
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiHelpers.upload('/content/upload', formData);
  },

  /**
   * الحصول على إحصائيات المحتوى
   * Get content statistics
   */
  getContentStats: async () => {
    return await apiHelpers.get('/content/stats');
  },
};

export default contentService;

