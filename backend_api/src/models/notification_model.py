"""
نموذج الإشعار - Notification Model
"""

from src.database import db
from datetime import datetime
import uuid

class Notification(db.Model):
    """نموذج جدول الإشعارات"""
    
    __tablename__ = 'notifications'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.String(20), nullable=False)
    is_read = db.Column(db.Boolean, default=False, index=True)
    action_url = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """تحويل الكائن إلى قاموس"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'priority': self.priority,
            'is_read': self.is_read,
            'action_url': self.action_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def mark_as_read(self):
        """تعليم الإشعار كمقروء"""
        self.is_read = True
        db.session.commit()
    
    def __repr__(self):
        return f'<Notification {self.id} - {self.title}>'
