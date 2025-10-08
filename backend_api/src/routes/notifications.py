"""
واجهة برمجة التطبيقات لإدارة الإشعارات - Notifications API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.database import db
from src.models.notification_model import Notification

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    """الحصول على إشعارات المستخدم الحالي"""
    try:
        current_user_id = get_jwt_identity()
        
        # معاملات الاستعلام
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        is_read = request.args.get('is_read')
        notification_type = request.args.get('type')
        
        # بناء الاستعلام
        query = Notification.query.filter_by(user_id=current_user_id)
        
        if is_read is not None:
            query = query.filter_by(is_read=is_read.lower() == 'true')
        if notification_type:
            query = query.filter_by(type=notification_type)
        
        # الترتيب والترقيم
        query = query.order_by(Notification.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'notifications': [notification.to_dict() for notification in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/<notification_id>', methods=['GET'])
@jwt_required()
def get_notification(notification_id):
    """الحصول على تفاصيل إشعار محدد"""
    try:
        current_user_id = get_jwt_identity()
        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=current_user_id
        ).first()
        
        if not notification:
            return jsonify({'error': 'الإشعار غير موجود'}), 404
        
        return jsonify({
            'notification': notification.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/', methods=['POST'])
@jwt_required()
def create_notification():
    """إنشاء إشعار جديد"""
    try:
        data = request.get_json()
        
        # التحقق من البيانات المطلوبة
        required_fields = ['user_id', 'title', 'message', 'type', 'priority']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'الحقل {field} مطلوب'}), 400
        
        # إنشاء الإشعار
        notification = Notification(
            user_id=data['user_id'],
            title=data['title'],
            message=data['message'],
            type=data['type'],
            priority=data['priority'],
            action_url=data.get('action_url')
        )
        
        db.session.add(notification)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء الإشعار بنجاح',
            'notification': notification.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/<notification_id>/read', methods=['POST'])
@jwt_required()
def mark_as_read(notification_id):
    """تعليم إشعار كمقروء"""
    try:
        current_user_id = get_jwt_identity()
        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=current_user_id
        ).first()
        
        if not notification:
            return jsonify({'error': 'الإشعار غير موجود'}), 404
        
        notification.mark_as_read()
        
        return jsonify({
            'message': 'تم تعليم الإشعار كمقروء',
            'notification': notification.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/read-all', methods=['POST'])
@jwt_required()
def mark_all_as_read():
    """تعليم جميع الإشعارات كمقروءة"""
    try:
        current_user_id = get_jwt_identity()
        
        Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).update({'is_read': True})
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم تعليم جميع الإشعارات كمقروءة'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/<notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """حذف إشعار"""
    try:
        current_user_id = get_jwt_identity()
        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=current_user_id
        ).first()
        
        if not notification:
            return jsonify({'error': 'الإشعار غير موجود'}), 404
        
        db.session.delete(notification)
        db.session.commit()
        
        return jsonify({
            'message': 'تم حذف الإشعار بنجاح'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@notifications_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_notification_stats():
    """الحصول على إحصائيات الإشعارات"""
    try:
        current_user_id = get_jwt_identity()
        
        stats = {
            'total': Notification.query.filter_by(user_id=current_user_id).count(),
            'unread': Notification.query.filter_by(user_id=current_user_id, is_read=False).count(),
            'read': Notification.query.filter_by(user_id=current_user_id, is_read=True).count()
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
