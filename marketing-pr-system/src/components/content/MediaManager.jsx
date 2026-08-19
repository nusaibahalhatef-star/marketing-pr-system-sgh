import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Download, Image, Video, File } from 'lucide-react';
import '../styles/MediaManager.css';

const MediaManager = ({ onSelectMedia }) => {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/media', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMedia(data);
      }
    } catch (error) {
      console.error('خطأ في جلب الوسائط:', error);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/api/media/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setMedia([...media, data]);
        }
      } catch (error) {
        console.error('خطأ في رفع الملف:', error);
      }
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف هذا الملف؟')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setMedia(media.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error('خطأ في حذف الملف:', error);
    }
  };

  const getMediaType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) return 'video';
    return 'file';
  };

  const getMediaIcon = (type) => {
    switch(type) {
      case 'image': return <Image size={24} />;
      case 'video': return <Video size={24} />;
      default: return <File size={24} />;
    }
  };

  const filteredMedia = filterType === 'all' 
    ? media 
    : media.filter(m => getMediaType(m.filename) === filterType);

  return (
    <div className="media-manager">
      <div className="media-header">
        <h2>📁 إدارة الوسائط</h2>
        <label className="btn-upload">
          <Upload size={20} /> رفع وسائط
          <input 
            type="file" 
            multiple 
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {uploading && <div className="uploading">جاري الرفع...</div>}

      <div className="media-filters">
        <button 
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          الكل
        </button>
        <button 
          className={`filter-btn ${filterType === 'image' ? 'active' : ''}`}
          onClick={() => setFilterType('image')}
        >
          صور
        </button>
        <button 
          className={`filter-btn ${filterType === 'video' ? 'active' : ''}`}
          onClick={() => setFilterType('video')}
        >
          فيديوهات
        </button>
      </div>

      <div className="media-grid">
        {filteredMedia.length === 0 ? (
          <div className="empty-media">لا توجد وسائط</div>
        ) : (
          filteredMedia.map(item => {
            const type = getMediaType(item.filename);
            return (
              <div key={item.id} className="media-item">
                <div className="media-preview">
                  {type === 'image' ? (
                    <img src={item.url} alt={item.filename} />
                  ) : (
                    <div className="media-icon">{getMediaIcon(type)}</div>
                  )}
                </div>
                <div className="media-info">
                  <p className="media-name">{item.filename}</p>
                  <p className="media-size">{(item.size / 1024).toFixed(2)} KB</p>
                </div>
                <div className="media-actions">
                  <button 
                    className="action-btn"
                    onClick={() => onSelectMedia(item.url)}
                    title="استخدام"
                  >
                    <Copy size={18} />
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => window.open(item.url, '_blank')}
                    title="تحميل"
                  >
                    <Download size={18} />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(item.id)}
                    title="حذف"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MediaManager;
