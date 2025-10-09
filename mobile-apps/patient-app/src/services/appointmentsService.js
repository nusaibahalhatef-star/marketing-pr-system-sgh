/**
 * خدمة المواعيد
 * Appointments Service
 */

import { apiHelpers } from './api';

export const appointmentsService = {
  /**
   * الحصول على قائمة مواعيد المريض
   * Get patient's appointments list
   */
  getMyAppointments: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      per_page: params.perPage || 20,
      status: params.status,
      date_from: params.dateFrom,
      date_to: params.dateTo,
    };

    return await apiHelpers.get('/appointments', queryParams);
  },

  /**
   * الحصول على تفاصيل موعد
   * Get appointment details
   */
  getAppointment: async (appointmentId) => {
    return await apiHelpers.get(`/appointments/${appointmentId}`);
  },

  /**
   * حجز موعد جديد
   * Book new appointment
   */
  bookAppointment: async (appointmentData) => {
    return await apiHelpers.post('/appointments', {
      appointment_date: appointmentData.appointmentDate,
      appointment_type: appointmentData.appointmentType,
      department: appointmentData.department,
      doctor_name: appointmentData.doctorName,
      notes: appointmentData.notes,
    });
  },

  /**
   * إلغاء موعد
   * Cancel appointment
   */
  cancelAppointment: async (appointmentId) => {
    return await apiHelpers.post(`/appointments/${appointmentId}/cancel`);
  },

  /**
   * إعادة جدولة موعد
   * Reschedule appointment
   */
  rescheduleAppointment: async (appointmentId, newDate) => {
    return await apiHelpers.put(`/appointments/${appointmentId}`, {
      appointment_date: newDate,
    });
  },

  /**
   * الحصول على الأقسام المتاحة
   * Get available departments
   */
  getDepartments: async () => {
    return await apiHelpers.get('/appointments/departments');
  },

  /**
   * الحصول على الأطباء المتاحين في قسم معين
   * Get available doctors in a department
   */
  getDoctors: async (department) => {
    return await apiHelpers.get('/appointments/doctors', { department });
  },

  /**
   * الحصول على الأوقات المتاحة لموعد
   * Get available time slots
   */
  getAvailableSlots: async (department, date) => {
    return await apiHelpers.get('/appointments/available-slots', {
      department,
      date,
    });
  },

  /**
   * الحصول على إحصائيات المواعيد
   * Get appointments statistics
   */
  getAppointmentsStats: async () => {
    return await apiHelpers.get('/appointments/stats');
  },
};

export default appointmentsService;
