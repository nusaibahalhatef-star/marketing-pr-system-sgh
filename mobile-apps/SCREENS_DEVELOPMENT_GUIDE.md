# دليل تطوير الشاشات - تطبيقات الجوال
## المستشفى السعودي الألماني

**التاريخ**: 11 أكتوبر 2025  
**الإصدار**: 1.0

---

## نظرة عامة

يوضح هذا الدليل كيفية تطوير الشاشات والمكونات لتطبيقات الجوال (تطبيق الموظفين وتطبيق المرضى) باستخدام **React Native** و **Expo**، مع الالتزام بهوية المستشفى السعودي الألماني البصرية.

---

## المبادئ الأساسية

### 1. الالتزام بهوية المستشفى
- استخدام ألوان المستشفى الرسمية من ملف `colors.js`
- دعم كامل للغة العربية (RTL)
- استخدام الخطوط المناسبة للعربية

### 2. تجربة المستخدم (UX)
- واجهات بسيطة وسهلة الاستخدام
- استجابة سريعة للتفاعلات
- رسائل خطأ واضحة بالعربية
- تغذية راجعة فورية (Loading states, Success messages)

### 3. الأداء
- استخدام `FlatList` للقوائم الطويلة
- تحسين الصور باستخدام `Image.prefetch()`
- استخدام `React.memo()` للمكونات
- تجنب العمليات الثقيلة في render

---

## المكونات القابلة لإعادة الاستخدام

### 1. Button Component

```javascript
// src/components/Button.js
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  style,
  textStyle 
}) {
  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'outline' && styles.outlineButton,
    (disabled || loading) && styles.disabledButton,
    style
  ];

  const textStyles = [
    styles.buttonText,
    variant === 'primary' && styles.primaryButtonText,
    variant === 'secondary' && styles.secondaryButtonText,
    variant === 'outline' && styles.outlineButtonText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary.main : colors.text.white} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
  },
  secondaryButton: {
    backgroundColor: colors.secondary.main,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: colors.text.white,
  },
  secondaryButtonText: {
    color: colors.text.white,
  },
  outlineButtonText: {
    color: colors.primary.main,
  },
});
```

### 2. Input Component

```javascript
// src/components/Input.js
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  icon,
  style,
  ...props
}) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={isFocused ? colors.primary.main : colors.text.secondary} 
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.disabled}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputContainerFocused: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: colors.status.error,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 12,
    color: colors.status.error,
    marginTop: 4,
    textAlign: 'right',
  },
});
```

### 3. Card Component

```javascript
// src/components/Card.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';

export default function Card({ children, onPress, style }) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow.main,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

### 4. Loading Component

```javascript
// src/components/Loading.js
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function Loading({ message = 'جاري التحميل...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary.main} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.default,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
});
```

### 5. EmptyState Component

```javascript
// src/components/EmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import Button from './Button';

export default function EmptyState({ 
  icon = 'document-outline', 
  title, 
  message, 
  actionTitle, 
  onAction 
}) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.text.disabled} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionTitle && onAction && (
        <Button 
          title={actionTitle} 
          onPress={onAction} 
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    minWidth: 200,
  },
});
```

---

## أمثلة على الشاشات

### 1. شاشة تسجيل الدخول (Login Screen)

```javascript
// src/screens/auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import colors from '../../styles/colors';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await dispatch(login({ email, password })).unwrap();
      // Navigation handled automatically by App.js
    } catch (err) {
      Alert.alert('خطأ', err || 'فشل تسجيل الدخول');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>نظام إدارة التسويق</Text>
          <Text style={styles.subtitle}>المستشفى السعودي الألماني</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="البريد الإلكتروني"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            placeholder="example@sgh.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            error={errors.email}
          />

          <Input
            label="كلمة المرور"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: null });
            }}
            placeholder="••••••••"
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.password}
          />

          <Button
            title="تسجيل الدخول"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <Button
            title="نسيت كلمة المرور؟"
            onPress={() => navigation.navigate('ResetPassword')}
            variant="outline"
            style={styles.forgotButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary.main,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  loginButton: {
    marginTop: 8,
  },
  forgotButton: {
    marginTop: 12,
  },
});
```

### 2. شاشة لوحة التحكم (Dashboard Screen)

```javascript
// src/screens/DashboardScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import Loading from '../components/Loading';
import colors from '../styles/colors';

export default function DashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    tasks: { total: 0, pending: 0, completed: 0 },
    campaigns: { total: 0, active: 0 },
    patients: { total: 0, new: 0 },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch dashboard statistics
    // This is a placeholder - implement actual API calls
    setStats({
      tasks: { total: 45, pending: 12, completed: 33 },
      campaigns: { total: 8, active: 3 },
      patients: { total: 1250, new: 25 },
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>مرحباً، {user?.name || 'المستخدم'}</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('ar-SA')}</Text>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard} onPress={() => navigation.navigate('Tasks')}>
          <View style={[styles.statIcon, { backgroundColor: colors.primary.light }]}>
            <Ionicons name="checkbox-outline" size={32} color={colors.primary.main} />
          </View>
          <Text style={styles.statValue}>{stats.tasks.pending}</Text>
          <Text style={styles.statLabel}>مهام معلقة</Text>
          <Text style={styles.statSubtext}>من أصل {stats.tasks.total}</Text>
        </Card>

        <Card style={styles.statCard} onPress={() => navigation.navigate('Campaigns')}>
          <View style={[styles.statIcon, { backgroundColor: colors.secondary.light }]}>
            <Ionicons name="megaphone-outline" size={32} color={colors.secondary.main} />
          </View>
          <Text style={styles.statValue}>{stats.campaigns.active}</Text>
          <Text style={styles.statLabel}>حملات نشطة</Text>
          <Text style={styles.statSubtext}>من أصل {stats.campaigns.total}</Text>
        </Card>

        <Card style={styles.statCard} onPress={() => navigation.navigate('Patients')}>
          <View style={[styles.statIcon, { backgroundColor: colors.accent.orange + '20' }]}>
            <Ionicons name="people-outline" size={32} color={colors.accent.orange} />
          </View>
          <Text style={styles.statValue}>{stats.patients.new}</Text>
          <Text style={styles.statLabel}>مرضى جدد</Text>
          <Text style={styles.statSubtext}>هذا الشهر</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإجراءات السريعة</Text>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('CreateTask')}>
          <Ionicons name="add-circle-outline" size={24} color={colors.primary.main} />
          <Text style={styles.actionText}>إضافة مهمة جديدة</Text>
        </Card>
        <Card style={styles.actionCard} onPress={() => navigation.navigate('CreateCampaign')}>
          <Ionicons name="add-circle-outline" size={24} color={colors.secondary.main} />
          <Text style={styles.actionText}>إنشاء حملة تسويقية</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    padding: 24,
    backgroundColor: colors.primary.main,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.white,
    textAlign: 'right',
  },
  date: {
    fontSize: 14,
    color: colors.text.white,
    marginTop: 4,
    textAlign: 'right',
    opacity: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    marginBottom: 12,
  },
  statIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  section: {
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
    marginRight: 12,
    textAlign: 'right',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 12,
    textAlign: 'right',
  },
});
```

---

## التوصيات والممارسات الجيدة

### 1. إدارة الحالة
- استخدم Redux للحالة العامة (مثل بيانات المستخدم، القوائم)
- استخدم useState للحالة المحلية (مثل حالة النماذج)
- استخدم useEffect لجلب البيانات عند تحميل الشاشة

### 2. معالجة الأخطاء
- اعرض رسائل خطأ واضحة بالعربية
- استخدم Alert أو Toast للإشعارات
- تعامل مع أخطاء الشبكة بشكل صحيح

### 3. التحميل والانتظار
- اعرض Loading Indicator أثناء جلب البيانات
- استخدم Skeleton Screens لتحسين تجربة المستخدم
- أضف Pull-to-Refresh للتحديث

### 4. الأمان
- لا تخزن بيانات حساسة في AsyncStorage بدون تشفير
- استخدم Expo SecureStore للرموز
- تحقق من صلاحيات المستخدم قبل عرض المحتوى

---

## الخلاصة

تم توفير مكونات قابلة لإعادة الاستخدام وأمثلة عملية على الشاشات الرئيسية. يمكن الآن البدء في تطوير الشاشات المتبقية باستخدام هذه المكونات والأنماط.

---

**تم الإعداد بواسطة**: Manus AI  
**آخر تحديث**: 11 أكتوبر 2025

