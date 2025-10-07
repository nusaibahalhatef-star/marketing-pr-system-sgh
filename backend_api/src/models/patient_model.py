"""
نموذج المريض - Patient Model
"""

from src.database import db
from datetime import datetime
import uuid

class Patient(db.Model):
    """نموذج جدول المرضى"""
    
    __tablename__ = 'patients'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(255), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    phone = db.Column(db.String(20), nullable=False, index=True)
    email = db.Column(db.String(255), index=True)
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    national_id = db.Column(db.String(50), unique=True, index=True)
    insurance_provider = db.Column(db.String(255))
    insurance_number = db.Column(db.String(100))
    emergency_contact_name = db.Column(db.String(255))
    emergency_contact_phone = db.Column(db.String(20))
    registration_source = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # العلاقات
    appointments = db.relationship('Appointment', backref='patient', lazy='dynamic', cascade='all, delete-orphan')
    interactions = db.relationship('PatientInteraction', backref='patient', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self, include_sensitive=False):
        """تحويل الكائن إلى قاموس"""
        data = {
            'id': self.id,
            'patient_number': self.patient_number,
            'full_name': self.full_name,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'gender': self.gender,
            'phone': self.phone,
            'email': self.email,
            'city': self.city,
            'registration_source': self.registration_source,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_sensitive:
            data.update({
                'address': self.address,
                'national_id': self.national_id,
                'insurance_provider': self.insurance_provider,
                'insurance_number': self.insurance_number,
                'emergency_contact_name': self.emergency_contact_name,
                'emergency_contact_phone': self.emergency_contact_phone
            })
        
        return data
    
    def __repr__(self):
        return f'<Patient {self.patient_number} - {self.full_name}>'
