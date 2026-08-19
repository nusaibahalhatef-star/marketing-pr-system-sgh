"""
إعدادات قاعدة البيانات - Database Configuration
"""

from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient
from src.config import get_config

db = SQLAlchemy()
mongo_client = None

def init_postgresql(app):
    """تهيئة قاعدة بيانات PostgreSQL"""
    db.init_app(app)
    with app.app_context():
        # التأكد من إنشاء الجداول
        db.create_all()
        print("✓ PostgreSQL database initialized successfully")

def init_mongodb(app):
    """تهيئة قاعدة بيانات MongoDB"""
    global mongo_client
    config = get_config()
    try:
        mongo_client = MongoClient(config.MONGO_URI)
        # اختبار الاتصال
        mongo_client.admin.command('ping')
        print("✓ MongoDB connected successfully")
    except Exception as e:
        print(f"✗ Failed to connect to MongoDB: {e}")
        mongo_client = None

def close_mongodb():
    """إغلاق اتصال MongoDB"""
    global mongo_client
    if mongo_client:
        mongo_client.close()
        print("✓ MongoDB connection closed")
