/**
 * ألوان هوية المستشفى السعودي الألماني
 * Saudi German Hospital Brand Colors
 */

export const colors = {
  // الألوان الأساسية - Primary Colors
  primary: {
    main: '#0066B2',      // الأزرق الأساسي - Main Blue
    light: '#4D94C7',     // الأزرق الفاتح - Light Blue
    dark: '#004A7F',      // الأزرق الداكن - Dark Blue
    contrast: '#FFFFFF',  // لون النص على الخلفية الأساسية
  },
  
  // الألوان الثانوية - Secondary Colors
  secondary: {
    main: '#00A651',      // الأخضر الأساسي - Main Green
    light: '#4DC47D',     // الأخضر الفاتح - Light Green
    dark: '#007A3D',      // الأخضر الداكن - Dark Green
    contrast: '#FFFFFF',  // لون النص على الخلفية الثانوية
  },
  
  // الألوان المميزة - Accent Colors
  accent: {
    orange: '#FF6B35',    // البرتقالي - Orange
    yellow: '#FFC107',    // الأصفر - Yellow
    red: '#E53935',       // الأحمر - Red
    purple: '#8E24AA',    // البنفسجي - Purple
  },
  
  // الألوان المحايدة - Neutral Colors
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    gray: '#9E9E9E',
    mediumGray: '#757575',
    darkGray: '#424242',
    black: '#000000',
  },
  
  // ألوان الحالة - Status Colors
  status: {
    success: '#4CAF50',   // نجاح - Success
    warning: '#FF9800',   // تحذير - Warning
    error: '#F44336',     // خطأ - Error
    info: '#2196F3',      // معلومات - Info
  },
  
  // ألوان النصوص - Text Colors
  text: {
    primary: '#212121',     // نص أساسي - Primary text
    secondary: '#757575',   // نص ثانوي - Secondary text
    disabled: '#BDBDBD',    // نص معطل - Disabled text
    hint: '#9E9E9E',        // نص تلميح - Hint text
    white: '#FFFFFF',       // نص أبيض - White text
  },
  
  // ألوان الخلفيات - Background Colors
  background: {
    default: '#FFFFFF',     // خلفية افتراضية - Default background
    paper: '#F5F5F5',       // خلفية ورقية - Paper background
    card: '#FFFFFF',        // خلفية البطاقة - Card background
    dark: '#212121',        // خلفية داكنة - Dark background
    overlay: 'rgba(0, 0, 0, 0.5)', // طبقة تغطية - Overlay
  },
  
  // ألوان الحدود - Border Colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#9E9E9E',
  },
  
  // ألوان الظلال - Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
  
  // ألوان أولويات المهام - Task Priority Colors
  priority: {
    high: '#F44336',      // عالية - High
    medium: '#FF9800',    // متوسطة - Medium
    low: '#4CAF50',       // منخفضة - Low
  },
  
  // ألوان حالة المهام - Task Status Colors
  taskStatus: {
    pending: '#FF9800',       // قيد الانتظار - Pending
    inProgress: '#2196F3',    // قيد التنفيذ - In Progress
    completed: '#4CAF50',     // مكتملة - Completed
    cancelled: '#9E9E9E',     // ملغاة - Cancelled
  },
  
  // ألوان حالة الحملات - Campaign Status Colors
  campaignStatus: {
    planning: '#9C27B0',      // تخطيط - Planning
    active: '#4CAF50',        // نشطة - Active
    completed: '#2196F3',     // مكتملة - Completed
    cancelled: '#F44336',     // ملغاة - Cancelled
  },
};

export default colors;
