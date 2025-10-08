"""
واجهة برمجة التطبيقات لإدارة المرضى - Patients API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from src.database import db
from src.models.patient_model import Patient
from src.middleware.auth_middleware import role_required, permission_required
from datetime import datetime

patients_bp = Blueprint('patients', __name__)

@patients_bp.route('/', methods=['GET'])
@jwt_required()
@permission_required('manage_crm')
def get_patients():
    """الحصول على قائمة المرضى"""
    try:
        # معاملات الاستعلام
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search')
        gender = request.args.get('gender')
        
        # بناء الاستعلام
        query = Patient.query
        
        if search:
            query = query.filter(
                db.or_(
                    Patient.full_name.ilike(f'%{search}%'),
                    Patient.email.ilike(f'%{search}%'),
                    Patient.phone.ilike(f'%{search}%'),
                    Patient.national_id.ilike(f'%{search}%')
                )
            )
        if gender:
            query = query.filter_by(gender=gender)
        
        # الترتيب والترقيم
        query = query.order_by(Patient.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'patients': [patient.to_dict() for patient in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/<patient_id>', methods=['GET'])
@jwt_required()
@permission_required('manage_crm')
def get_patient(patient_id):
    """الحصول على تفاصيل مريض محدد"""
    try:
        patient = Patient.query.get(patient_id)
        
        if not patient:
            return jsonify({'error': 'المريض غير موجود'}), 404
        
        return jsonify({
            'patient': patient.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/', methods=['POST'])
@jwt_required()
@permission_required('create_patient')
def create_patient():
    """إنشاء مريض جديد"""
    try:
        data = request.get_json()
        
        # التحقق من البيانات المطلوبة
        required_fields = ['full_name', 'phone', 'gender']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'الحقل {field} مطلوب'}), 400
        
        # التحقق من عدم وجود البريد الإلكتروني مسبقاً
        if data.get('email') and Patient.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'البريد الإلكتروني مسجل مسبقاً'}), 400
        
        # التحقق من عدم وجود رقم الهوية مسبقاً
        if data.get('national_id') and Patient.query.filter_by(national_id=data['national_id']).first():
            return jsonify({'error': 'رقم الهوية مسجل مسبقاً'}), 400
        
        # إنشاء المريض
        patient = Patient(
            full_name=data['full_name'],
            email=data.get('email'),
            phone=data['phone'],
            national_id=data.get('national_id'),
            date_of_birth=datetime.fromisoformat(data['date_of_birth']).date() if data.get('date_of_birth') else None,
            gender=data['gender'],
            address=data.get('address'),
            city=data.get('city'),
            country=data.get('country', 'Saudi Arabia'),
            insurance_provider=data.get('insurance_provider'),
            insurance_number=data.get('insurance_number'),
            emergency_contact_name=data.get('emergency_contact_name'),
            emergency_contact_phone=data.get('emergency_contact_phone'),
            medical_history=data.get('medical_history'),
            notes=data.get('notes')
        )
        
        db.session.add(patient)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء المريض بنجاح',
            'patient': patient.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/<patient_id>', methods=['PUT'])
@jwt_required()
@permission_required('edit_patient')
def update_patient(patient_id):
    """تحديث مريض"""
    try:
        patient = Patient.query.get(patient_id)
        
        if not patient:
            return jsonify({'error': 'المريض غير موجود'}), 404
        
        data = request.get_json()
        
        # تحديث الحقول
        if 'full_name' in data:
            patient.full_name = data['full_name']
        if 'email' in data:
            patient.email = data['email']
        if 'phone' in data:
            patient.phone = data['phone']
        if 'national_id' in data:
            patient.national_id = data['national_id']
        if 'date_of_birth' in data:
            patient.date_of_birth = datetime.fromisoformat(data['date_of_birth']).date() if data['date_of_birth'] else None
        if 'gender' in data:
            patient.gender = data['gender']
        if 'address' in data:
            patient.address = data['address']
        if 'city' in data:
            patient.city = data['city']
        if 'country' in data:
            patient.country = data['country']
        if 'insurance_provider' in data:
            patient.insurance_provider = data['insurance_provider']
        if 'insurance_number' in data:
            patient.insurance_number = data['insurance_number']
        if 'emergency_contact_name' in data:
            patient.emergency_contact_name = data['emergency_contact_name']
        if 'emergency_contact_phone' in data:
            patient.emergency_contact_phone = data['emergency_contact_phone']
        if 'medical_history' in data:
            patient.medical_history = data['medical_history']
        if 'notes' in data:
            patient.notes = data['notes']
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث المريض بنجاح',
            'patient': patient.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/<patient_id>', methods=['DELETE'])
@jwt_required()
@role_required('admin')
def delete_patient(patient_id):
    """حذف مريض"""
    try:
        patient = Patient.query.get(patient_id)
        
        if not patient:
            return jsonify({'error': 'المريض غير موجود'}), 404
        
        db.session.delete(patient)
        db.session.commit()
        
        return jsonify({
            'message': 'تم حذف المريض بنجاح'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/stats', methods=['GET'])
@jwt_required()
@permission_required('view_reports')
def get_patient_stats():
    """الحصول على إحصائيات المرضى"""
    try:
        stats = {
            'total': Patient.query.count(),
            'male': Patient.query.filter_by(gender='male').count(),
            'female': Patient.query.filter_by(gender='female').count(),
            'with_insurance': Patient.query.filter(Patient.insurance_provider.isnot(None)).count()
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
