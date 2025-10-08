# دليل التثبيت والتشغيل - نظام إدارة التسويق والعلاقات العامة

هذا الدليل يوضح خطوات تثبيت وتشغيل نظام إدارة التسويق والعلاقات العامة للمستشفى السعودي الألماني على جهازك المحلي.

---

## المتطلبات الأساسية

قبل البدء، تأكد من تثبيت البرامج التالية على جهازك:

### 1. Node.js و pnpm
- **Node.js**: الإصدار 18 أو أحدث
- تحميل من: https://nodejs.org/
- بعد تثبيت Node.js، قم بتثبيت pnpm:
```bash
npm install -g pnpm
```

### 2. Python
- **Python**: الإصدار 3.11 أو أحدث
- تحميل من: https://www.python.org/downloads/

### 3. PostgreSQL
- **PostgreSQL**: الإصدار 14 أو أحدث
- تحميل من: https://www.postgresql.org/download/

### 4. MongoDB (اختياري)
- **MongoDB**: الإصدار 6 أو أحدث
- تحميل من: https://www.mongodb.com/try/download/community
- **ملاحظة**: MongoDB اختياري في هذه المرحلة، يمكن تخطيه إذا لم يكن متاحاً

### 5. Git
- للحصول على الكود من GitHub
- تحميل من: https://git-scm.com/downloads

---

## الخطوة 1: استنساخ المشروع

افتح Terminal أو Command Prompt وقم بتنفيذ الأوامر التالية:

```bash
# استنساخ المستودع من GitHub
git clone https://github.com/nusaibahalhatef-star/marketing-pr-system-sgh.git

# الانتقال إلى مجلد المشروع
cd marketing-pr-system-sgh
```

---

## الخطوة 2: إعداد قاعدة البيانات PostgreSQL

### على Windows:

1. افتح pgAdmin أو SQL Shell (psql)
2. قم بتسجيل الدخول باستخدام مستخدم postgres
3. قم بتنفيذ الأوامر التالية:

```sql
-- إنشاء قاعدة البيانات
CREATE DATABASE sgh_marketing_db;

-- إنشاء مستخدم جديد (اختياري)
CREATE USER sgh_user WITH PASSWORD 'sgh_password_2025';

-- منح الصلاحيات
GRANT ALL PRIVILEGES ON DATABASE sgh_marketing_db TO sgh_user;
```

4. قم بتنفيذ سكريبت إنشاء الجداول:

```bash
psql -U postgres -d sgh_marketing_db -f backend/sql/01_create_tables.sql
```

### على macOS/Linux:

```bash
# تسجيل الدخول إلى PostgreSQL
sudo -u postgres psql

# إنشاء قاعدة البيانات
CREATE DATABASE sgh_marketing_db;

# إنشاء مستخدم جديد (اختياري)
CREATE USER sgh_user WITH PASSWORD 'sgh_password_2025';

# منح الصلاحيات
GRANT ALL PRIVILEGES ON DATABASE sgh_marketing_db TO sgh_user;

# الخروج
\q

# تنفيذ سكريبت إنشاء الجداول
psql -U postgres -d sgh_marketing_db -f backend/sql/01_create_tables.sql
```

---

## الخطوة 3: إعداد الواجهة الخلفية (Backend)

### 3.1 إنشاء البيئة الافتراضية

```bash
# الانتقال إلى مجلد الواجهة الخلفية
cd backend_api

# إنشاء بيئة افتراضية
python3.11 -m venv venv

# تفعيل البيئة الافتراضية
# على Windows:
venv\Scripts\activate

# على macOS/Linux:
source venv/bin/activate
```

### 3.2 تثبيت المكتبات المطلوبة

```bash
pip install -r requirements.txt
```

### 3.3 إعداد ملف البيئة

```bash
# نسخ ملف .env.example إلى .env
cp .env.example .env

# على Windows:
copy .env.example .env
```

افتح ملف `.env` وقم بتحديث القيم التالية:

```env
# إعدادات Flask
FLASK_ENV=development
SECRET_KEY=your-secret-key-here-change-this-in-production
DEBUG=True

# إعدادات قاعدة البيانات PostgreSQL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/sgh_marketing_db

# إعدادات MongoDB (اختياري - يمكن تركه فارغاً)
MONGODB_URI=mongodb://localhost:27017/sgh_marketing_db

# إعدادات JWT
JWT_SECRET_KEY=your-jwt-secret-key-here-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES=3600
JWT_REFRESH_TOKEN_EXPIRES=2592000

# إعدادات CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**ملاحظة مهمة**: قم بتغيير `SECRET_KEY` و `JWT_SECRET_KEY` إلى قيم عشوائية آمنة. يمكنك توليد مفاتيح عشوائية باستخدام:

```python
python -c "import secrets; print(secrets.token_hex(32))"
```

### 3.4 تشغيل الخادم

```bash
# تأكد من أنك في مجلد backend_api وأن البيئة الافتراضية مفعلة
python src/main.py
```

يجب أن ترى رسالة تشير إلى أن الخادم يعمل على `http://localhost:5000`

---

## الخطوة 4: إعداد الواجهة الأمامية (Frontend)

### 4.1 افتح نافذة Terminal جديدة

اترك الخادم الخلفي يعمل في النافذة السابقة، وافتح نافذة Terminal جديدة.

### 4.2 الانتقال إلى مجلد الواجهة الأمامية

```bash
# من جذر المشروع
cd marketing-pr-system
```

### 4.3 تثبيت المكتبات المطلوبة

```bash
pnpm install
```

**ملاحظة**: إذا واجهت مشاكل مع pnpm، يمكنك استخدام npm:

```bash
npm install
```

### 4.4 تشغيل خادم التطوير

```bash
pnpm run dev

# أو باستخدام npm:
npm run dev
```

يجب أن ترى رسالة تشير إلى أن التطبيق يعمل على `http://localhost:5173`

---

## الخطوة 5: الوصول إلى النظام

### الواجهة الأمامية
افتح المتصفح وانتقل إلى:
```
http://localhost:5173
```

### الواجهة الخلفية (API)
يمكنك الوصول إلى واجهات برمجة التطبيقات عبر:
```
http://localhost:5000/api
```

### فحص صحة النظام
للتأكد من أن الخادم الخلفي يعمل بشكل صحيح:
```
http://localhost:5000/health
```

يجب أن ترى استجابة JSON:
```json
{
  "status": "healthy",
  "message": "النظام يعمل بشكل صحيح"
}
```

---

## الخطوة 6: إنشاء مستخدم تجريبي

لإنشاء مستخدم تجريبي، يمكنك استخدام أداة مثل Postman أو cURL:

### باستخدام cURL:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sgh.sa",
    "password": "Admin@123456",
    "full_name": "مدير النظام",
    "role": "admin",
    "phone": "+966501234567"
  }'
```

### باستخدام Postman:

1. افتح Postman
2. أنشئ طلب POST جديد
3. URL: `http://localhost:5000/api/auth/register`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "email": "admin@sgh.sa",
  "password": "Admin@123456",
  "full_name": "مدير النظام",
  "role": "admin",
  "phone": "+966501234567"
}
```

---

## الخطوة 7: تسجيل الدخول

بعد إنشاء المستخدم، يمكنك تسجيل الدخول:

### باستخدام cURL:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sgh.sa",
    "password": "Admin@123456"
  }'
```

ستحصل على استجابة تحتوي على `access_token` و `refresh_token`. احفظ `access_token` لاستخدامه في الطلبات القادمة.

---

## اختبار واجهات برمجة التطبيقات

### 1. الحصول على معلومات المستخدم الحالي

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. إنشاء مهمة جديدة

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "مهمة تجريبية",
    "description": "هذه مهمة تجريبية لاختبار النظام",
    "status": "pending",
    "priority": "high",
    "due_date": "2025-10-15T10:00:00"
  }'
```

### 3. الحصول على قائمة المهام

```bash
curl -X GET "http://localhost:5000/api/tasks?page=1&per_page=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. إنشاء حملة تسويقية

```bash
curl -X POST http://localhost:5000/api/campaigns \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "حملة تجريبية",
    "description": "حملة تسويقية تجريبية",
    "type": "digital",
    "status": "planning",
    "budget": 50000,
    "start_date": "2025-10-01",
    "end_date": "2025-10-31"
  }'
```

---

## حل المشاكل الشائعة

### 1. خطأ في الاتصال بقاعدة البيانات

**المشكلة**: `could not connect to server: Connection refused`

**الحل**:
- تأكد من أن PostgreSQL يعمل
- تحقق من صحة `DATABASE_URL` في ملف `.env`
- تأكد من أن قاعدة البيانات `sgh_marketing_db` موجودة

### 2. خطأ في تثبيت المكتبات Python

**المشكلة**: `error: Microsoft Visual C++ 14.0 or greater is required`

**الحل** (على Windows):
- قم بتثبيت Microsoft C++ Build Tools
- أو استخدم Python 3.11 الذي يأتي مع المكتبات المطلوبة

### 3. خطأ في تشغيل الواجهة الأمامية

**المشكلة**: `ENOENT: no such file or directory`

**الحل**:
- تأكد من أنك في المجلد الصحيح (`marketing-pr-system`)
- قم بحذف مجلد `node_modules` وملف `pnpm-lock.yaml` ثم أعد تثبيت المكتبات

### 4. خطأ CORS

**المشكلة**: `Access to XMLHttpRequest has been blocked by CORS policy`

**الحل**:
- تأكد من أن `CORS_ORIGINS` في ملف `.env` يتضمن `http://localhost:5173`
- أعد تشغيل الخادم الخلفي

---

## إيقاف الخوادم

### إيقاف الواجهة الخلفية
في نافذة Terminal التي تعمل فيها الواجهة الخلفية، اضغط `Ctrl+C`

### إيقاف الواجهة الأمامية
في نافذة Terminal التي تعمل فيها الواجهة الأمامية، اضغط `Ctrl+C`

---

## الخطوات التالية

بعد التأكد من أن النظام يعمل بشكل صحيح:

1. استكشف الواجهة الأمامية على `http://localhost:5173`
2. جرّب إنشاء مهام وحملات تسويقية
3. اختبر واجهات برمجة التطبيقات المختلفة
4. راجع الوثائق في ملف `README.md` لمزيد من المعلومات

---

## الدعم

إذا واجهت أي مشاكل أو كان لديك أسئلة:
- راجع ملف `README.md` للمزيد من المعلومات
- تحقق من ملف `phase_4_completion_report.md` لفهم البنية المعمارية
- تواصل مع فريق التطوير

---

**ملاحظة**: هذا النظام قيد التطوير. بعض الميزات قد لا تكون متاحة بالكامل في هذه المرحلة.
