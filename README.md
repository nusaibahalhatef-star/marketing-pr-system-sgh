# نظام إدارة التسويق والعلاقات العامة
## المستشفى السعودي الألماني

![SGH Logo](./marketing-pr-system/src/assets/Hospital/SGH%20Logo%20-%20English.png)

نظام متكامل لإدارة قسم التسويق والعلاقات العامة في المستشفى السعودي الألماني، يشمل إدارة الفريق والمهام، نظام CRM، إدارة المحتوى الرقمي، التحليلات والتقارير، بالإضافة إلى تطبيقات جوال للموظفين والمرضى.

---

## 📋 نظرة عامة

يهدف هذا النظام إلى توفير منصة شاملة لإدارة جميع جوانب قسم التسويق والعلاقات العامة، مع التركيز على تحسين الكفاءة، تعزيز التواصل، وتوفير رؤى تحليلية قيمة لاتخاذ القرارات.

### الأهداف الرئيسية:
- **إدارة الفريق والمهام**: متابعة أداء الفريق وتوزيع المهام بكفاءة
- **نظام CRM متكامل**: إدارة علاقات المرضى وتحسين تجربتهم
- **إدارة المحتوى الرقمي**: إنشاء ونشر المحتوى عبر منصات متعددة
- **التحليلات والتقارير**: اتخاذ قرارات مبنية على البيانات
- **تطبيقات الجوال**: وصول سهل للموظفين والمرضى

---

## 🚀 الحالة الحالية

**الإصدار**: 1.0 (قيد التطوير)  
**التقدم الإجمالي**: ~50%  
**آخر تحديث**: 11 أكتوبر 2025

### المراحل المكتملة:
- ✅ **المرحلة 1**: التخطيط والتوثيق (100%)
- ✅ **المرحلة 2**: تصميم UI/UX (100%)
- ✅ **المرحلة 3**: تطوير الواجهة الأمامية (100%)
- ✅ **المرحلة 4**: تطوير الواجهة الخلفية (100%)
- ✅ **المرحلة 5**: تطوير تطبيقات الجوال - الهيكل والخدمات (80%)

### المراحل قيد التطوير:
- ⏳ **المرحلة 6**: تطوير الشاشات والمكونات (0%)
- ⏳ **المرحلة 7**: إعداد التنقل وإدارة الحالة (0%)
- ⏳ **المرحلة 8**: الاختبار والتحضير للنشر (0%)
- ⏳ **المرحلة 9**: التكامل مع الأنظمة الخارجية (0%)
- ⏳ **المرحلة 10**: النشر والتدريب والدعم (0%)

---

## 🏗️ البنية المعمارية

```
marketing-pr-system-sgh/
├── marketing-pr-system/          # الواجهة الأمامية (React.js)
│   ├── src/
│   │   ├── components/           # مكونات React
│   │   ├── assets/               # الصور والشعارات
│   │   └── App.jsx               # المكون الرئيسي
│   └── package.json
│
├── backend_api/                  # الواجهة الخلفية (Flask)
│   ├── src/
│   │   ├── models/               # نماذج قاعدة البيانات
│   │   ├── routes/               # واجهات برمجة التطبيقات
│   │   ├── middleware/           # Middleware للمصادقة
│   │   ├── config.py             # إعدادات التطبيق
│   │   ├── database.py           # إدارة قواعد البيانات
│   │   └── main.py               # نقطة الدخول
│   └── requirements.txt
│
├── backend/                      # قواعد البيانات والسكريبتات
│   ├── sql/                      # سكريبتات SQL
│   └── database_schema.md        # تصميم قاعدة البيانات
│
├── mobile-apps/                  # تطبيقات الجوال (React Native)
│   ├── staff-app/                # تطبيق الموظفين
│   │   ├── src/
│   │   │   ├── services/         # خدمات API
│   │   │   └── styles/           # الأنماط والألوان
│   │   ├── package.json
│   │   └── app.json
│   │
│   ├── patient-app/              # تطبيق المرضى
│   │   ├── src/
│   │   │   ├── services/         # خدمات API
│   │   │   └── styles/           # الأنماط والألوان
│   │   ├── package.json
│   │   └── app.json
│   │
│   ├── MOBILE_DEVELOPMENT_GUIDE.md
│   └── README.md
│
├── docs/                         # التوثيق
│   ├── system_overview.md
│   ├── implementation_plan.md
│   ├── ui_ux_design_specifications.md
│   ├── technical_specifications_with_diagram.md
│   └── [وثائق أخرى]
│
├── COMPREHENSIVE_PROGRESS_REPORT.md  # تقرير الإنجاز الشامل
├── INSTALLATION.md                   # دليل التثبيت
└── README.md                         # هذا الملف
```

---

## 💻 التقنيات المستخدمة

### الواجهة الأمامية (Frontend):
- **React 18.2** - مكتبة JavaScript لبناء واجهات المستخدم
- **Vite** - أداة بناء سريعة
- **Tailwind CSS** - إطار عمل CSS للتصميم
- **React Router** - للتنقل بين الصفحات

### الواجهة الخلفية (Backend):
- **Flask 3.0** - إطار عمل Python للويب
- **PostgreSQL 15** - قاعدة بيانات علائقية
- **MongoDB 7** - قاعدة بيانات NoSQL
- **SQLAlchemy 2.0** - ORM لـ Python
- **JWT** - للمصادقة والتفويض

### تطبيقات الجوال (Mobile):
- **React Native** - إطار عمل لبناء تطبيقات الجوال
- **Expo 49** - منصة لتطوير React Native
- **React Navigation 6** - للتنقل في التطبيقات
- **Redux Toolkit** - لإدارة الحالة
- **Expo Notifications** - للإشعارات الفورية

---

## 📦 التثبيت والتشغيل

للحصول على تعليمات مفصلة حول كيفية تثبيت وتشغيل النظام، يرجى الاطلاع على:

**[دليل التثبيت الكامل (INSTALLATION.md)](./INSTALLATION.md)**

### ملخص سريع:

#### 1. الواجهة الأمامية (Frontend):
```bash
cd marketing-pr-system
pnpm install
pnpm run dev
```

#### 2. الواجهة الخلفية (Backend):
```bash
cd backend_api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask run
```

#### 3. تطبيقات الجوال (Mobile):
```bash
# تطبيق الموظفين
cd mobile-apps/staff-app
npm install
npm start

# تطبيق المرضى
cd mobile-apps/patient-app
npm install
npm start
```

---

## 📚 التوثيق

### الوثائق الرئيسية:
- **[تقرير الإنجاز الشامل](./COMPREHENSIVE_PROGRESS_REPORT.md)** - تقرير مفصل لجميع الإنجازات
- **[دليل التثبيت](./INSTALLATION.md)** - تعليمات التثبيت والتشغيل
- **[نظرة عامة على النظام](./system_overview.md)** - الأهداف والمكونات
- **[خطة التنفيذ](./implementation_plan.md)** - المراحل والجدول الزمني
- **[المواصفات التقنية](./technical_specifications_with_diagram.md)** - البنية التقنية
- **[دليل تطوير تطبيقات الجوال](./mobile-apps/MOBILE_DEVELOPMENT_GUIDE.md)** - دليل شامل للتطبيقات

### وثائق الوحدات:
- [إدارة الفريق](./module_team_management.md)
- [إدارة المحتوى الرقمي](./module_digital_content_management.md)
- [نظام CRM](./module_crm.md)
- [تطبيقات المرضى](./module_patient_app_web.md)
- [التحليلات والتقارير](./module_analytics_reporting.md)
- [التكامل والربط](./module_integration_connectivity.md)
- [الاتصال الداخلي](./module_internal_communication_task_management.md)

---

## 🔌 واجهات برمجة التطبيقات (APIs)

النظام يوفر **71 نقطة نهاية API** موزعة على الوحدات التالية:

### المصادقة والمستخدمون:
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/logout` - تسجيل الخروج
- `POST /api/auth/refresh` - تحديث الرمز
- `GET /api/users` - قائمة المستخدمين
- `POST /api/users` - إنشاء مستخدم
- [المزيد...]

### المهام:
- `GET /api/tasks` - قائمة المهام
- `POST /api/tasks` - إنشاء مهمة
- `GET /api/tasks/{id}` - تفاصيل مهمة
- `PUT /api/tasks/{id}` - تحديث مهمة
- [المزيد...]

### الحملات:
- `GET /api/campaigns` - قائمة الحملات
- `POST /api/campaigns` - إنشاء حملة
- [المزيد...]

### المرضى (CRM):
- `GET /api/patients` - قائمة المرضى
- `POST /api/patients` - إنشاء ملف مريض
- [المزيد...]

### المواعيد:
- `GET /api/appointments` - قائمة المواعيد
- `POST /api/appointments` - حجز موعد
- [المزيد...]

للحصول على قائمة كاملة بجميع نقاط النهاية، يرجى الاطلاع على [تقرير الإنجاز الشامل](./COMPREHENSIVE_PROGRESS_REPORT.md).

---

## 🎨 هوية المستشفى البصرية

تم تطبيق هوية المستشفى السعودي الألماني البصرية بالكامل في جميع مكونات النظام:

### الألوان الأساسية:
- **الأزرق الأساسي**: `#0066B2`
- **الأخضر الثانوي**: `#00A651`

### الألوان المميزة:
- **البرتقالي**: `#FF6B35`
- **الأصفر**: `#FFC107`

للحصول على دليل الهوية البصرية الكامل، يرجى الاطلاع على:
- `marketing-pr-system/src/assets/SGHBrandGuidelines.pdf`
- `brand_colors.md`

---

## 🔒 الأمان والخصوصية

النظام يطبق أعلى معايير الأمان والخصوصية:

- **JWT Authentication**: مصادقة آمنة باستخدام JSON Web Tokens
- **RBAC**: نظام صلاحيات متقدم قائم على الأدوار
- **Password Hashing**: تشفير كلمات المرور باستخدام bcrypt
- **HTTPS**: جميع الاتصالات مشفرة
- **Data Encryption**: تشفير البيانات الحساسة
- **Secure Storage**: تخزين آمن للرموز في تطبيقات الجوال

---

## 📊 الإحصائيات

### الكود المكتوب:
- **Python (Backend)**: ~5,000 سطر
- **JavaScript/React (Frontend)**: ~2,000 سطر
- **JavaScript/React Native (Mobile)**: ~3,000 سطر
- **SQL**: ~500 سطر
- **الإجمالي**: ~10,500 سطر

### الملفات المنشأة:
- **ملفات التوثيق**: 20+ ملف
- **ملفات الكود**: 55+ ملف
- **الإجمالي**: 75+ ملف

---

## 🤝 المساهمة

هذا المشروع قيد التطوير النشط. للمساهمة:

1. قم بعمل Fork للمستودع
2. أنشئ فرع جديد (`git checkout -b feature/AmazingFeature`)
3. قم بتثبيت التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. ادفع إلى الفرع (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

---

## 📝 الترخيص

هذا المشروع ملك للمستشفى السعودي الألماني. جميع الحقوق محفوظة.

---

## 📞 جهات الاتصال

- **المستودع**: https://github.com/nusaibahalhatef-star/marketing-pr-system-sgh
- **الدعم الفني**: [بريد إلكتروني]
- **الموقع الإلكتروني**: https://www.sghgroup.com

---

## 🙏 شكر وتقدير

تم تطوير هذا النظام بواسطة **Manus AI** بالتعاون مع فريق التسويق والعلاقات العامة في المستشفى السعودي الألماني.

---

**آخر تحديث**: 11 أكتوبر 2025  
**الإصدار**: 1.0

