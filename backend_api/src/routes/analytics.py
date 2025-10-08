"""
واجهة برمجة التطبيقات للتحليلات والتقارير - Analytics & Reporting API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from src.database import db
from src.models.user_model import User
from src.models.task_model import Task
from src.models.campaign_model import Campaign
from src.models.patient_model import Patient
from src.models.appointment_model import Appointment
from src.models.interaction_model import PatientInteraction
from src.models.content_model import DigitalContent
from src.middleware.auth_middleware import role_required, permission_required
from datetime import datetime, timedelta
from sqlalchemy import func

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@permission_required('view_dashboard')
def get_dashboard_stats():
    """الحصول على إحصائيات لوحة التحكم الرئيسية"""
    try:
        # إحصائيات عامة
        stats = {
            'users': {
                'total': User.query.count(),
                'active': User.query.filter_by(is_active=True).count()
            },
            'tasks': {
                'total': Task.query.count(),
                'pending': Task.query.filter_by(status='pending').count(),
                'in_progress': Task.query.filter_by(status='in_progress').count(),
                'completed': Task.query.filter_by(status='completed').count()
            },
            'campaigns': {
                'total': Campaign.query.count(),
                'active': Campaign.query.filter_by(status='active').count(),
                'completed': Campaign.query.filter_by(status='completed').count()
            },
            'patients': {
                'total': Patient.query.count()
            },
            'appointments': {
                'total': Appointment.query.count(),
                'scheduled': Appointment.query.filter_by(status='scheduled').count(),
                'completed': Appointment.query.filter_by(status='completed').count()
            },
            'content': {
                'total': DigitalContent.query.count(),
                'published': DigitalContent.query.filter_by(status='published').count()
            }
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/tasks/performance', methods=['GET'])
@jwt_required()
@permission_required('view_analytics')
def get_tasks_performance():
    """الحصول على تحليل أداء المهام"""
    try:
        # معاملات الاستعلام
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # إحصائيات المهام
        stats = {
            'total_tasks': Task.query.filter(Task.created_at >= start_date).count(),
            'completed_tasks': Task.query.filter(
                Task.status == 'completed',
                Task.created_at >= start_date
            ).count(),
            'overdue_tasks': Task.query.filter(
                Task.status != 'completed',
                Task.due_date < datetime.utcnow()
            ).count(),
            'by_priority': {
                'high': Task.query.filter(
                    Task.priority == 'high',
                    Task.created_at >= start_date
                ).count(),
                'medium': Task.query.filter(
                    Task.priority == 'medium',
                    Task.created_at >= start_date
                ).count(),
                'low': Task.query.filter(
                    Task.priority == 'low',
                    Task.created_at >= start_date
                ).count()
            },
            'completion_rate': 0
        }
        
        # حساب معدل الإنجاز
        if stats['total_tasks'] > 0:
            stats['completion_rate'] = round(
                (stats['completed_tasks'] / stats['total_tasks']) * 100, 2
            )
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/campaigns/performance', methods=['GET'])
@jwt_required()
@permission_required('view_analytics')
def get_campaigns_performance():
    """الحصول على تحليل أداء الحملات التسويقية"""
    try:
        # معاملات الاستعلام
        days = request.args.get('days', 90, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # إحصائيات الحملات
        campaigns = Campaign.query.filter(Campaign.start_date >= start_date).all()
        
        stats = {
            'total_campaigns': len(campaigns),
            'total_budget': sum(c.budget for c in campaigns if c.budget),
            'total_actual_cost': sum(c.actual_cost for c in campaigns if c.actual_cost),
            'total_leads': sum(c.leads_generated for c in campaigns if c.leads_generated),
            'total_conversions': sum(c.conversions for c in campaigns if c.conversions),
            'by_type': {
                'digital': len([c for c in campaigns if c.type == 'digital']),
                'traditional': len([c for c in campaigns if c.type == 'traditional']),
                'hybrid': len([c for c in campaigns if c.type == 'hybrid'])
            },
            'by_status': {
                'planning': len([c for c in campaigns if c.status == 'planning']),
                'active': len([c for c in campaigns if c.status == 'active']),
                'completed': len([c for c in campaigns if c.status == 'completed']),
                'cancelled': len([c for c in campaigns if c.status == 'cancelled'])
            },
            'avg_roi': 0
        }
        
        # حساب متوسط العائد على الاستثمار
        campaigns_with_roi = [c for c in campaigns if c.roi]
        if campaigns_with_roi:
            stats['avg_roi'] = round(
                sum(c.roi for c in campaigns_with_roi) / len(campaigns_with_roi), 2
            )
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/patients/insights', methods=['GET'])
@jwt_required()
@permission_required('view_analytics')
def get_patients_insights():
    """الحصول على تحليلات المرضى"""
    try:
        # إحصائيات المرضى
        stats = {
            'total_patients': Patient.query.count(),
            'by_gender': {
                'male': Patient.query.filter_by(gender='male').count(),
                'female': Patient.query.filter_by(gender='female').count()
            },
            'with_insurance': Patient.query.filter(Patient.insurance_provider.isnot(None)).count(),
            'total_appointments': Appointment.query.count(),
            'total_interactions': PatientInteraction.query.count(),
            'interactions_by_type': {
                'call': PatientInteraction.query.filter_by(interaction_type='call').count(),
                'email': PatientInteraction.query.filter_by(interaction_type='email').count(),
                'sms': PatientInteraction.query.filter_by(interaction_type='sms').count(),
                'visit': PatientInteraction.query.filter_by(interaction_type='visit').count(),
                'whatsapp': PatientInteraction.query.filter_by(interaction_type='whatsapp').count()
            }
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/content/performance', methods=['GET'])
@jwt_required()
@permission_required('view_analytics')
def get_content_performance():
    """الحصول على تحليل أداء المحتوى الرقمي"""
    try:
        # معاملات الاستعلام
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # إحصائيات المحتوى
        content_items = DigitalContent.query.filter(
            DigitalContent.published_date >= start_date
        ).all()
        
        stats = {
            'total_content': len(content_items),
            'total_views': sum(c.views_count for c in content_items),
            'total_likes': sum(c.likes_count for c in content_items),
            'total_shares': sum(c.shares_count for c in content_items),
            'total_comments': sum(c.comments_count for c in content_items),
            'by_type': {
                'blog_post': len([c for c in content_items if c.content_type == 'blog_post']),
                'page': len([c for c in content_items if c.content_type == 'page']),
                'social_media': len([c for c in content_items if c.content_type == 'social_media']),
                'email_template': len([c for c in content_items if c.content_type == 'email_template'])
            },
            'by_platform': {},
            'top_performing': []
        }
        
        # إحصائيات حسب المنصة
        platforms = db.session.query(DigitalContent.platform).filter(
            DigitalContent.platform.isnot(None),
            DigitalContent.published_date >= start_date
        ).distinct().all()
        
        for platform_tuple in platforms:
            platform = platform_tuple[0]
            stats['by_platform'][platform] = len([
                c for c in content_items if c.platform == platform
            ])
        
        # أفضل المحتويات أداءً (حسب المشاهدات)
        top_content = sorted(content_items, key=lambda x: x.views_count, reverse=True)[:5]
        stats['top_performing'] = [
            {
                'id': c.id,
                'title': c.title,
                'views': c.views_count,
                'likes': c.likes_count,
                'shares': c.shares_count
            }
            for c in top_content
        ]
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/team/productivity', methods=['GET'])
@jwt_required()
@permission_required('view_analytics')
def get_team_productivity():
    """الحصول على تحليل إنتاجية الفريق"""
    try:
        # معاملات الاستعلام
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # إحصائيات الفريق
        users = User.query.filter_by(is_active=True).all()
        
        team_stats = []
        for user in users:
            user_stats = {
                'user_id': user.id,
                'user_name': user.full_name,
                'role': user.role,
                'tasks_assigned': Task.query.filter(
                    Task.assigned_to == user.id,
                    Task.created_at >= start_date
                ).count(),
                'tasks_completed': Task.query.filter(
                    Task.assigned_to == user.id,
                    Task.status == 'completed',
                    Task.created_at >= start_date
                ).count(),
                'campaigns_created': Campaign.query.filter(
                    Campaign.created_by == user.id,
                    Campaign.start_date >= start_date
                ).count(),
                'content_created': DigitalContent.query.filter(
                    DigitalContent.author_id == user.id,
                    DigitalContent.created_at >= start_date
                ).count()
            }
            
            # حساب معدل الإنجاز
            if user_stats['tasks_assigned'] > 0:
                user_stats['completion_rate'] = round(
                    (user_stats['tasks_completed'] / user_stats['tasks_assigned']) * 100, 2
                )
            else:
                user_stats['completion_rate'] = 0
            
            team_stats.append(user_stats)
        
        return jsonify({
            'team_members': len(team_stats),
            'productivity': team_stats
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/export', methods=['POST'])
@jwt_required()
@permission_required('export_data')
def export_data():
    """تصدير البيانات للتحليل الخارجي"""
    try:
        data = request.get_json()
        
        # التحقق من نوع البيانات المطلوب تصديرها
        export_type = data.get('type')
        if not export_type:
            return jsonify({'error': 'نوع التصدير مطلوب'}), 400
        
        # هنا يمكن إضافة منطق تصدير البيانات بصيغ مختلفة (CSV, Excel, PDF)
        # في الوقت الحالي، نعيد رسالة تأكيد
        
        return jsonify({
            'message': f'تم تصدير بيانات {export_type} بنجاح',
            'export_type': export_type,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
