# دليل تطوير تطبيقات الجوال - نظام إدارة التسويق والعلاقات العامة

**التاريخ**: 7 أكتوبر 2025  
**المشروع**: نظام إدارة التسويق والعلاقات العامة - المستشفى السعودي الألماني  
**التقنية**: React Native + Expo

---

## نظرة عامة

يتضمن النظام تطبيقين للجوال:

1. **تطبيق الموظفين (Staff App)**: لفريق التسويق والعلاقات العامة وخدمة العملاء
2. **تطبيق المرضى (Patient App)**: للمرضى لمتابعة مواعيدهم وتقاريرهم الطبية

---

## المتطلبات الأساسية

### البرامج المطلوبة

1. **Node.js**: الإصدار 18 أو أحدث
2. **npm أو yarn**: لإدارة المكتبات
3. **Expo CLI**: لتطوير تطبيقات React Native
   ```bash
   npm install -g expo-cli
   ```
4. **Expo Go App**: على الهاتف المحمول للاختبار (متاح على iOS و Android)

### للتطوير الأصلي (اختياري)

- **Android Studio**: لتطوير واختبار تطبيقات Android
- **Xcode**: لتطوير واختبار تطبيقات iOS (macOS فقط)

---

## البنية المعمارية للتطبيقات

### تطبيق الموظفين (Staff App)

```
staff-app/
├── App.js                          # نقطة الدخول الرئيسية
├── app.json                        # إعدادات Expo
├── package.json                    # المكتبات والتبعيات
├── src/
│   ├── navigation/                 # التنقل بين الشاشات
│   │   ├── AppNavigator.js        # التنقل الرئيسي
│   │   └── AuthNavigator.js       # التنقل للمصادقة
│   ├── screens/                    # الشاشات
│   │   ├── auth/                  # شاشات المصادقة
│   │   │   ├── LoginScreen.js
│   │   │   └── ForgotPasswordScreen.js
│   │   ├── dashboard/             # لوحة التحكم
│   │   │   └── DashboardScreen.js
│   │   ├── tasks/                 # إدارة المهام
│   │   │   ├── TasksListScreen.js
│   │   │   ├── TaskDetailsScreen.js
│   │   │   └── CreateTaskScreen.js
│   │   ├── campaigns/             # إدارة الحملات
│   │   │   ├── CampaignsListScreen.js
│   │   │   ├── CampaignDetailsScreen.js
│   │   │   └── CreateCampaignScreen.js
│   │   ├── patients/              # إدارة المرضى (CRM)
│   │   │   ├── PatientsListScreen.js
│   │   │   ├── PatientDetailsScreen.js
│   │   │   └── CreatePatientScreen.js
│   │   ├── content/               # إدارة المحتوى
│   │   │   ├── ContentListScreen.js
│   │   │   └── CreateContentScreen.js
│   │   ├── notifications/         # الإشعارات
│   │   │   └── NotificationsScreen.js
│   │   └── profile/               # الملف الشخصي
│   │       └── ProfileScreen.js
│   ├── components/                 # المكونات القابلة لإعادة الاستخدام
│   │   ├── common/                # مكونات عامة
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Input.js
│   │   │   ├── Header.js
│   │   │   └── Loading.js
│   │   ├── tasks/                 # مكونات المهام
│   │   │   └── TaskCard.js
│   │   ├── campaigns/             # مكونات الحملات
│   │   │   └── CampaignCard.js
│   │   └── patients/              # مكونات المرضى
│   │       └── PatientCard.js
│   ├── services/                   # خدمات API
│   │   ├── api.js                 # إعدادات Axios
│   │   ├── authService.js         # خدمات المصادقة
│   │   ├── tasksService.js        # خدمات المهام
│   │   ├── campaignsService.js    # خدمات الحملات
│   │   ├── patientsService.js     # خدمات المرضى
│   │   └── notificationsService.js # خدمات الإشعارات
│   ├── store/                      # إدارة الحالة (Redux/Context)
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── tasksSlice.js
│   │   └── notificationsSlice.js
│   ├── utils/                      # دوال مساعدة
│   │   ├── constants.js           # الثوابت
│   │   ├── helpers.js             # دوال مساعدة
│   │   └── validators.js          # التحقق من البيانات
│   ├── styles/                     # الأنماط
│   │   ├── colors.js              # ألوان هوية المستشفى
│   │   ├── typography.js          # الخطوط
│   │   └── spacing.js             # المسافات
│   └── assets/                     # الأصول (صور، أيقونات)
│       ├── images/
│       └── icons/
└── README.md
```

### تطبيق المرضى (Patient App)

```
patient-app/
├── App.js                          # نقطة الدخول الرئيسية
├── app.json                        # إعدادات Expo
├── package.json                    # المكتبات والتبعيات
├── src/
│   ├── navigation/                 # التنقل بين الشاشات
│   │   ├── AppNavigator.js
│   │   └── AuthNavigator.js
│   ├── screens/                    # الشاشات
│   │   ├── auth/                  # شاشات المصادقة
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── ForgotPasswordScreen.js
│   │   ├── home/                  # الشاشة الرئيسية
│   │   │   └── HomeScreen.js
│   │   ├── appointments/          # المواعيد
│   │   │   ├── AppointmentsListScreen.js
│   │   │   ├── AppointmentDetailsScreen.js
│   │   │   └── BookAppointmentScreen.js
│   │   ├── medical-records/       # السجلات الطبية
│   │   │   ├── MedicalRecordsScreen.js
│   │   │   └── RecordDetailsScreen.js
│   │   ├── test-results/          # نتائج الفحوصات
│   │   │   ├── TestResultsScreen.js
│   │   │   └── ResultDetailsScreen.js
│   │   ├── notifications/         # الإشعارات
│   │   │   └── NotificationsScreen.js
│   │   └── profile/               # الملف الشخصي
│   │       ├── ProfileScreen.js
│   │       └── EditProfileScreen.js
│   ├── components/                 # المكونات القابلة لإعادة الاستخدام
│   │   ├── common/
│   │   ├── appointments/
│   │   └── medical-records/
│   ├── services/                   # خدمات API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── appointmentsService.js
│   │   └── medicalRecordsService.js
│   ├── store/                      # إدارة الحالة
│   ├── utils/                      # دوال مساعدة
│   ├── styles/                     # الأنماط
│   └── assets/                     # الأصول
└── README.md
```

---

## المكتبات الأساسية المطلوبة

### للتطبيقين

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.72.0",
    "expo": "~49.0.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "axios": "^1.5.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.1.0",
    "expo-notifications": "~0.20.0",
    "expo-secure-store": "~12.3.0",
    "react-native-safe-area-context": "^4.7.0",
    "react-native-screens": "~3.24.0",
    "react-native-gesture-handler": "~2.12.0",
    "expo-image-picker": "~14.3.0",
    "expo-camera": "~13.4.0",
    "expo-location": "~16.1.0",
    "date-fns": "^2.30.0",
    "formik": "^2.4.0",
    "yup": "^1.3.0"
  }
}
```

---

## إعداد هوية المستشفى

### ملف الألوان (colors.js)

```javascript
// src/styles/colors.js

export const colors = {
  // الألوان الأساسية من هوية المستشفى السعودي الألماني
  primary: {
    main: '#0066B2',      // الأزرق الأساسي
    light: '#4D94C7',     // الأزرق الفاتح
    dark: '#004A7F',      // الأزرق الداكن
  },
  secondary: {
    main: '#00A651',      // الأخضر الأساسي
    light: '#4DC47D',     // الأخضر الفاتح
    dark: '#007A3D',      // الأخضر الداكن
  },
  accent: {
    orange: '#FF6B35',    // البرتقالي
    yellow: '#FFC107',    // الأصفر
  },
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    gray: '#9E9E9E',
    darkGray: '#424242',
    black: '#000000',
  },
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    white: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    dark: '#212121',
  },
};
```

---

## الشاشات الرئيسية

### 1. تطبيق الموظفين

#### شاشة تسجيل الدخول (LoginScreen.js)

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../../styles/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // منطق تسجيل الدخول
    // استدعاء authService.login(email, password)
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/sgh-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>نظام إدارة التسويق</Text>
        <Text style={styles.subtitle}>المستشفى السعودي الألماني</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="البريد الإلكتروني"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPassword}>نسيت كلمة المرور؟</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  input: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'right',
  },
  loginButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: colors.primary.main,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
```

#### شاشة لوحة التحكم (DashboardScreen.js)

```javascript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { colors } from '../../styles/colors';
import { analyticsService } from '../../services/analyticsService';

const DashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await analyticsService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>لوحة التحكم</Text>
        <Text style={styles.headerSubtitle}>مرحباً بك في نظام إدارة التسويق</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="المهام النشطة"
          value={stats?.tasks?.pending || 0}
          color={colors.primary.main}
          onPress={() => navigation.navigate('Tasks')}
        />
        <StatCard
          title="الحملات الجارية"
          value={stats?.campaigns?.active || 0}
          color={colors.secondary.main}
          onPress={() => navigation.navigate('Campaigns')}
        />
        <StatCard
          title="المرضى الجدد"
          value={stats?.patients?.new || 0}
          color={colors.accent.orange}
          onPress={() => navigation.navigate('Patients')}
        />
        <StatCard
          title="المحتوى المنشور"
          value={stats?.content?.published || 0}
          color={colors.accent.yellow}
          onPress={() => navigation.navigate('Content')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>المهام المستحقة قريباً</Text>
        {/* قائمة المهام */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإشعارات الأخيرة</Text>
        {/* قائمة الإشعارات */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  header: {
    backgroundColor: colors.primary.main,
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.white,
    marginTop: 5,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 20,
    margin: '1%',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'right',
  },
  statTitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 5,
    textAlign: 'right',
  },
  section: {
    backgroundColor: colors.neutral.white,
    margin: 10,
    borderRadius: 12,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
    textAlign: 'right',
  },
});

export default DashboardScreen;
```

### 2. تطبيق المرضى

#### شاشة المواعيد (AppointmentsListScreen.js)

```javascript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { colors } from '../../styles/colors';
import { appointmentsService } from '../../services/appointmentsService';

const AppointmentsListScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await appointmentsService.getMyAppointments();
      setAppointments(data.appointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const AppointmentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AppointmentDetails', { id: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.department}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>د. {item.doctor_name}</Text>
      <Text style={styles.cardDate}>{formatDate(item.appointment_date)}</Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return colors.primary.main;
      case 'completed': return colors.status.success;
      case 'cancelled': return colors.status.error;
      default: return colors.neutral.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'مجدول';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغى';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    // منطق تنسيق التاريخ
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>مواعيدي</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('BookAppointment')}
        >
          <Text style={styles.addButtonText}>+ حجز موعد جديد</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={appointments}
        renderItem={({ item }) => <AppointmentCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا توجد مواعيد</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  header: {
    backgroundColor: colors.primary.main,
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  addButton: {
    backgroundColor: colors.secondary.main,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: colors.text.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
});

export default AppointmentsListScreen;
```

---

## التكامل مع الواجهة الخلفية

### ملف إعدادات API (api.js)

```javascript
// src/services/api.js

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// عنوان الواجهة الخلفية
const API_BASE_URL = 'http://localhost:5000/api'; // تغيير إلى عنوان الخادم الفعلي

// إنشاء نسخة Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor لإضافة JWT token إلى جميع الطلبات
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor لمعالجة الأخطاء
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token منتهي الصلاحية - محاولة التحديث أو تسجيل الخروج
      await SecureStore.deleteItemAsync('access_token');
      // إعادة التوجيه إلى شاشة تسجيل الدخول
    }
    return Promise.reject(error);
  }
);

export default api;
```

### خدمة المصادقة (authService.js)

```javascript
// src/services/authService.js

import api from './api';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  // تسجيل الدخول
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, refresh_token, user } = response.data;
      
      // حفظ الرموز بشكل آمن
      await SecureStore.setItemAsync('access_token', access_token);
      await SecureStore.setItemAsync('refresh_token', refresh_token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'فشل تسجيل الدخول',
      };
    }
  },

  // تسجيل الخروج
  logout: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('user');
  },

  // الحصول على المستخدم الحالي
  getCurrentUser: async () => {
    const userString = await SecureStore.getItemAsync('user');
    return userString ? JSON.parse(userString) : null;
  },

  // التحقق من حالة تسجيل الدخول
  isLoggedIn: async () => {
    const token = await SecureStore.getItemAsync('access_token');
    return !!token;
  },
};
```

---

## الإشعارات الفورية (Push Notifications)

### إعداد الإشعارات

```javascript
// src/utils/notifications.js

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// تكوين كيفية عرض الإشعارات
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('فشل الحصول على إذن الإشعارات!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push Token:', token);
  } else {
    alert('يجب استخدام جهاز حقيقي للإشعارات الفورية');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};
```

---

## خطوات التطوير

### 1. إنشاء مشروع Expo جديد

```bash
# تطبيق الموظفين
npx create-expo-app staff-app
cd staff-app

# تطبيق المرضى
npx create-expo-app patient-app
cd patient-app
```

### 2. تثبيت المكتبات المطلوبة

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install axios @reduxjs/toolkit react-redux
npm install expo-notifications expo-secure-store
npm install react-native-safe-area-context react-native-screens react-native-gesture-handler
npm install date-fns formik yup
```

### 3. تطوير الشاشات والمكونات

- ابدأ بشاشات المصادقة
- ثم لوحة التحكم والشاشات الرئيسية
- أضف المكونات القابلة لإعادة الاستخدام
- اختبر على Expo Go

### 4. التكامل مع الواجهة الخلفية

- أضف خدمات API
- اختبر جميع نقاط النهاية
- تعامل مع الأخطاء

### 5. الاختبار

- اختبر على أجهزة iOS و Android
- اختبر الإشعارات الفورية
- اختبر حالات الأخطاء

### 6. البناء للنشر

```bash
# بناء تطبيق Android
eas build --platform android

# بناء تطبيق iOS
eas build --platform ios
```

---

## الخطوات التالية

1. إنشاء حسابات المطورين على Apple و Google
2. إعداد ملفات الهوية البصرية (أيقونات، شاشات البداية)
3. اختبار شامل على أجهزة متعددة
4. النشر على App Store و Google Play Store

---

**تم الإعداد بواسطة**: Manus AI  
**التاريخ**: 7 أكتوبر 2025  
**رابط المستودع**: https://github.com/nusaibahalhatef-star/marketing-pr-system-sgh
