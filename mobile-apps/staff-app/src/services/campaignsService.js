/**
 * خدمة الحملات التسويقية
 * Campaigns Service
 */

import { apiHelpers } from './api';

export const campaignsService = {
  /**
   * الحصول على قائمة الحملات
   * Get campaigns list
   */
  getCampaigns: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      per_page: params.perPage || 20,
      status: params.status,
      campaign_type: params.campaignType,
    };

    return await apiHelpers.get('/campaigns', queryParams);
  },

  /**
   * الحصول على تفاصيل حملة
   * Get campaign details
   */
  getCampaign: async (campaignId) => {
    return await apiHelpers.get(`/campaigns/${campaignId}`);
  },

  /**
   * إنشاء حملة جديدة
   * Create new campaign
   */
  createCampaign: async (campaignData) => {
    return await apiHelpers.post('/campaigns', campaignData);
  },

  /**
   * تحديث حملة
   * Update campaign
   */
  updateCampaign: async (campaignId, campaignData) => {
    return await apiHelpers.put(`/campaigns/${campaignId}`, campaignData);
  },

  /**
   * حذف حملة
   * Delete campaign
   */
  deleteCampaign: async (campaignId) => {
    return await apiHelpers.delete(`/campaigns/${campaignId}`);
  },

  /**
   * الحصول على إحصائيات الحملات
   * Get campaigns statistics
   */
  getCampaignsStats: async () => {
    return await apiHelpers.get('/campaigns/stats');
  },

  /**
   * الحصول على أداء حملة محددة
   * Get campaign performance
   */
  getCampaignPerformance: async (campaignId) => {
    return await apiHelpers.get(`/campaigns/${campaignId}/performance`);
  },
};

export default campaignsService;

