"""
نموذج الموعد - Appointment Model
"""

from src.database import db
from datetime import datetime
import uuid

class Appointment(db.Model):
    """نموذج جدول المواعيد"""
    
    __tablename__ = 'appointments'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = db.Column(db.String(36), db.ForeignKey('patients.id'), nullable=False, index=True)
    appointment_date = db.Column(db.DateTime, nullable=False, index=True)
    department = db.Column(db.String(100), nullable=False)
    doctor_name = db.Column(db.String(255))
    appointment_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False, index=True)
    notes = db.Column(db.Text)
    reminder_sent = db.Column(db.Boolean, default=False)
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """تحويل الكائن إلى قاموس"""
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'appointment_date': self.appointment_date.isoformat() if self.appointment_date else None,
            'department': self.department,
            'doctor_name': self.doctor_name,
            'appointment_type': self.appointment_type,
            'status': self.status,
            'notes': self.notes,
            'reminder_sent': self.reminder_sent,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'patient': self.patient.to_dict() if self.patient else None
        }
    
    def __repr__(self):
        return f'<Appointment {self.id} - {self.appointment_date}>'
