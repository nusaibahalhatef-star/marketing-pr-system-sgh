"""
وسيط المصادقة والتحقق من الصلاحيات - Auth Middleware
"""

from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from src.models.user_model import User

def permission_required(permission_name):
    """
    ديكوريتور للتحقق من أن المستخدم لديه صلاحية محددة
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user or not user.has_permission(permission_name):
                return jsonify({'error': 'غير مصرح لك بالوصول: صلاحية مفقودة'}), 403
            
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def role_required(role_name):
    """
    ديكوريتور للتحقق من أن المستخدم لديه دور محدد
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user or (user.role and user.role.name != role_name):
                return jsonify({'error': 'غير مصرح لك بالوصول: دور غير صحيح'}), 403
            
            return fn(*args, **kwargs)
        return decorator
    return wrapper
