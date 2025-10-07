"""
نموذج المهمة - Task Model
"""

from src.database import db
from datetime import datetime
import uuid

class Task(db.Model):
    """نموذج جدول المهام"""
    
    __tablename__ = 'tasks'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), nullable=False, index=True)
    priority = db.Column(db.String(20), nullable=False)
    assigned_to = db.Column(db.String(36), db.ForeignKey('users.id'), index=True)
    assigned_by = db.Column(db.String(36), db.ForeignKey('users.id'))
    campaign_id = db.Column(db.String(36), db.ForeignKey('campaigns.id'), index=True)
    due_date = db.Column(db.DateTime, index=True)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """تحويل الكائن إلى قاموس"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'assigned_to': self.assigned_to,
            'assigned_by': self.assigned_by,
            'campaign_id': self.campaign_id,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'assignee': self.assignee.to_dict() if self.assignee else None,
            'creator': self.creator.to_dict() if self.creator else None
        }
    
    def __repr__(self):
        return f'<Task {self.title}>'
