"""
واجهة برمجة التطبيقات لإدارة المواعيد - Appointments API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from src.database import db
from src.models.appointment_model import Appointment
from src.models.patient_model import Patient
from src.middleware.auth_middleware import role_required, permission_required
from datetime import datetime

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('/', methods=['GET'])
@jwt_required()
@permission_required('manage_crm')
def get_appointments():
    """الحصول على قائمة المواعيد"""
    try:
        # معاملات الاستعلام
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        patient_id = request.args.get('patient_id')
        status = request.args.get('status')
        appointment_type = request.args.get('type')
        date_from = request.args.get('date_from')
        date_to = request.args.get('date_to')
        
        # بناء الاستعلام
        query = Appointment.query
        
        if patient_id:
            query = query.filter_by(patient_id=patient_id)
        if status:
            query = query.filter_by(status=status)
        if appointment_type:
            query = query.filter_by(appointment_type=appointment_type)
        if date_from:
            query = query.filter(Appointment.appointment_date >= datetime.fromisoformat(date_from))
        if date_to:
            query = query.filter(Appointment.appointment_date <= datetime.fromisoformat(date_to))
        
        # الترتيب والترقيم
        query = query.order_by(Appointment.appointment_date.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'appointments': [appointment.to_dict() for appointment in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<appointment_id>', methods=['GET'])
@jwt_required()
@permission_required('manage_crm')
def get_appointment(appointment_id):
    """الحصول على تفاصيل موعد محدد"""
    try:
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'الموعد غير موجود'}), 404
        
        return jsonify({
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/', methods=['POST'])
@jwt_required()
@permission_required('create_appointment')
def create_appointment():
    """إنشاء موعد جديد"""
    try:
        data = request.get_json()
        
        # التحقق من البيانات المطلوبة
        required_fields = ['patient_id', 'appointment_date', 'appointment_type', 'department']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'الحقل {field} مطلوب'}), 400
        
        # التحقق من وجود المريض
        patient = Patient.query.get(data['patient_id'])
        if not patient:
            return jsonify({'error': 'المريض غير موجود'}), 404
        
        # إنشاء الموعد
        appointment = Appointment(
            patient_id=data['patient_id'],
            appointment_date=datetime.fromisoformat(data['appointment_date']),
            appointment_type=data['appointment_type'],
            department=data['department'],
            doctor_name=data.get('doctor_name'),
            status=data.get('status', 'scheduled'),
            notes=data.get('notes'),
            reminder_sent=data.get('reminder_sent', False)
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء الموعد بنجاح',
            'appointment': appointment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<appointment_id>', methods=['PUT'])
@jwt_required()
@permission_required('edit_appointment')
def update_appointment(appointment_id):
    """تحديث موعد"""
    try:
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'الموعد غير موجود'}), 404
        
        data = request.get_json()
        
        # تحديث الحقول
        if 'appointment_date' in data:
            appointment.appointment_date = datetime.fromisoformat(data['appointment_date'])
        if 'appointment_type' in data:
            appointment.appointment_type = data['appointment_type']
        if 'department' in data:
            appointment.department = data['department']
        if 'doctor_name' in data:
            appointment.doctor_name = data['doctor_name']
        if 'status' in data:
            appointment.status = data['status']
        if 'notes' in data:
            appointment.notes = data['notes']
        if 'reminder_sent' in data:
            appointment.reminder_sent = data['reminder_sent']
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث الموعد بنجاح',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<appointment_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_appointment(appointment_id):
    """حذف موعد"""
    try:
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'الموعد غير موجود'}), 404
        
        db.session.delete(appointment)
        db.session.commit()
        
        return jsonify({
            'message': 'تم حذف الموعد بنجاح'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<appointment_id>/cancel', methods=['POST'])
@jwt_required()
@permission_required('edit_appointment')
def cancel_appointment(appointment_id):
    """إلغاء موعد"""
    try:
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'الموعد غير موجود'}), 404
        
        appointment.status = 'cancelled'
        db.session.commit()
        
        return jsonify({
            'message': 'تم إلغاء الموعد بنجاح',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<appointment_id>/complete', methods=['POST'])
@jwt_required()
@permission_required('edit_appointment')
def complete_appointment(appointment_id):
    """تعليم موعد كمكتمل"""
    try:
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({'error': 'الموعد غير موجود'}), 404
        
        appointment.status = 'completed'
        db.session.commit()
        
        return jsonify({
            'message': 'تم تعليم الموعد كمكتمل',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/stats', methods=['GET'])
@jwt_required()
@permission_required('view_reports')
def get_appointment_stats():
    """الحصول على إحصائيات المواعيد"""
    try:
        stats = {
            'total': Appointment.query.count(),
            'scheduled': Appointment.query.filter_by(status='scheduled').count(),
            'completed': Appointment.query.filter_by(status='completed').count(),
            'cancelled': Appointment.query.filter_by(status='cancelled').count(),
            'no_show': Appointment.query.filter_by(status='no_show').count()
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
