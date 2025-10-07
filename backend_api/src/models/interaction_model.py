"""
نموذج التفاعل مع المريض - PatientInteraction Model
"""

from src.database import db
from datetime import datetime
import uuid

class PatientInteraction(db.Model):
    """نموذج جدول التفاعلات مع المرضى"""
    
    __tablename__ = 'patient_interactions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = db.Column(db.String(36), db.ForeignKey('patients.id'), nullable=False, index=True)
    interaction_type = db.Column(db.String(50), nullable=False, index=True)
    channel = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(255))
    description = db.Column(db.Text)
    outcome = db.Column(db.String(50))
    handled_by = db.Column(db.String(36), db.ForeignKey('users.id'), index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """تحويل الكائن إلى قاموس"""
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'interaction_type': self.interaction_type,
            'channel': self.channel,
            'subject': self.subject,
            'description': self.description,
            'outcome': self.outcome,
            'handled_by': self.handled_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'patient': self.patient.to_dict() if self.patient else None
        }
    
    def __repr__(self):
        return f'<PatientInteraction {self.id} - {self.interaction_type}>'
