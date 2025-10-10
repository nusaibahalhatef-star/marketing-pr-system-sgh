/**
 * خدمة السجلات الطبية
 * Medical Records Service
 */

import { apiHelpers } from './api';

export const medicalRecordsService = {
  /**
   * الحصول على السجلات الطبية
   * Get medical records
   */
  getMedicalRecords: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      per_page: params.perPage || 20,
      record_type: params.recordType,
      date_from: params.dateFrom,
      date_to: params.dateTo,
    };

    return await apiHelpers.get('/medical-records', queryParams);
  },

  /**
   * الحصول على تفاصيل سجل طبي
   * Get medical record details
   */
  getMedicalRecord: async (recordId) => {
    return await apiHelpers.get(`/medical-records/${recordId}`);
  },

  /**
   * الحصول على الوصفات الطبية
   * Get prescriptions
   */
  getPrescriptions: async (params = {}) => {
    return await apiHelpers.get('/medical-records/prescriptions', params);
  },

  /**
   * الحصول على تفاصيل وصفة طبية
   * Get prescription details
   */
  getPrescription: async (prescriptionId) => {
    return await apiHelpers.get(`/medical-records/prescriptions/${prescriptionId}`);
  },

  /**
   * الحصول على التشخيصات
   * Get diagnoses
   */
  getDiagnoses: async (params = {}) => {
    return await apiHelpers.get('/medical-records/diagnoses', params);
  },

  /**
   * الحصول على الحساسيات
   * Get allergies
   */
  getAllergies: async () => {
    return await apiHelpers.get('/medical-records/allergies');
  },

  /**
   * إضافة حساسية
   * Add allergy
   */
  addAllergy: async (allergyData) => {
    return await apiHelpers.post('/medical-records/allergies', allergyData);
  },

  /**
   * الحصول على الأدوية الحالية
   * Get current medications
   */
  getCurrentMedications: async () => {
    return await apiHelpers.get('/medical-records/current-medications');
  },

  /**
   * تنزيل سجل طبي
   * Download medical record
   */
  downloadRecord: async (recordId) => {
    return await apiHelpers.get(`/medical-records/${recordId}/download`);
  },
};

export default medicalRecordsService;

