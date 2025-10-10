/**
 * خدمة إدارة المرضى (CRM)
 * Patients Management Service (CRM)
 */

import { apiHelpers } from './api';

export const patientsService = {
  /**
   * الحصول على قائمة المرضى
   * Get patients list
   */
  getPatients: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      per_page: params.perPage || 20,
      search: params.search,
      status: params.status,
    };

    return await apiHelpers.get('/patients', queryParams);
  },

  /**
   * الحصول على تفاصيل مريض
   * Get patient details
   */
  getPatient: async (patientId) => {
    return await apiHelpers.get(`/patients/${patientId}`);
  },

  /**
   * إنشاء ملف مريض جديد
   * Create new patient profile
   */
  createPatient: async (patientData) => {
    return await apiHelpers.post('/patients', patientData);
  },

  /**
   * تحديث بيانات مريض
   * Update patient data
   */
  updatePatient: async (patientId, patientData) => {
    return await apiHelpers.put(`/patients/${patientId}`, patientData);
  },

  /**
   * حذف ملف مريض
   * Delete patient profile
   */
  deletePatient: async (patientId) => {
    return await apiHelpers.delete(`/patients/${patientId}`);
  },

  /**
   * الحصول على تفاعلات مريض
   * Get patient interactions
   */
  getPatientInteractions: async (patientId, params = {}) => {
    return await apiHelpers.get(`/patients/${patientId}/interactions`, params);
  },

  /**
   * إضافة تفاعل جديد مع مريض
   * Add new patient interaction
   */
  addPatientInteraction: async (patientId, interactionData) => {
    return await apiHelpers.post(`/patients/${patientId}/interactions`, interactionData);
  },

  /**
   * الحصول على إحصائيات المرضى
   * Get patients statistics
   */
  getPatientsStats: async () => {
    return await apiHelpers.get('/patients/stats');
  },

  /**
   * البحث عن مرضى
   * Search for patients
   */
  searchPatients: async (query) => {
    return await apiHelpers.get('/patients/search', { q: query });
  },
};

export default patientsService;

