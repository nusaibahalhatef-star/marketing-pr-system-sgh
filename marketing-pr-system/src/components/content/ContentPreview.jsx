import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../styles/ContentPreview.css';

const ContentPreview = ({ title, content, excerpt, featured_image, status, schedule_date }) => {
  const [showPreview, setShowPreview] = React.useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return '#4caf50';
      case 'draft': return '#ff9800';
      case 'scheduled': return '#2196f3';
      case 'archived': return '#9e9e9e';
      default: return '#666';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'published': 'منشور',
      'draft': 'مسودة',
      'scheduled': 'مجدول',
      'archived': 'مؤرشف'
    };
    return labels[status] || status;
  };

  return (
    <div className="content-preview">
      <div className="preview-header">
        <button 
          className="btn-toggle-preview"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
          {showPreview ? 'إخفاء المعاينة' : 'عرض المعاينة'}
        </button>
        <div className="status-badge" style={{ backgroundColor: getStatusColor(status) }}>
          {getStatusLabel(status)}
        </div>
      </div>

      {showPreview && (
        <div className="preview-content">
          {featured_image && (
            <img src={featured_image} alt={title} className="preview-image" />
          )}

          <div className="preview-body">
            <h2 className="preview-title">{title || 'بدون عنوان'}</h2>

            {excerpt && (
              <p className="preview-excerpt">{excerpt}</p>
            )}

            {schedule_date && (
              <div className="preview-schedule">
                📅 مجدول للنشر: {new Date(schedule_date).toLocaleDateString('ar-SA')}
              </div>
            )}

            <div className="preview-text">
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="empty-content">لا يوجد محتوى</p>
              )}
            </div>

            <div className="preview-footer">
              <small>معاينة المحتوى - هذا ما سيراه الزوار</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPreview;
