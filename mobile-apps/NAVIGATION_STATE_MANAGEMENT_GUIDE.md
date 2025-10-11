# دليل إعداد التنقل وإدارة الحالة لتطبيقات الجوال
## المستشفى السعودي الألماني

**التاريخ**: 11 أكتوبر 2025  
**الإصدار**: 1.0

---

## نظرة عامة

يوضح هذا الدليل كيفية إعداد نظام التنقل (Navigation) وإدارة الحالة (State Management) لتطبيقات الجوال (تطبيق الموظفين وتطبيق المرضى) باستخدام **React Navigation** و **Redux Toolkit**.

---

## المتطلبات الأساسية

### المكتبات المطلوبة:

```bash
# React Navigation
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install @react-navigation/drawer
npm install react-native-screens react-native-safe-area-context

# Redux Toolkit
npm install @reduxjs/toolkit react-redux

# AsyncStorage لحفظ الحالة
npm install @react-native-async-storage/async-storage

# Gesture Handler للتنقل
npm install react-native-gesture-handler
```

---

## الجزء الأول: إعداد React Navigation

### 1. بنية التنقل

#### تطبيق الموظفين (Staff App):

```
App
├── Auth Stack (غير مسجل الدخول)
│   ├── Login Screen
│   └── Reset Password Screen
│
└── Main Stack (مسجل الدخول)
    └── Drawer Navigator
        ├── Bottom Tab Navigator
        │   ├── Dashboard Tab
        │   ├── Tasks Tab
        │   ├── Campaigns Tab
        │   └── Notifications Tab
        ├── Team Management Screen
        ├── Content Management Screen
        ├── Patients (CRM) Screen
        ├── Analytics Screen
        └── Settings Screen
```

#### تطبيق المرضى (Patient App):

```
App
├── Auth Stack (غير مسجل الدخول)
│   ├── Login Screen
│   ├── Register Screen
│   └── Reset Password Screen
│
└── Main Stack (مسجل الدخول)
    └── Bottom Tab Navigator
        ├── Home Tab
        ├── Appointments Tab
        ├── Medical Records Tab
        ├── Test Results Tab
        └── Profile Tab
```

### 2. إعداد Navigation Container

#### ملف: `App.js` (تطبيق الموظفين)

```javascript
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { authService } from './src/services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading } from './src/store/slices/authSlice';

import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';

function AppContent() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    dispatch(setLoading(true));
    const isLoggedIn = await authService.isLoggedIn();
    
    if (isLoggedIn) {
      const currentUser = await authService.getCurrentUser();
      dispatch(setUser(currentUser));
    }
    
    dispatch(setLoading(false));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
```

### 3. إنشاء Auth Stack

#### ملف: `src/navigation/AuthStack.js`

```javascript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
```

### 4. إنشاء Main Stack مع Drawer Navigator

#### ملف: `src/navigation/MainStack.js` (تطبيق الموظفين)

```javascript
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import BottomTabNavigator from './BottomTabNavigator';
import TeamManagementScreen from '../screens/TeamManagementScreen';
import ContentManagementScreen from '../screens/ContentManagementScreen';
import PatientsScreen from '../screens/PatientsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import colors from '../styles/colors';

const Drawer = createDrawerNavigator();

export default function MainStack() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary.main,
        },
        headerTintColor: colors.text.white,
        drawerActiveTintColor: colors.primary.main,
        drawerInactiveTintColor: colors.text.secondary,
        drawerStyle: {
          backgroundColor: colors.background.default,
        },
      }}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={BottomTabNavigator}
        options={{
          title: 'الرئيسية',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TeamManagement"
        component={TeamManagementScreen}
        options={{
          title: 'إدارة الفريق',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ContentManagement"
        component={ContentManagementScreen}
        options={{
          title: 'إدارة المحتوى',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Patients"
        component={PatientsScreen}
        options={{
          title: 'إدارة المرضى',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          title: 'التحليلات',
          drawerIcon: ({ color, size}) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'الإعدادات',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
```

### 5. إنشاء Bottom Tab Navigator

#### ملف: `src/navigation/BottomTabNavigator.js` (تطبيق الموظفين)

```javascript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import TasksScreen from '../screens/TasksScreen';
import CampaignsScreen from '../screens/CampaignsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import colors from '../styles/colors';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.paper,
          borderTopColor: colors.border.light,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'لوحة التحكم',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          title: 'المهام',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
          tabBarBadge: 5, // عدد المهام المعلقة
        }}
      />
      <Tab.Screen
        name="Campaigns"
        component={CampaignsScreen}
        options={{
          title: 'الحملات',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="megaphone-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'الإشعارات',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
          tabBarBadge: 3, // عدد الإشعارات غير المقروءة
        }}
      />
    </Tab.Navigator>
  );
}
```

---

## الجزء الثاني: إعداد Redux Toolkit

### 1. بنية Store

```
src/store/
├── index.js                 # إعداد Store الرئيسي
├── slices/
│   ├── authSlice.js         # حالة المصادقة
│   ├── tasksSlice.js        # حالة المهام
│   ├── campaignsSlice.js    # حالة الحملات
│   ├── patientsSlice.js     # حالة المرضى
│   ├── notificationsSlice.js # حالة الإشعارات
│   └── uiSlice.js           # حالة واجهة المستخدم
└── middleware/
    └── apiMiddleware.js     # Middleware للتعامل مع API
```

### 2. إنشاء Store

#### ملف: `src/store/index.js`

```javascript
import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import tasksReducer from './slices/tasksSlice';
import campaignsReducer from './slices/campaignsSlice';
import patientsReducer from './slices/patientsSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';
import apiMiddleware from './middleware/apiMiddleware';

// إعدادات persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // فقط حالة المصادقة يتم حفظها
};

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
  campaigns: campaignsReducer,
  patients: patientsReducer,
  notifications: notificationsReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiMiddleware),
});

export const persistor = persistStore(store);
```

### 3. إنشاء Auth Slice

#### ملف: `src/store/slices/authSlice.js`

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        return response.user;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;
```

### 4. إنشاء Tasks Slice

#### ملف: `src/store/slices/tasksSlice.js`

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksService } from '../../services/tasksService';

// Async Thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params, { rejectWithValue }) => {
    try {
      const response = await tasksService.getTasks(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await tasksService.createTask(taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await tasksService.updateTask(taskId, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    selectedTask: null,
    isLoading: false,
    error: null,
    filters: {
      status: null,
      priority: null,
      assignedTo: null,
    },
  },
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: null,
        priority: null,
        assignedTo: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { setSelectedTask, setFilters, clearFilters } = tasksSlice.actions;
export default tasksSlice.reducer;
```

### 5. استخدام Redux في المكونات

#### مثال: شاشة المهام

```javascript
import React, { useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, setSelectedTask } from '../store/slices/tasksSlice';

export default function TasksScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, isLoading, filters } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [filters]);

  const handleTaskPress = (task) => {
    dispatch(setSelectedTask(task));
    navigation.navigate('TaskDetails', { taskId: task.id });
  };

  return (
    <View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleTaskPress(item)}>
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchTasks(filters))}
      />
    </View>
  );
}
```

---

## الجزء الثالث: أفضل الممارسات

### 1. التنقل

- استخدم `navigation.navigate()` للانتقال إلى شاشة جديدة
- استخدم `navigation.goBack()` للعودة إلى الشاشة السابقة
- استخدم `navigation.reset()` لإعادة تعيين Stack (مثلاً بعد تسجيل الدخول)

### 2. إدارة الحالة

- استخدم Redux للحالة العامة (Global State)
- استخدم useState للحالة المحلية (Local State)
- استخدم useEffect لجلب البيانات عند تحميل المكون

### 3. الأداء

- استخدم `React.memo()` لتحسين أداء المكونات
- استخدم `useMemo()` و `useCallback()` لتحسين الأداء
- استخدم `FlatList` بدلاً من `ScrollView` للقوائم الطويلة

---

## الخلاصة

تم توفير هيكل كامل لإعداد التنقل وإدارة الحالة لتطبيقات الجوال. يمكن الآن البدء في تطوير الشاشات والمكونات الفعلية باستخدام هذا الهيكل.

---

**تم الإعداد بواسطة**: Manus AI  
**آخر تحديث**: 11 أكتوبر 2025

