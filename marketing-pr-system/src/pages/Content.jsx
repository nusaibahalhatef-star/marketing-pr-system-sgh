import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import RichTextEditor from '../components/content/RichTextEditor';
import MediaManager from '../components/content/MediaManager';
import ContentScheduler from '../components/content/ContentScheduler';
import CategoriesAndTags from '../components/content/CategoriesAndTags';
import ContentPreview from '../components/content/ContentPreview';
import SEOEditor from '../components/content/SEOEditor';
import '../styles/Content.css';

const Content = () => {
  const [contents, setContents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    status: 'draft',
    categories: [],
    tags: [],
    seo: {},
    schedule_date: null
  });

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/content', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setContents(data);
      }
    } catch (error) {
      console.error('خطأ في جلب المحتوى:', error);
    }
  };

  const handleSaveContent = async () => {
    if (!formData.title.trim()) {
      alert('يرجى إدخال عنوان المحتوى');
      return;
    }

    try {
      const url = editingId 
        ? `http://localhost:5000/api/content/${editingId}`
        : 'http://localhost:5000/api/content';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (editingId) {
          setContents(contents.map(c => c.id === editingId ? data : c));
        } else {
          setContents([...contents, data]);
        }
        resetForm();
        setActiveTab('list');
      }
    } catch (error) {
      console.error('خطأ في حفظ المحتوى:', error);
    }
  };

  const handleDeleteContent = async (id) => {
    if (!confirm('هل تريد حذف هذا المحتوى؟')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/content/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setContents(contents.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('خطأ في حذف المحتوى:', error);
    }
  };

  const handleEditContent = (content) => {
    setFormData(content);
    setEditingId(content.id);
    setActiveTab('editor');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      featured_image: '',
      status: 'draft',
      categories: [],
      tags: [],
      seo: {},
      schedule_date: null
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredContents = contents.filter(c => {
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'published': '#4caf50',
      'draft': '#ff9800',
      'scheduled': '#2196f3',
      'archived': '#9e9e9e'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="content-page">
      <div className="page-header">
        <h1>📝 إدارة المحتوى</h1>
        <button 
          className="btn-primary"
          onClick={() => {
            resetForm();
            setActiveTab('editor');
          }}
        >
          <Plus size={20} /> محتوى جديد
        </button>
      </div>

      <div className="content-tabs">
        <button 
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📋 قائمة المحتوى
        </button>
        <button 
          className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          ✏️ محرر المحتوى
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="content-list-section">
          <div className="list-controls">
            <input
              type="text"
              placeholder="ابحث عن محتوى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="filter-buttons">
              {['all', 'draft', 'published', 'scheduled', 'archived'].map(status => (
                <button
                  key={status}
                  className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status === 'all' ? 'الكل' : status === 'draft' ? 'مسودات' : status === 'published' ? 'منشور' : status === 'scheduled' ? 'مجدول' : 'مؤرشف'}
                </button>
              ))}
            </div>
          </div>

          <div className="content-table">
            <table>
              <thead>
                <tr>
                  <th>العنوان</th>
                  <th>الحالة</th>
                  <th>التاريخ</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredContents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-message">لا يوجد محتوى</td>
                  </tr>
                ) : (
                  filteredContents.map(content => (
                    <tr key={content.id}>
                      <td className="title-cell">{content.title}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(content.status) }}
                        >
                          {content.status === 'published' ? 'منشور' : content.status === 'draft' ? 'مسودة' : content.status === 'scheduled' ? 'مجدول' : 'مؤرشف'}
                        </span>
                      </td>
                      <td>{new Date(content.created_at).toLocaleDateString('ar-SA')}</td>
                      <td className="actions-cell">
                        <button 
                          className="action-btn view"
                          onClick={() => handleEditContent(content)}
                          title="تعديل"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDeleteContent(content.id)}
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="content-editor-section">
          <div className="editor-container">
            <div className="editor-main">
              <div className="form-group">
                <label>العنوان *</label>
                <input
                  type="text"
                  placeholder="أدخل عنوان المحتوى"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>الملخص</label>
                <textarea
                  placeholder="أدخل ملخص قصير للمحتوى"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>المحتوى</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="ابدأ بكتابة المحتوى..."
                />
              </div>

              <div className="form-group">
                <label>الصورة المميزة</label>
                <input
                  type="url"
                  placeholder="رابط الصورة"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>الحالة</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                  <option value="scheduled">مجدول</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
            </div>

            <div className="editor-sidebar">
              <div className="sidebar-section">
                <CategoriesAndTags
                  onCategorySelect={(cats) => setFormData({ ...formData, categories: cats })}
                  onTagSelect={(tags) => setFormData({ ...formData, tags })}
                />
              </div>

              <div className="sidebar-section">
                <ContentScheduler
                  onSchedule={(schedule) => setFormData({ ...formData, schedule_date: schedule })}
                />
              </div>

              <div className="sidebar-section">
                <SEOEditor
                  onSEOChange={(seo) => setFormData({ ...formData, seo })}
                />
              </div>

              <div className="sidebar-section">
                <ContentPreview
                  title={formData.title}
                  content={formData.content}
                  excerpt={formData.excerpt}
                  featured_image={formData.featured_image}
                  status={formData.status}
                />
              </div>
            </div>
          </div>

          <div className="editor-actions">
            <button 
              className="btn-save"
              onClick={handleSaveContent}
            >
              💾 حفظ المحتوى
            </button>
            <button 
              className="btn-cancel"
              onClick={() => {
                resetForm();
                setActiveTab('list');
              }}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
