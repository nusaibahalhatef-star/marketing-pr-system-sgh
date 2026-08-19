"""
واجهة برمجة التطبيقات للمصادقة - Auth API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.database import db
from src.models.user_model import User
from src.models.role_model import Role

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """تسجيل مستخدم جديد (للاستخدام الداخلي فقط)"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    role_name = data.get('role', 'team_member')
    
    if not email or not password or not full_name:
        return jsonify({'error': 'الاسم الكامل، البريد الإلكتروني وكلمة المرور مطلوبة'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'البريد الإلكتروني مستخدم بالفعل'}), 409

    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return jsonify({'error': f'الدور {role_name} غير موجود'}), 400

    new_user = User(email=email, full_name=full_name, role_id=role.id)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(new_user.to_dict()), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """تسجيل دخول المستخدم"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if user and user.check_password(password):
        if not user.is_active:
            return jsonify({'error': 'الحساب غير نشط'}), 403
            
        # تحديث آخر تسجيل دخول
        user.last_login = db.func.now()
        db.session.commit()
        
        # إنشاء رمز الوصول
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user=user.to_dict()), 200
    
    return jsonify({'error': 'بيانات اعتماد غير صحيحة'}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """الحصول على بيانات المستخدم الحالي"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'المستخدم غير موجود'}), 404
        
    return jsonify(user.to_dict()), 200

@auth_bp.route('/health', methods=['GET'])
def health_check():
    """مسار الصحة للمصادقة"""
    return jsonify({'status': 'healthy', 'message': 'Auth API is running'}), 200
