"""
واجهة برمجة التطبيقات لإدارة التفاعلات مع المرضى - Patient Interactions API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.database import db
from src.models.interaction_model import PatientInteraction
from src.models.patient_model import Patient
from src.middleware.auth_middleware import role_required, permission_required
from datetime import datetime

interactions_bp = Blueprint('interactions', __name__)

@interactions_bp.route('/', methods=['GET'])
@jwt_required()
@permission_required('manage_crm')
def get_interactions():
    """الحصول على قائمة التفاعلات مع المرضى"""
    try:
        # معاملات الاستعلام
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        patient_id = request.args.get('patient_id')
        interaction_type = request.args.get('type')
        date_from = request.args.get('date_from')
        date_to = request.args.get('date_to')
        
        # بناء الاستعلام
        query = PatientInteraction.query
        
        if patient_id:
            query = query.filter_by(patient_id=patient_id)
        if interaction_type:
            query = query.filter_by(interaction_type=interaction_type)
        if date_from:
            query = query.filter(PatientInteraction.interaction_date >= datetime.fromisoformat(date_from))
        if date_to:
            query = query.filter(PatientInteraction.interaction_date <= datetime.fromisoformat(date_to))
        
        # الترتيب والترقيم
        query = query.order_by(PatientInteraction.interaction_date.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'interactions': [interaction.to_dict() for interaction in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@interactions_bp.route('/<interaction_id>', methods=['GET'])
@jwt_required()
@permission_required('manage_crm')
def get_interaction(interaction_id):
    """الحصول على تفاصيل تفاعل محدد"""
    try:
        interaction = PatientInteraction.query.get(interaction_id)
        
        if not interaction:
            return jsonify({'error': 'التفاعل غير موجود'}), 404
        
        return jsonify({
            'interaction': interaction.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@interactions_bp.route('/', methods=['POST'])
@jwt_required()
@permission_required('create_interaction')
def create_interaction():
    """إنشاء تفاعل جديد مع مريض"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # التحقق من البيانات المطلوبة
        required_fields = ['patient_id', 'interaction_type', 'subject']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'الحقل {field} مطلوب'}), 400
        
        # التحقق من وجود المريض
        patient = Patient.query.get(data['patient_id'])
        if not patient:
            return jsonify({'error': 'المريض غير موجود'}), 404
        
        # إنشاء التفاعل
        interaction = PatientInteraction(
            patient_id=data['patient_id'],
            interaction_type=data['interaction_type'],
            interaction_date=datetime.fromisoformat(data['interaction_date']) if data.get('interaction_date') else datetime.utcnow(),
            subject=data['subject'],
            description=data.get('description'),
            outcome=data.get('outcome'),
            follow_up_required=data.get('follow_up_required', False),
            follow_up_date=datetime.fromisoformat(data['follow_up_date']) if data.get('follow_up_date') else None,
            handled_by=current_user_id
        )
        
        db.session.add(interaction)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء التفاعل بنجاح',
            'interaction': interaction.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@interactions_bp.route('/<interaction_id>', methods=['PUT'])
@jwt_required()
@permission_required('create_interaction')
def update_interaction(interaction_id):
    """تحديث تفاعل"""
    try:
        interaction = PatientInteraction.query.get(interaction_id)
        
        if not interaction:
            return jsonify({'error': 'التفاعل غير موجود'}), 404
        
        data = request.get_json()
        
        # تحديث الحقول
        if 'interaction_type' in data:
            interaction.interaction_type = data['interaction_type']
        if 'interaction_date' in data:
            interaction.interaction_date = datetime.fromisoformat(data['interaction_date'])
        if 'subject' in data:
            interaction.subject = data['subject']
        if 'description' in data:
            interaction.description = data['description']
        if 'outcome' in data:
            interaction.outcome = data['outcome']
        if 'follow_up_required' in data:
            interaction.follow_up_required = data['follow_up_required']
        if 'follow_up_date' in data:
            interaction.follow_up_date = datetime.fromisoformat(data['follow_up_date']) if data['follow_up_date'] else None
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث التفاعل بنجاح',
            'interaction': interaction.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@interactions_bp.route('/<interaction_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_interaction(interaction_id):
    """حذف تفاعل"""
    try:
        interaction = PatientInteraction.query.get(interaction_id)
        
        if not interaction:
            return jsonify({'error': 'التفاعل غير موجود'}), 404
        
        db.session.delete(interaction)
        db.session.commit()
        
        return jsonify({
            'message': 'تم حذف التفاعل بنجاح'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@interactions_bp.route('/stats', methods=['GET'])
@jwt_required()
@permission_required('view_reports')
def get_interaction_stats():
    """الحصول على إحصائيات التفاعلات"""
    try:
        stats = {
            'total': PatientInteraction.query.count(),
            'by_type': {
                'call': PatientInteraction.query.filter_by(interaction_type='call').count(),
                'email': PatientInteraction.query.filter_by(interaction_type='email').count(),
                'sms': PatientInteraction.query.filter_by(interaction_type='sms').count(),
                'visit': PatientInteraction.query.filter_by(interaction_type='visit').count(),
                'whatsapp': PatientInteraction.query.filter_by(interaction_type='whatsapp').count()
            },
            'follow_up_required': PatientInteraction.query.filter_by(follow_up_required=True).count()
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@interactions_bp.route('/follow-ups', methods=['GET'])
@jwt_required()
@permission_required('manage_crm')
def get_follow_ups():
    """الحصول على قائمة التفاعلات التي تتطلب متابعة"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = PatientInteraction.query.filter_by(follow_up_required=True)
        query = query.order_by(PatientInteraction.follow_up_date.asc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'follow_ups': [interaction.to_dict() for interaction in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
