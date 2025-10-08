"""
Middleware للتحقق من الصلاحيات - Authorization Middleware
"""

from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from src.models.user_model import User

def role_required(*allowed_roles):
    """
    Decorator للتحقق من أن المستخدم لديه أحد الأدوار المسموح بها
    
    الاستخدام:
    @role_required('admin', 'marketing_manager')
    def some_function():
        pass
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                # التحقق من وجود JWT صالح
                verify_jwt_in_request()
                
                # الحصول على معرف المستخدم من JWT
                current_user_id = get_jwt_identity()
                
                # البحث عن المستخدم
                user = User.query.get(current_user_id)
                
                if not user:
                    return jsonify({'error': 'المستخدم غير موجود'}), 404
                
                if not user.is_active:
                    return jsonify({'error': 'الحساب غير نشط'}), 403
                
                # التحقق من الدور
                if user.role not in allowed_roles:
                    return jsonify({
                        'error': 'ليس لديك صلاحية للوصول إلى هذا المورد',
                        'required_roles': list(allowed_roles),
                        'your_role': user.role
                    }), 403
                
                return fn(*args, **kwargs)
                
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        return wrapper
    return decorator

def permission_required(permission_name):
    """
    Decorator للتحقق من أن المستخدم لديه صلاحية محددة
    
    الاستخدام:
    @permission_required('create_campaign')
    def some_function():
        pass
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                # التحقق من وجود JWT صالح
                verify_jwt_in_request()
                
                # الحصول على معرف المستخدم من JWT
                current_user_id = get_jwt_identity()
                
                # البحث عن المستخدم
                user = User.query.get(current_user_id)
                
                if not user:
                    return jsonify({'error': 'المستخدم غير موجود'}), 404
                
                if not user.is_active:
                    return jsonify({'error': 'الحساب غير نشط'}), 403
                
                # التحقق من الصلاحية
                if not user.has_permission(permission_name):
                    return jsonify({
                        'error': 'ليس لديك صلاحية لتنفيذ هذا الإجراء',
                        'required_permission': permission_name
                    }), 403
                
                return fn(*args, **kwargs)
                
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        return wrapper
    return decorator

def get_current_user():
    """
    دالة مساعدة للحصول على المستخدم الحالي
    """
    try:
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        return user
    except:
        return None
