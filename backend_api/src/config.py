"""
إعدادات التطبيق - Application Configuration
"""

import os
from dotenv import load_dotenv

# تحميل متغيرات البيئة من ملف .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

class Config:
    """الإعدادات الأساسية"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'a_very_secret_key_that_should_be_changed')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'super-secret-jwt-key')
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    
    # إعدادات قاعدة البيانات PostgreSQL
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://sgh_user:sgh_password@localhost/sgh_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # إعدادات MongoDB (للتخزين غير المهيكل مثل السجلات)
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/sgh_marketing_db')
    
    # إعدادات CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')

class DevelopmentConfig(Config):
    """إعدادات بيئة التطوير"""
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    """إعدادات بيئة الإنتاج"""
    DEBUG = False
    FLASK_ENV = 'production'

def get_config():
    """الحصول على كائن الإعدادات المناسب للبيئة الحالية"""
    env = os.environ.get('FLASK_ENV', 'development')
    if env == 'production':
        return ProductionConfig()
    return DevelopmentConfig()
