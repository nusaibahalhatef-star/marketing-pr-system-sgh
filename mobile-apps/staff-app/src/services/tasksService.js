/**
 * خدمة المهام
 * Tasks Service
 */

import { apiHelpers } from './api';

export const tasksService = {
  /**
   * الحصول على قائمة المهام
   * Get tasks list
   */
  getTasks: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      per_page: params.perPage || 20,
      status: params.status,
      priority: params.priority,
      assigned_to: params.assignedTo,
    };

    return await apiHelpers.get('/tasks', queryParams);
  },

  /**
   * الحصول على تفاصيل مهمة
   * Get task details
   */
  getTask: async (taskId) => {
    return await apiHelpers.get(`/tasks/${taskId}`);
  },

  /**
   * إنشاء مهمة جديدة
   * Create new task
   */
  createTask: async (taskData) => {
    return await apiHelpers.post('/tasks', taskData);
  },

  /**
   * تحديث مهمة
   * Update task
   */
  updateTask: async (taskId, taskData) => {
    return await apiHelpers.put(`/tasks/${taskId}`, taskData);
  },

  /**
   * حذف مهمة
   * Delete task
   */
  deleteTask: async (taskId) => {
    return await apiHelpers.delete(`/tasks/${taskId}`);
  },

  /**
   * تعليم مهمة كمكتملة
   * Mark task as completed
   */
  completeTask: async (taskId) => {
    return await apiHelpers.post(`/tasks/${taskId}/complete`);
  },

  /**
   * الحصول على مهام المستخدم الحالي
   * Get current user's tasks
   */
  getMyTasks: async (params = {}) => {
    return await apiHelpers.get('/tasks/my-tasks', params);
  },

  /**
   * الحصول على إحصائيات المهام
   * Get tasks statistics
   */
  getTasksStats: async () => {
    return await apiHelpers.get('/tasks/stats');
  },
};

export default tasksService;
