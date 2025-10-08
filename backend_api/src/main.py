"""
نقطة الدخول الرئيسية لتطبيق Flask - نظام إدارة التسويق والعلاقات العامة
"""

import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from src.config import get_config
from src.database import db, init_postgresql, init_mongodb, close_mongodb

# استيراد واجهات برمجة التطبيقات
from src.routes.auth import auth_bp
from src.routes.tasks import tasks_bp
from src.routes.campaigns import campaigns_bp
from src.routes.users import users_bp
from src.routes.patients import patients_bp
from src.routes.notifications import notifications_bp

def create_app():
    """إنشاء وتكوين تطبيق Flask"""
    
    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
    
    # تحميل الإعدادات
    config = get_config()
    app.config.from_object(config)
    
    # تفعيل CORS
    CORS(app, resources={r"/api/*": {"origins": config.CORS_ORIGINS}})
    
    # تفعيل JWT
    jwt = JWTManager(app)
    
    # تهيئة قواعد البيانات
    init_postgresql(app)
    init_mongodb(app)
    
    # تسجيل واجهات برمجة التطبيقات
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    app.register_blueprint(campaigns_bp, url_prefix='/api/campaigns')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(patients_bp, url_prefix='/api/patients')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    
    # معالج الأخطاء العام
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'المورد غير موجود'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'خطأ داخلي في الخادم'}, 500
    
    # معالج JWT للأخطاء
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {'error': 'انتهت صلاحية الرمز'}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {'error': 'رمز غير صالح'}, 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {'error': 'رمز الوصول مطلوب'}, 401
    
    # مسار الصحة (Health Check)
    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy', 'message': 'النظام يعمل بشكل صحيح'}, 200
    
    # خدمة الواجهة الأمامية
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        static_folder_path = app.static_folder
        if static_folder_path is None:
            return "Static folder not configured", 404

        if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
            return send_from_directory(static_folder_path, path)
        else:
            index_path = os.path.join(static_folder_path, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(static_folder_path, 'index.html')
            else:
                return {'message': 'مرحباً بك في نظام إدارة التسويق والعلاقات العامة - المستشفى السعودي الألماني'}, 200
    
    # إغلاق اتصال MongoDB عند إيقاف التطبيق
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        if exception:
            db.session.rollback()
        db.session.remove()
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    print("=" * 50)
    print("نظام إدارة التسويق والعلاقات العامة")
    print("المستشفى السعودي الألماني")
    print("=" * 50)
    print(f"البيئة: {app.config['FLASK_ENV']}")
    print(f"المنفذ: 5000")
    print("=" * 50)
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=app.config['DEBUG'])
    except KeyboardInterrupt:
        print("\nإيقاف الخادم...")
        close_mongodb()
        print("تم إيقاف الخادم بنجاح")
