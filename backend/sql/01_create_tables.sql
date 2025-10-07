-- نظام إدارة التسويق والعلاقات العامة - المستشفى السعودي الألماني
-- ملف إنشاء الجداول الأساسية

-- تفعيل امتداد UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- جدول المستخدمين (users)
-- ==============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- فهارس جدول المستخدمين
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ==============================================
-- جدول الأدوار والصلاحيات (roles)
-- ==============================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ==============================================
-- جدول الحملات التسويقية (campaigns)
-- ==============================================

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    budget DECIMAL(12,2),
    spent DECIMAL(12,2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    target_audience TEXT,
    goals JSONB,
    metrics JSONB,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- فهارس جدول الحملات
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);

-- ==============================================
-- جدول المهام (tasks)
-- ==============================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- فهارس جدول المهام
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_assigned_by ON tasks(assigned_by);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_campaign_id ON tasks(campaign_id);

-- ==============================================
-- جدول المرضى (patients)
-- ==============================================

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    national_id VARCHAR(50) UNIQUE,
    insurance_provider VARCHAR(255),
    insurance_number VARCHAR(100),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    registration_source VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- فهارس جدول المرضى
CREATE INDEX idx_patients_patient_number ON patients(patient_number);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_national_id ON patients(national_id);

-- ==============================================
-- جدول المواعيد (appointments)
-- ==============================================

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP NOT NULL,
    department VARCHAR(100) NOT NULL,
    doctor_name VARCHAR(255),
    appointment_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- فهارس جدول المواعيد
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_created_by ON appointments(created_by);

-- ==============================================
-- جدول التفاعلات مع المرضى (patient_interactions)
-- ==============================================

CREATE TABLE patient_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    description TEXT,
    outcome VARCHAR(50),
    handled_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- فهارس جدول التفاعلات
CREATE INDEX idx_interactions_patient_id ON patient_interactions(patient_id);
CREATE INDEX idx_interactions_type ON patient_interactions(interaction_type);
CREATE INDEX idx_interactions_created_at ON patient_interactions(created_at);
CREATE INDEX idx_interactions_handled_by ON patient_interactions(handled_by);

-- ==============================================
-- جدول الإشعارات (notifications)
-- ==============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- فهارس جدول الإشعارات
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ==============================================
-- جدول الملفات المرفقة (attachments)
-- ==============================================

CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- فهارس جدول الملفات المرفقة
CREATE INDEX idx_attachments_entity ON attachments(entity_type, entity_id);
CREATE INDEX idx_attachments_uploaded_by ON attachments(uploaded_by);

-- ==============================================
-- جدول السجل الزمني للأنشطة (activity_log)
-- ==============================================

CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- فهارس جدول السجل الزمني
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

-- ==============================================
-- إنشاء دالة لتحديث updated_at تلقائياً
-- ==============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================
-- إنشاء مشغلات (Triggers) لتحديث updated_at
-- ==============================================

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_interactions_updated_at BEFORE UPDATE ON patient_interactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- إدراج الأدوار الافتراضية
-- ==============================================

INSERT INTO roles (name, description, permissions) VALUES
('admin', 'مدير النظام - صلاحيات كاملة', '{"all": true}'::jsonb),
('marketing_manager', 'مدير التسويق', '{"campaigns": ["create", "read", "update", "delete"], "team": ["read", "update"], "content": ["create", "read", "update", "delete"], "analytics": ["read"]}'::jsonb),
('marketing_specialist', 'أخصائي تسويق', '{"campaigns": ["read", "update"], "content": ["create", "read", "update"], "analytics": ["read"]}'::jsonb),
('field_representative', 'مندوب ميداني', '{"patients": ["create", "read", "update"], "appointments": ["create", "read", "update"]}'::jsonb),
('customer_service', 'خدمة العملاء', '{"patients": ["read", "update"], "appointments": ["create", "read", "update"], "interactions": ["create", "read", "update"]}'::jsonb),
('content_creator', 'منشئ محتوى', '{"content": ["create", "read", "update"]}'::jsonb),
('analyst', 'محلل بيانات', '{"analytics": ["read"], "reports": ["create", "read"]}'::jsonb);

-- ==============================================
-- إدراج مستخدم افتراضي (admin)
-- ==============================================

-- كلمة المرور: Admin@123
-- يجب تغيير كلمة المرور بعد أول تسجيل دخول

INSERT INTO users (email, password_hash, full_name, role, department, is_active) VALUES
('admin@sgh.sa', '$2b$10$YourHashedPasswordHere', 'مدير النظام', 'admin', 'تقنية المعلومات', TRUE);

-- ==============================================
-- ملاحظات
-- ==============================================

-- 1. يجب تغيير كلمة مرور المستخدم الافتراضي بعد أول تسجيل دخول
-- 2. يجب تكوين النسخ الاحتياطي التلقائي لقاعدة البيانات
-- 3. يجب تفعيل SSL/TLS للاتصالات بقاعدة البيانات
-- 4. يجب مراجعة الصلاحيات وتخصيصها حسب الحاجة
