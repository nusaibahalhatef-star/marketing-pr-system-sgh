"""
واجهة برمجة التطبيقات لإدارة الأدوار والصلاحيات - Roles and Permissions API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from src.database import db
from src.models.role_model import Role, Permission
from src.middleware.auth_middleware import role_required, permission_required

roles_bp = Blueprint('roles', __name__)

# --- Endpoints لإدارة الصلاحيات ---

@roles_bp.route('/permissions', methods=['GET'])
@jwt_required()
@permission_required('manage_roles')
def get_permissions():
    """الحصول على قائمة بجميع الصلاحيات المتاحة"""
    permissions = Permission.query.all()
    return jsonify([p.to_dict() for p in permissions]), 200

# --- Endpoints لإدارة الأدوار ---

@roles_bp.route('/roles', methods=['GET'])
@jwt_required()
@permission_required('view_roles')
def get_roles():
    """الحصول على قائمة بجميع الأدوار"""
    roles = Role.query.all()
    return jsonify([r.to_dict() for r in roles]), 200

@roles_bp.route('/roles', methods=['POST'])
@jwt_required()
@permission_required('manage_roles')
def create_role():
    """إنشاء دور جديد"""
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    permission_ids = data.get('permission_ids', [])

    if not name:
        return jsonify({'error': 'اسم الدور مطلوب'}), 400

    if Role.query.filter_by(name=name).first():
        return jsonify({'error': 'الدور موجود بالفعل'}), 409

    new_role = Role(name=name, description=description)
    
    # إضافة الصلاحيات
    permissions = Permission.query.filter(Permission.id.in_(permission_ids)).all()
    new_role.permissions.extend(permissions)

    db.session.add(new_role)
    db.session.commit()
    
    return jsonify(new_role.to_dict()), 201

@roles_bp.route('/roles/<role_id>', methods=['PUT'])
@jwt_required()
@permission_required('manage_roles')
def update_role(role_id):
    """تحديث دور موجود"""
    role = Role.query.get(role_id)
    if not role:
        return jsonify({'error': 'الدور غير موجود'}), 404

    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    permission_ids = data.get('permission_ids')

    if name and name != role.name and Role.query.filter_by(name=name).first():
        return jsonify({'error': 'الدور موجود بالفعل'}), 409

    if name:
        role.name = name
    if description:
        role.description = description
    
    # تحديث الصلاحيات
    if permission_ids is not None:
        permissions = Permission.query.filter(Permission.id.in_(permission_ids)).all()
        role.permissions = permissions

    db.session.commit()
    return jsonify(role.to_dict()), 200

@roles_bp.route('/roles/<role_id>', methods=['DELETE'])
@jwt_required()
@permission_required('manage_roles')
def delete_role(role_id):
    """حذف دور"""
    role = Role.query.get(role_id)
    if not role:
        return jsonify({'error': 'الدور غير موجود'}), 404

    # منع حذف دور "admin" أو الأدوار المرتبطة بمستخدمين
    if role.name == 'admin':
        return jsonify({'error': 'لا يمكن حذف دور المدير الأساسي'}), 403
    
    if role.users.count() > 0:
        return jsonify({'error': 'لا يمكن حذف الدور المرتبط بمستخدمين'}), 403

    db.session.delete(role)
    db.session.commit()
    return jsonify({'message': 'تم حذف الدور بنجاح'}), 200
