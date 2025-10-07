# تصميم قاعدة البيانات - نظام إدارة التسويق والعلاقات العامة

## نظرة عامة

يستخدم النظام نوعين من قواعد البيانات لتلبية احتياجات مختلفة:

**PostgreSQL**: لتخزين البيانات المهيكلة والعلاقات المعقدة (المستخدمون، المهام، الحملات، المرضى، إلخ).

**MongoDB**: لتخزين البيانات غير المهيكلة والمرنة (المحتوى الرقمي، السجلات، التحليلات، إلخ).

---

## قاعدة بيانات PostgreSQL

### جداول النظام الأساسية

#### 1. جدول المستخدمين (users)

يحتوي على معلومات جميع مستخدمي النظام من موظفين وإداريين.

| العمود | النوع | الوصف | القيود |
|--------|------|-------|--------|
| id | UUID | المعرف الفريد للمستخدم | PRIMARY KEY |
| email | VARCHAR(255) | البريد الإلكتروني | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | كلمة المرور المشفرة | NOT NULL |
| full_name | VARCHAR(255) | الاسم الكامل | NOT NULL |
| phone | VARCHAR(20) | رقم الهاتف | - |
| role | VARCHAR(50) | الدور الوظيفي | NOT NULL |
| department | VARCHAR(100) | القسم | - |
| is_active | BOOLEAN | حالة النشاط | DEFAULT TRUE |
| avatar_url | TEXT | رابط الصورة الشخصية | - |
| created_at | TIMESTAMP | تاريخ الإنشاء | DEFAULT NOW() |
| updated_at | TIMESTAMP | تاريخ آخر تحديث | DEFAULT NOW() |
| last_login | TIMESTAMP | آخر تسجيل دخول | - |

**الفهارس**:
- `idx_users_email` على `email`
- `idx_users_role` على `role`

---

#### 2. جدول الأدوار والصلاحيات (roles)

يحدد الأدوار المختلفة في النظام والصلاحيات المرتبطة بها.

| العمود | النوع | الوصف | القيود |
|--------|------|-------|--------|
| id | UUID | المعرف الفريد للدور | PRIMARY KEY |
| name | VARCHAR(100) | اسم الدور | UNIQUE, NOT NULL |
| description | TEXT | وصف الدور | - |
| permissions | JSONB | الصلاحيات | NOT NULL |
| created_at | TIMESTAMP | تاريخ الإنشاء | DEFAULT NOW() |
| updated_at | TIMESTAMP | تاريخ آخر تحديث | DEFAULT NOW() |

**الأدوار الافتراضية**:
- `admin`: مدير النظام
- `marketing_manager`: مدير التسويق
- `marketing_specialist`: أخصائي تسويق
- `field_representative`: مندوب ميداني
- `customer_service`: خدمة العملاء
- `content_creator`: منشئ محتوى
- `analyst`: محلل بيانات

---

#### 3. جدول المهام (tasks)

يحتوي على جميع المهام المعينة لأعضاء الفريق.

| العمود | النوع | الوصف | القيود |
|--------|------|-------|--------|
| id | UUID | المعرف الفريد للمهمة | PRIMARY KEY |
| title | VARCHAR(255) | عنوان المهمة | NOT NULL |
| description | TEXT | وصف المهمة | - |
| status | VARCHAR(50) | حالة المهمة | NOT NULL |
| priority | VARCHAR(20) | الأولوية | NOT NULL |
| assigned_to | UUID | المستخدم المعين | FOREIGN KEY (users.id) |
| assigned_by | UUID | من قام بالتعيين | FOREIGN KEY (users.id) |
| campaign_id | UUID | معرف الحملة المرتبطة | FOREIGN KEY (campaigns.id) |
| due_date | TIMESTAMP | تاريخ الاستحقاق | - |
| completed_at | TIMESTAMP | تاريخ الإنجاز | - |
| created_at | TIMESTAMP | تاريخ الإنشاء | DEFAULT NOW() |
| updated_at | TIMESTAMP | تاريخ آخر تحديث | DEFAULT NOW() |

**القيم المحتملة**:
- `status`: `pending`, `in_progress`, `completed`, `on_hold`, `cancelled`
- `priority`: `low`, `medium`, `high`, `urgent`

**الفهارس**:
- `idx_tasks_assigned_to` على `assigned_to`
- `idx_tasks_status` على `status`
- `idx_tasks_due_date` على `due_date`

---

#### 4. جدول الحملات التسويقية (campaigns)

يحتوي على معلومات الحملات التسويقية المختلفة.

| العمود | النوع | الوصف | القيود |
|--------|------|-------|--------|
| id | UUID | المعرف الفريد للحملة | PRIMARY KEY |
| name | VARCHAR(255) | اسم الحملة | NOT NULL |
| description | TEXT | وصف الحملة | - |
| type | VARCHAR(50) | نوع الحملة | NOT NULL |
| status | VARCHAR(50) | حالة الحملة | NOT NULL |
| budget | DECIMAL(12,2) | الميزانية | - |
| spent | DECIMAL(12,2) | المبلغ المنفق | DEFAULT 0 |
| start_date | DATE | تاريخ البداية | NOT NULL |
| end_date | DATE | تاريخ النهاية | - |
| target_audience | TEXT | الجمهور المستهدف | - |
| goals | JSONB | أهداف الحملة | - |
| metrics | JSONB | مؤشرات الأداء | - |
| created_by | UUID | من قام بالإنشاء | FOREIGN KEY (users.id) |
| created_at | TIMESTAMP | تاريخ الإنشاء | DEFAULT NOW() |
| updated_at | TIMESTAMP | تاريخ آخر تحديث | DEFAULT NOW() |

**القيم المحتملة**:
- `type`: `digital`, `traditional`, `social_media`, `email`, `sms`, `event`
- `status`: `planning`, `active`, `paused`, `completed`, `cancelled`

**الفهارس**:
- `idx_campaigns_status` على `status`
- `idx_campaigns_dates` على `start_date, end_date`

---

#### 5. جدول المرضى (patients)

يحتوي على معلومات المرضى المسجلين في النظام.

| العمود | النوع | الوصف | القيود |
|--------|------|-------|--------|
| id | UUID | المعرف الفريد للمريض | PRIMARY KEY |
| patient_number | VARCHAR(50) | رقم المريض | UNIQUE, NOT NULL |
| full_name | VARCHAR(255) | الاسم الكامل | NOT NULL |
| date_of_birth | DATE | تاريخ الميلاد | NOT NULL |
| gender | VARCHAR(10) | الجنس | NOT NULL |
| phone | VARCHAR(20) | رقم الهاتف | NOT NULL |
| email | VARCHAR(255) | البريد الإلكتروني | - |
| address | TEXT | العنوان | - |
| city | VARCHAR(100) | المدينة | - |
| national_id | VARCHAR(50) | رقم الهوية الوطنية | UNIQUE |
| insurance_provider | VARCHAR(255) | مزود التأمين | - |
| insurance_number | VARCHAR(100) | رقم التأمين | - |
| emergency_contact_name | VARCHAR(255) | اسم جهة الاتصال الطارئة | - |
| emergency_contact_phone | VARCHAR(20) | هاتف جهة الاتصال الطارئة | - |
| registration_source | VARCHAR(50) | مصدر التسجيل | - |
| is_active | BOOLEAN | حالة النشاط | DEFAULT TRUE |
| created_at | TIMESTAMP | تاريخ التسجيل | DEFAULT NOW() |
| updated_at | TIMESTAMP | تاريخ آخر تحديث | DEFAULT NOW() |

**الفهارس**:
- `idx_patients_patient_number` على `patient_number`
- `idx_patients_phone` على `phone`
- `idx_patients_email` على `email`

---

#### 6. جدول المواعيد (appointments)

يحتوي على مواعيد المرضى.

| العمود | النوع | الوصف | القيود |
|--------|------|-------|--------|
| id | UUID | المعرف الفريد للموعد | PRIMARY KEY |
| patient_id | UUID | معرف المريض | FOREIGN KEY (patients.id) |
| appointment_date | TIMESTAMP | تاريخ ووقت الموعد | NOT NULL |
| department | VARCHAR(100) | القسم | NOT NULL |
| doctor_name | VARCHAR(255) | اسم الطبيب | - |
| appointment_type | VARCHAR(50) | نوع الموعد | NOT NULL |
| status | VARCHAR(50) | حالة الموعد | NOT NULL |
| notes | TEXT | ملاحظات | - |
| reminder_sent | BOOLEAN | تم إرسال التذكير | DEFAULT FALSE |
| created_by | UUID | من قام بالحجز | FOREIGN KEY (users.id) |
| created_at | TIMESTAMP | تاريخ الإنشاء | DEFAULT NOW() |
| updated_at | TIMESTAMP | تاريخ آخر تحديث | DEFAULT NOW() |

**القيم المحتملة**:
- `appointment_type`: `consultation`, `followup`, `checkup`, `emergency`
- `status`: `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show`

**الفهارس**:
- `idx_appointments_patient_id` على `patient_id`
- `idx_appointments_date` على `appointment_date`
- `idx_appointments_status` على `status`

---

#### 7. جدول التفاعلات مع المرضى (patient_interactions)

يسجل جميع التفاعلات مع المرضى (مكالمات، رسائل، زيارات، إلخ).

| العمود | النوع | الوصف | القيود |
|--------|------|-------|--------|
| id | UUID | المعرف الفريد للتفاعل | PRIMARY KEY |
| patient_id | UUID | معرف المريض | FOREIGN KEY (patients.id) |
| interaction_type | VARCHAR(50) | نوع التفاعل | NOT NULL |
| channel | VARCHAR(50) | قناة التواصل | NOT NULL |
| subject | VARCHAR(255) | الموضوع | - |
| description | TEXT | وصف التفاعل | - |
| outcome | VARCHAR(50) | النتيجة | - |
| handled_by | UUID | من قام بالتعامل | FOREIGN KEY (users.id) |
| created_at | TIMESTAMP | تاريخ التفاعل | DEFAULT NOW() |
| updated_at | TIMESTAMP | تاريخ آخر تحديث | DEFAULT NOW() |

**القيم المحتملة**:
- `interaction_type`: `inquiry`, `complaint`, `feedback`, `followup`, `appointment_request`
- `channel`: `phone`, `email`, `sms`, `whatsapp`, `in_person`, `website`
- `outcome`: `resolved`, `pending`, `escalated`, `closed`

**الفهارس**:
- `idx_interactions_patient_id` على `patient_id`
- `idx_interactions_type` على `interaction_type`
- `idx_interactions_created_at` على `created_at`

---

#### 8. جدول الإشعارات (notifications)

يحتوي على الإشعارات المرسلة للمستخدمين.

| العمود | النوع | الوصف | القيود |
|--------|------|-------|--------|
| id | UUID | المعرف الفريد للإشعار | PRIMARY KEY |
| user_id | UUID | معرف المستخدم | FOREIGN KEY (users.id) |
| title | VARCHAR(255) | عنوان الإشعار | NOT NULL |
| message | TEXT | نص الإشعار | NOT NULL |
| type | VARCHAR(50) | نوع الإشعار | NOT NULL |
| priority | VARCHAR(20) | الأولوية | NOT NULL |
| is_read | BOOLEAN | تم القراءة | DEFAULT FALSE |
| action_url | TEXT | رابط الإجراء | - |
| created_at | TIMESTAMP | تاريخ الإنشاء | DEFAULT NOW() |

**القيم المحتملة**:
- `type`: `task_assigned`, `task_due`, `campaign_update`, `system_alert`, `message`
- `priority`: `low`, `medium`, `high`

**الفهارس**:
- `idx_notifications_user_id` على `user_id`
- `idx_notifications_is_read` على `is_read`

---

## قاعدة بيانات MongoDB

### المجموعات (Collections)

#### 1. مجموعة المحتوى الرقمي (digital_content)

تحتوي على جميع المحتوى المنشور على الموقع ووسائل التواصل الاجتماعي.

```json
{
  "_id": "ObjectId",
  "title": "String",
  "content": "String",
  "content_type": "String", // article, video, image, infographic
  "platform": "String", // website, facebook, instagram, twitter, linkedin
  "status": "String", // draft, scheduled, published, archived
  "author_id": "UUID",
  "scheduled_date": "Date",
  "published_date": "Date",
  "tags": ["String"],
  "categories": ["String"],
  "media_urls": ["String"],
  "engagement": {
    "views": "Number",
    "likes": "Number",
    "shares": "Number",
    "comments": "Number"
  },
  "seo": {
    "meta_title": "String",
    "meta_description": "String",
    "keywords": ["String"]
  },
  "created_at": "Date",
  "updated_at": "Date"
}
```

---

#### 2. مجموعة التحليلات (analytics)

تحتوي على بيانات التحليلات المفصلة.

```json
{
  "_id": "ObjectId",
  "metric_type": "String", // website_traffic, social_media, campaign_performance
  "date": "Date",
  "source": "String",
  "data": {
    "page_views": "Number",
    "unique_visitors": "Number",
    "bounce_rate": "Number",
    "avg_session_duration": "Number",
    "conversions": "Number",
    "revenue": "Number"
  },
  "dimensions": {
    "device": "String",
    "location": "String",
    "age_group": "String",
    "gender": "String"
  },
  "created_at": "Date"
}
```

---

#### 3. مجموعة السجلات (logs)

تحتوي على سجلات النظام والأنشطة.

```json
{
  "_id": "ObjectId",
  "log_type": "String", // system, user_activity, api_call, error
  "level": "String", // info, warning, error, critical
  "user_id": "UUID",
  "action": "String",
  "resource": "String",
  "details": "Object",
  "ip_address": "String",
  "user_agent": "String",
  "timestamp": "Date"
}
```

---

#### 4. مجموعة الرسائل (messages)

تحتوي على الرسائل الداخلية بين أعضاء الفريق.

```json
{
  "_id": "ObjectId",
  "sender_id": "UUID",
  "recipient_id": "UUID",
  "subject": "String",
  "body": "String",
  "is_read": "Boolean",
  "attachments": [{
    "filename": "String",
    "url": "String",
    "size": "Number"
  }],
  "thread_id": "String",
  "created_at": "Date",
  "read_at": "Date"
}
```

---

#### 5. مجموعة التقارير (reports)

تحتوي على التقارير المُنشأة من النظام.

```json
{
  "_id": "ObjectId",
  "report_type": "String", // performance, campaign, financial, custom
  "title": "String",
  "description": "String",
  "generated_by": "UUID",
  "date_range": {
    "start": "Date",
    "end": "Date"
  },
  "filters": "Object",
  "data": "Object",
  "visualizations": [{
    "type": "String",
    "config": "Object"
  }],
  "file_url": "String",
  "created_at": "Date"
}
```

---

## العلاقات بين الجداول

### علاقات PostgreSQL

**المستخدمون والمهام**: علاقة واحد إلى متعدد (One-to-Many)
- مستخدم واحد يمكن أن يكون له مهام متعددة

**المستخدمون والحملات**: علاقة واحد إلى متعدد (One-to-Many)
- مستخدم واحد يمكن أن ينشئ حملات متعددة

**الحملات والمهام**: علاقة واحد إلى متعدد (One-to-Many)
- حملة واحدة يمكن أن تحتوي على مهام متعددة

**المرضى والمواعيد**: علاقة واحد إلى متعدد (One-to-Many)
- مريض واحد يمكن أن يكون له مواعيد متعددة

**المرضى والتفاعلات**: علاقة واحد إلى متعدد (One-to-Many)
- مريض واحد يمكن أن يكون له تفاعلات متعددة

**المستخدمون والإشعارات**: علاقة واحد إلى متعدد (One-to-Many)
- مستخدم واحد يمكن أن يكون له إشعارات متعددة

---

## الفهارس والتحسينات

### فهارس PostgreSQL

تم إنشاء فهارس على الأعمدة الأكثر استخداماً في الاستعلامات:
- أعمدة المعرفات الفريدة (UUID)
- أعمدة الحالة (status)
- أعمدة التواريخ (dates)
- أعمدة البريد الإلكتروني والهاتف

### فهارس MongoDB

يجب إنشاء فهارس على:
- `author_id` في مجموعة `digital_content`
- `date` في مجموعة `analytics`
- `user_id` و `timestamp` في مجموعة `logs`
- `sender_id` و `recipient_id` في مجموعة `messages`

---

## الأمان والنسخ الاحتياطي

### تشفير البيانات

**البيانات الحساسة**: يتم تشفير البيانات الحساسة مثل كلمات المرور باستخدام bcrypt، والبيانات الشخصية باستخدام AES-256.

**الاتصالات**: جميع الاتصالات بقواعد البيانات تتم عبر SSL/TLS.

### النسخ الاحتياطي

**PostgreSQL**: نسخ احتياطي يومي كامل، ونسخ احتياطي تزايدي كل 6 ساعات.

**MongoDB**: نسخ احتياطي يومي للمجموعات الكاملة، مع تخزين النسخ لمدة 30 يوماً.

---

## الخلاصة

تم تصميم قاعدة البيانات لتكون قابلة للتوسع، آمنة، ومحسنة للأداء. يتم استخدام PostgreSQL للبيانات المهيكلة والعلاقات المعقدة، بينما يتم استخدام MongoDB للبيانات غير المهيكلة والمرنة. هذا التصميم يوفر المرونة اللازمة لتلبية احتياجات النظام الحالية والمستقبلية.
