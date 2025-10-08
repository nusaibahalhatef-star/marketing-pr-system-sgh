"""
واجهة برمجة التطبيقات لإدارة المحتوى الرقمي - Digital Content API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.database import db
from src.models.content_model import DigitalContent
from src.middleware.auth_middleware import role_required, permission_required
from datetime import datetime

content_bp = Blueprint('content', __name__)

@content_bp.route('/', methods=['GET'])
@jwt_required()
@permission_required('manage_content')
def get_content():
    """الحصول على قائمة المحتوى الرقمي"""
    try:
        # معاملات الاستعلام
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        content_type = request.args.get('type')
        platform = request.args.get('platform')
        status = request.args.get('status')
        category = request.args.get('category')
        search = request.args.get('search')
        
        # بناء الاستعلام
        query = DigitalContent.query
        
        if content_type:
            query = query.filter_by(content_type=content_type)
        if platform:
            query = query.filter_by(platform=platform)
        if status:
            query = query.filter_by(status=status)
        if category:
            query = query.filter_by(category=category)
        if search:
            query = query.filter(
                db.or_(
                    DigitalContent.title.ilike(f'%{search}%'),
                    DigitalContent.content_body.ilike(f'%{search}%')
                )
            )
        
        # الترتيب والترقيم
        query = query.order_by(DigitalContent.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'content': [content.to_dict() for content in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_bp.route('/<content_id>', methods=['GET'])
@jwt_required()
@permission_required('manage_content')
def get_content_item(content_id):
    """الحصول على تفاصيل محتوى محدد"""
    try:
        content = DigitalContent.query.get(content_id)
        
        if not content:
            return jsonify({'error': 'المحتوى غير موجود'}), 404
        
        return jsonify({
            'content': content.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@content_bp.route('/', methods=['POST'])
@jwt_required()
@permission_required('create_content')
def create_content():
    """إنشاء محتوى رقمي جديد"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # التحقق من البيانات المطلوبة
        required_fields = ['title', 'content_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'الحقل {field} مطلوب'}), 400
        
        # إنشاء المحتوى
        content = DigitalContent(
            title=data['title'],
            content_type=data['content_type'],
            platform=data.get('platform'),
            content_body=data.get('content_body'),
            excerpt=data.get('excerpt'),
            status=data.get('status', 'draft'),
            author_id=current_user_id,
            category=data.get('category'),
            tags=data.get('tags'),
            featured_image_url=data.get('featured_image_url'),
            seo_title=data.get('seo_title'),
            seo_description=data.get('seo_description'),
            seo_keywords=data.get('seo_keywords'),
            scheduled_date=datetime.fromisoformat(data['scheduled_date']) if data.get('scheduled_date') else None
        )
        
        db.session.add(content)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء المحتوى بنجاح',
            'content': content.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@content_bp.route('/<content_id>', methods=['PUT'])
@jwt_required()
@permission_required('edit_content')
def update_content(content_id):
    """تحديث محتوى رقمي"""
    try:
        content = DigitalContent.query.get(content_id)
        
        if not content:
            return jsonify({'error': 'المحتوى غير موجود'}), 404
        
        data = request.get_json()
        
        # تحديث الحقول
        if 'title' in data:
            content.title = data['title']
        if 'content_type' in data:
            content.content_type = data['content_type']
        if 'platform' in data:
            content.platform = data['platform']
        if 'content_body' in data:
            content.content_body = data['content_body']
        if 'excerpt' in data:
            content.excerpt = data['excerpt']
        if 'status' in data:
            content.status = data['status']
        if 'category' in data:
            content.category = data['category']
        if 'tags' in data:
            content.tags = data['tags']
        if 'featured_image_url' in data:
            content.featured_image_url = data['featured_image_url']
        if 'seo_title' in data:
            content.seo_title = data['seo_title']
        if 'seo_description' in data:
            content.seo_description = data['seo_description']
        if 'seo_keywords' in data:
            content.seo_keywords = data['seo_keywords']
        if 'scheduled_date' in data:
            content.scheduled_date = datetime.fromisoformat(data['scheduled_date']) if data['scheduled_date'] else None
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث المحتوى بنجاح',
            'content': content.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@content_bp.route('/<content_id>', methods=['DELETE'])
@jwt_required()
@permission_required('delete_content')
def delete_content(content_id):
    """حذف محتوى رقمي"""
    try:
        content = DigitalContent.query.get(content_id)
        
        if not content:
            return jsonify({'error': 'المحتوى غير موجود'}), 404
        
        db.session.delete(content)
        db.session.commit()
        
        return jsonify({
            'message': 'تم حذف المحتوى بنجاح'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@content_bp.route('/<content_id>/publish', methods=['POST'])
@jwt_required()
@permission_required('edit_content')
def publish_content(content_id):
    """نشر محتوى رقمي"""
    try:
        content = DigitalContent.query.get(content_id)
        
        if not content:
            return jsonify({'error': 'المحتوى غير موجود'}), 404
        
        content.status = 'published'
        content.published_date = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'تم نشر المحتوى بنجاح',
            'content': content.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@content_bp.route('/<content_id>/archive', methods=['POST'])
@jwt_required()
@permission_required('edit_content')
def archive_content(content_id):
    """أرشفة محتوى رقمي"""
    try:
        content = DigitalContent.query.get(content_id)
        
        if not content:
            return jsonify({'error': 'المحتوى غير موجود'}), 404
        
        content.status = 'archived'
        db.session.commit()
        
        return jsonify({
            'message': 'تم أرشفة المحتوى بنجاح',
            'content': content.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@content_bp.route('/stats', methods=['GET'])
@jwt_required()
@permission_required('view_reports')
def get_content_stats():
    """الحصول على إحصائيات المحتوى الرقمي"""
    try:
        stats = {
            'total': DigitalContent.query.count(),
            'by_status': {
                'draft': DigitalContent.query.filter_by(status='draft').count(),
                'scheduled': DigitalContent.query.filter_by(status='scheduled').count(),
                'published': DigitalContent.query.filter_by(status='published').count(),
                'archived': DigitalContent.query.filter_by(status='archived').count()
            },
            'by_type': {
                'blog_post': DigitalContent.query.filter_by(content_type='blog_post').count(),
                'page': DigitalContent.query.filter_by(content_type='page').count(),
                'social_media': DigitalContent.query.filter_by(content_type='social_media').count(),
                'email_template': DigitalContent.query.filter_by(content_type='email_template').count()
            },
            'total_views': db.session.query(db.func.sum(DigitalContent.views_count)).scalar() or 0,
            'total_likes': db.session.query(db.func.sum(DigitalContent.likes_count)).scalar() or 0,
            'total_shares': db.session.query(db.func.sum(DigitalContent.shares_count)).scalar() or 0
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
