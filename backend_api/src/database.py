"""
إدارة الاتصالات بقواعد البيانات - PostgreSQL و MongoDB
"""

from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient
from src.config import get_config

# إنشاء كائن SQLAlchemy لـ PostgreSQL
db = SQLAlchemy()

# متغير عام لـ MongoDB client
mongo_client = None
mongo_db = None

def init_postgresql(app):
    """
    تهيئة اتصال PostgreSQL
    
    Args:
        app: تطبيق Flask
    """
    db.init_app(app)
    with app.app_context():
        db.create_all()
    print("✓ PostgreSQL database initialized successfully")

def init_mongodb(app):
    """
    تهيئة اتصال MongoDB
    
    Args:
        app: تطبيق Flask
    """
    global mongo_client, mongo_db
    
    config = get_config()
    
    try:
        mongo_client = MongoClient(config.MONGO_URI)
        mongo_db = mongo_client[config.MONGO_DB_NAME]
        
        # اختبار الاتصال
        mongo_client.server_info()
        print("✓ MongoDB database initialized successfully")
        
        # إنشاء الفهارس
        create_mongodb_indexes()
        
    except Exception as e:
        print(f"✗ Failed to connect to MongoDB: {e}")
        mongo_client = None
        mongo_db = None

def get_mongodb():
    """
    الحصول على كائن قاعدة بيانات MongoDB
    
    Returns:
        MongoDB database object
    """
    return mongo_db

def create_mongodb_indexes():
    """إنشاء الفهارس في MongoDB"""
    if mongo_db is None:
        return
    
    try:
        # فهارس مجموعة المحتوى الرقمي
        mongo_db.digital_content.create_index([("author_id", 1)])
        mongo_db.digital_content.create_index([("platform", 1)])
        mongo_db.digital_content.create_index([("status", 1)])
        mongo_db.digital_content.create_index([("published_date", -1)])
        mongo_db.digital_content.create_index([("tags", 1)])
        
        # فهارس مجموعة التحليلات
        mongo_db.analytics.create_index([("metric_type", 1)])
        mongo_db.analytics.create_index([("date", -1)])
        mongo_db.analytics.create_index([("source", 1)])
        
        # فهارس مجموعة السجلات
        mongo_db.logs.create_index([("log_type", 1)])
        mongo_db.logs.create_index([("user_id", 1)])
        mongo_db.logs.create_index([("timestamp", -1)])
        
        # فهارس مجموعة الرسائل
        mongo_db.messages.create_index([("sender_id", 1)])
        mongo_db.messages.create_index([("recipient_id", 1)])
        mongo_db.messages.create_index([("is_read", 1)])
        mongo_db.messages.create_index([("created_at", -1)])
        
        # فهارس مجموعة التقارير
        mongo_db.reports.create_index([("report_type", 1)])
        mongo_db.reports.create_index([("generated_by", 1)])
        mongo_db.reports.create_index([("created_at", -1)])
        
        print("✓ MongoDB indexes created successfully")
        
    except Exception as e:
        print(f"✗ Failed to create MongoDB indexes: {e}")

def close_mongodb():
    """إغلاق اتصال MongoDB"""
    global mongo_client
    if mongo_client:
        mongo_client.close()
        print("✓ MongoDB connection closed")
