"""
نموذج المحتوى الرقمي - Digital Content Model
"""

from src.database import db
from datetime import datetime
import uuid

class DigitalContent(db.Model):
    """نموذج جدول المحتوى الرقمي"""
    
    __tablename__ = 'digital_content'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(500), nullable=False)
    content_type = db.Column(db.String(50), nullable=False, index=True)  # blog_post, page, social_media, email_template
    platform = db.Column(db.String(50))  # facebook, twitter, instagram, linkedin, website
    content_body = db.Column(db.Text)
    excerpt = db.Column(db.Text)
    status = db.Column(db.String(50), default='draft', index=True)  # draft, scheduled, published, archived
    author_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    category = db.Column(db.String(100))
    tags = db.Column(db.Text)  # JSON array stored as text
    featured_image_url = db.Column(db.Text)
    seo_title = db.Column(db.String(255))
    seo_description = db.Column(db.Text)
    seo_keywords = db.Column(db.Text)
    scheduled_date = db.Column(db.DateTime)
    published_date = db.Column(db.DateTime)
    views_count = db.Column(db.Integer, default=0)
    likes_count = db.Column(db.Integer, default=0)
    shares_count = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # العلاقات
    author = db.relationship('User', backref='content_created', lazy=True)
    
    def to_dict(self):
        """تحويل الكائن إلى قاموس"""
        return {
            'id': self.id,
            'title': self.title,
            'content_type': self.content_type,
            'platform': self.platform,
            'content_body': self.content_body,
            'excerpt': self.excerpt,
            'status': self.status,
            'author_id': self.author_id,
            'author_name': self.author.full_name if self.author else None,
            'category': self.category,
            'tags': self.tags,
            'featured_image_url': self.featured_image_url,
            'seo_title': self.seo_title,
            'seo_description': self.seo_description,
            'seo_keywords': self.seo_keywords,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'published_date': self.published_date.isoformat() if self.published_date else None,
            'views_count': self.views_count,
            'likes_count': self.likes_count,
            'shares_count': self.shares_count,
            'comments_count': self.comments_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<DigitalContent {self.title}>'
