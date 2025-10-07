"""
واجهة برمجة التطبيقات لإدارة الحملات التسويقية - Campaigns API
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.database import db
from src.models.campaign_model import Campaign
from datetime import datetime, date

campaigns_bp = Blueprint('campaigns', __name__)

@campaigns_bp.route('/', methods=['GET'])
@jwt_required()
def get_campaigns():
    """الحصول على قائمة الحملات التسويقية"""
    try:
        # معاملات الاستعلام
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        campaign_type = request.args.get('type')
        
        # بناء الاستعلام
        query = Campaign.query
        
        if status:
            query = query.filter_by(status=status)
        if campaign_type:
            query = query.filter_by(type=campaign_type)
        
        # الترتيب والترقيم
        query = query.order_by(Campaign.start_date.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'campaigns': [campaign.to_dict() for campaign in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/<campaign_id>', methods=['GET'])
@jwt_required()
def get_campaign(campaign_id):
    """الحصول على تفاصيل حملة محددة"""
    try:
        campaign = Campaign.query.get(campaign_id)
        
        if not campaign:
            return jsonify({'error': 'الحملة غير موجودة'}), 404
        
        return jsonify({
            'campaign': campaign.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/', methods=['POST'])
@jwt_required()
def create_campaign():
    """إنشاء حملة تسويقية جديدة"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # التحقق من البيانات المطلوبة
        required_fields = ['name', 'type', 'status', 'start_date']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'الحقل {field} مطلوب'}), 400
        
        # إنشاء الحملة
        campaign = Campaign(
            name=data['name'],
            description=data.get('description'),
            type=data['type'],
            status=data['status'],
            budget=data.get('budget'),
            start_date=datetime.fromisoformat(data['start_date']).date(),
            end_date=datetime.fromisoformat(data['end_date']).date() if data.get('end_date') else None,
            target_audience=data.get('target_audience'),
            goals=data.get('goals'),
            metrics=data.get('metrics'),
            created_by=current_user_id
        )
        
        db.session.add(campaign)
        db.session.commit()
        
        return jsonify({
            'message': 'تم إنشاء الحملة بنجاح',
            'campaign': campaign.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/<campaign_id>', methods=['PUT'])
@jwt_required()
def update_campaign(campaign_id):
    """تحديث حملة تسويقية"""
    try:
        campaign = Campaign.query.get(campaign_id)
        
        if not campaign:
            return jsonify({'error': 'الحملة غير موجودة'}), 404
        
        data = request.get_json()
        
        # تحديث الحقول
        if 'name' in data:
            campaign.name = data['name']
        if 'description' in data:
            campaign.description = data['description']
        if 'type' in data:
            campaign.type = data['type']
        if 'status' in data:
            campaign.status = data['status']
        if 'budget' in data:
            campaign.budget = data['budget']
        if 'spent' in data:
            campaign.spent = data['spent']
        if 'start_date' in data:
            campaign.start_date = datetime.fromisoformat(data['start_date']).date()
        if 'end_date' in data:
            campaign.end_date = datetime.fromisoformat(data['end_date']).date() if data['end_date'] else None
        if 'target_audience' in data:
            campaign.target_audience = data['target_audience']
        if 'goals' in data:
            campaign.goals = data['goals']
        if 'metrics' in data:
            campaign.metrics = data['metrics']
        
        db.session.commit()
        
        return jsonify({
            'message': 'تم تحديث الحملة بنجاح',
            'campaign': campaign.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/<campaign_id>', methods=['DELETE'])
@jwt_required()
def delete_campaign(campaign_id):
    """حذف حملة تسويقية"""
    try:
        campaign = Campaign.query.get(campaign_id)
        
        if not campaign:
            return jsonify({'error': 'الحملة غير موجودة'}), 404
        
        db.session.delete(campaign)
        db.session.commit()
        
        return jsonify({
            'message': 'تم حذف الحملة بنجاح'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_campaign_stats():
    """الحصول على إحصائيات الحملات"""
    try:
        # إحصائيات الحملات حسب الحالة
        stats = {
            'total': Campaign.query.count(),
            'active': Campaign.query.filter_by(status='active').count(),
            'planning': Campaign.query.filter_by(status='planning').count(),
            'completed': Campaign.query.filter_by(status='completed').count(),
            'paused': Campaign.query.filter_by(status='paused').count(),
            'total_budget': float(db.session.query(db.func.sum(Campaign.budget)).scalar() or 0),
            'total_spent': float(db.session.query(db.func.sum(Campaign.spent)).scalar() or 0)
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@campaigns_bp.route('/<campaign_id>/tasks', methods=['GET'])
@jwt_required()
def get_campaign_tasks(campaign_id):
    """الحصول على مهام حملة محددة"""
    try:
        campaign = Campaign.query.get(campaign_id)
        
        if not campaign:
            return jsonify({'error': 'الحملة غير موجودة'}), 404
        
        tasks = campaign.tasks.all()
        
        return jsonify({
            'tasks': [task.to_dict() for task in tasks]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
