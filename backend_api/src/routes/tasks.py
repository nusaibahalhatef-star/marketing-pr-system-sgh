"""
واجهة برمجة التطبيقات لإدارة المهام - Tasks API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.database import db
from src.models.task_model import Task
from src.models.user_model import User
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    """الحصول على قائمة المهام"""
    try:
        current_user_id = get_jwt_identity()
        
        # معاملات الاستعلام
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        priority = request.args.get('priority')
        assigned_to = request.args.get('assigned_to')
        
        # بناء الاستعلام
        query = Task.query
        
        if status:
            query = query.filter_by(status=status)
        if priority:
            query = query.filter_by(priority=priority)
        if assigned_to:
            query = query.filter_by(assigned_to=assigned_to)
        else:
            # افتراضياً، عرض المهام المعينة للمستخدم الحالي
            query = query.filter_by(assigned_to=current_user_id)
        
        # الترتيب والترقيم
        query = query.order_by(Task.due_date.asc(), Task.priority.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'tasks': [task.to_dict() for task in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/<task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """الحصول على تفاصيل مهمة محددة"""
    try:
        task = Task.query.get(task_id)
        
        if not task:
            return jsonify({'error': 'المهمة غير موجودة'}), 404
        
        return jsonify({
            'task': task.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/', methods=['POST'])
@jwt_required()
def create_task():
    """إنشاء مهمة جديدة"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # التحقق من البيانات المطلوبة
        required_fields = ['title', 'status', 'priority']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'الحقل {field} مطلوب'}), 400
        
        # إنشاء المهمة
        task = Task(
            title=data['title'],
            description=data.get('description'),
            status=data['status'],
            priority=data['priority'],
            assigned_to=data.get('assigned_to'),
            assigned_by=current_user_id,
            campaign_id=data.get('campaign_id'),
            due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء المهمة بنجاح',
            'task': task.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/<task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    """تحديث مهمة"""
    try:
        task = Task.query.get(task_id)
        
        if not task:
            return jsonify({'error': 'المهمة غير موجودة'}), 404
        
        data = request.get_json()
        
        # تحديث الحقول
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'status' in data:
            task.status = data['status']
            if data['status'] == 'completed':
                task.completed_at = datetime.utcnow()
        if 'priority' in data:
            task.priority = data['priority']
        if 'assigned_to' in data:
            task.assigned_to = data['assigned_to']
        if 'due_date' in data:
            task.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث المهمة بنجاح',
            'task': task.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/<task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    """حذف مهمة"""
    try:
        task = Task.query.get(task_id)
        
        if not task:
            return jsonify({'error': 'المهمة غير موجودة'}), 404
        
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({
            'message': 'تم حذف المهمة بنجاح'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_task_stats():
    """الحصول على إحصائيات المهام"""
    try:
        current_user_id = get_jwt_identity()
        
        # إحصائيات المهام حسب الحالة
        stats = {
            'total': Task.query.filter_by(assigned_to=current_user_id).count(),
            'pending': Task.query.filter_by(assigned_to=current_user_id, status='pending').count(),
            'in_progress': Task.query.filter_by(assigned_to=current_user_id, status='in_progress').count(),
            'completed': Task.query.filter_by(assigned_to=current_user_id, status='completed').count(),
            'overdue': Task.query.filter(
                Task.assigned_to == current_user_id,
                Task.due_date < datetime.utcnow(),
                Task.status != 'completed'
            ).count()
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
