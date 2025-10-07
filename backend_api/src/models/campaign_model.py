"""
نموذج الحملة التسويقية - Campaign Model
"""

from src.database import db
from datetime import datetime
import uuid

class Campaign(db.Model):
    """نموذج جدول الحملات التسويقية"""
    
    __tablename__ = 'campaigns'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), nullable=False, index=True)
    budget = db.Column(db.Numeric(12, 2))
    spent = db.Column(db.Numeric(12, 2), default=0)
    start_date = db.Column(db.Date, nullable=False, index=True)
    end_date = db.Column(db.Date, index=True)
    target_audience = db.Column(db.Text)
    goals = db.Column(db.JSON)
    metrics = db.Column(db.JSON)
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'), index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # العلاقات
    tasks = db.relationship('Task', backref='campaign', lazy='dynamic')
    
    def to_dict(self):
        """تحويل الكائن إلى قاموس"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'type': self.type,
            'status': self.status,
            'budget': float(self.budget) if self.budget else None,
            'spent': float(self.spent) if self.spent else 0,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'target_audience': self.target_audience,
            'goals': self.goals,
            'metrics': self.metrics,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'creator': self.creator.to_dict() if self.creator else None
        }
    
    def __repr__(self):
        return f'<Campaign {self.name}>'
