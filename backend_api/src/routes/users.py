"""
واجهة برمجة التطبيقات لإدارة المستخدمين - Users API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from src.database import db
from src.models.user_model import User
from src.middleware.auth_middleware import role_required, permission_required

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@jwt_required()
@permission_required('manage_users')
def get_users():
    """الحصول على قائمة المستخدمين"""
    try:
        # معاملات الاستعلام
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        role_id = request.args.get('role_id')
        is_active = request.args.get('is_active')
        search = request.args.get('search')
        
        # بناء الاستعلام
        query = User.query
        
        if role_id:
            query = query.filter_by(role_id=role_id)
        if is_active is not None:
            query = query.filter_by(is_active=is_active.lower() == 'true')
        if search:
            query = query.filter(
                db.or_(
                    User.full_name.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%')
                )
            )
        
        # الترتيب والترقيم
        query = query.order_by(User.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'users': [user.to_dict() for user in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
@permission_required('manage_users')
def get_user(user_id):
    """الحصول على تفاصيل مستخدم محدد"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'المستخدم غير موجود'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/<user_id>', methods=['PUT'])
@jwt_required()
@permission_required('manage_users')
def update_user(user_id):
    """تحديث مستخدم"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'المستخدم غير موجود'}), 404
        
        data = request.get_json()
        
        # تحديث الحقول
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'role_id' in data:
            user.role_id = data['role_id']
        if 'department' in data:
            user.department = data['department']
        if 'is_active' in data:
            user.is_active = data['is_active']
        if 'avatar_url' in data:
            user.avatar_url = data['avatar_url']
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث المستخدم بنجاح',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@users_bp.route('/<user_id>', methods=['DELETE'])
@jwt_required()
@permission_required('manage_users')
def delete_user(user_id):
    """حذف مستخدم"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'المستخدم غير موجود'}), 404
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'message': 'تم حذف المستخدم بنجاح'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@users_bp.route('/stats', methods=['GET'])
@jwt_required()
@permission_required('manage_users')
def get_user_stats():
    """الحصول على إحصائيات المستخدمين"""
    try:
        # إحصائيات المستخدمين حسب الدور
        stats = {
            'total': User.query.count(),
            'active': User.query.filter_by(is_active=True).count(),
            'inactive': User.query.filter_by(is_active=False).count(),
            'by_role': {}
        }
        
        # إحصائيات حسب الدور
        roles = Role.query.all()
        
        for role in roles:
            stats['by_role'][role.name] = User.query.filter_by(role_id=role.id).count()
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/<user_id>/activate', methods=['POST'])
@jwt_required()
@permission_required('manage_users')
def activate_user(user_id):
    """تفعيل حساب مستخدم"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'المستخدم غير موجود'}), 404
        
        user.is_active = True
        db.session.commit()
        
        return jsonify({
            'message': 'تم تفعيل الحساب بنجاح',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@users_bp.route('/<user_id>/deactivate', methods=['POST'])
@jwt_required()
@permission_required('manage_users')
def deactivate_user(user_id):
    """تعطيل حساب مستخدم"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'المستخدم غير موجود'}), 404
        
        user.is_active = False
        db.session.commit()
        
        return jsonify({
            'message': 'تم تعطيل الحساب بنجاح',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
