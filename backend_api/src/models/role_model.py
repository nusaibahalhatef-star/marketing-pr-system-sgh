"""
نموذج الدور - Role Model
"""

from src.database import db
from datetime import datetime
import uuid

# جدول وسيط للعلاقة بين الأدوار والصلاحيات
role_permission = db.Table('role_permission',
    db.Column('role_id', db.String(36), db.ForeignKey('roles.id'), primary_key=True),
    db.Column('permission_id', db.String(36), db.ForeignKey('permissions.id'), primary_key=True)
)

class Role(db.Model):
    """نموذج جدول الأدوار"""
    
    __tablename__ = 'roles'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(50), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # العلاقة مع الصلاحيات
    permissions = db.relationship('Permission', secondary=role_permission, lazy='subquery',
                                  backref=db.backref('roles', lazy=True))
    
    def to_dict(self):
        """تحويل الكائن إلى قاموس"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'permissions': [p.to_dict() for p in self.permissions],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Role {self.name}>'

class Permission(db.Model):
    """نموذج جدول الصلاحيات"""
    
    __tablename__ = 'permissions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    
    def to_dict(self):
        """تحويل الكائن إلى قاموس"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }
    
    def __repr__(self):
        return f'<Permission {self.name}>'
