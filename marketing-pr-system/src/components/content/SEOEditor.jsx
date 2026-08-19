import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';
import '../styles/SEOEditor.css';

const SEOEditor = ({ onSEOChange }) => {
  const [seoData, setSeoData] = useState({
    title: '',
    description: '',
    keywords: '',
    slug: ''
  });

  const [seoScore, setSeoScore] = useState(0);

  const calculateSEOScore = (data) => {
    let score = 0;

    if (data.title && data.title.length > 0) score += 25;
    if (data.title && data.title.length >= 30 && data.title.length <= 60) score += 10;

    if (data.description && data.description.length > 0) score += 25;
    if (data.description && data.description.length >= 120 && data.description.length <= 160) score += 10;

    if (data.keywords && data.keywords.length > 0) score += 25;
    if (data.slug && data.slug.length > 0) score += 5;

    return score;
  };

  const handleChange = (field, value) => {
    const updated = { ...seoData, [field]: value };
    setSeoData(updated);
    setSeoScore(calculateSEOScore(updated));
    onSEOChange(updated);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (value) => {
    handleChange('title', value);
    if (!seoData.slug) {
      handleChange('slug', generateSlug(value));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#ef5350';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  return (
    <div className="seo-editor">
      <div className="seo-header">
        <h3>🔍 محرر SEO</h3>
        <div className="seo-score" style={{ backgroundColor: getScoreColor(seoScore) }}>
          <span className="score-number">{seoScore}</span>
          <span className="score-label">{getScoreLabel(seoScore)}</span>
        </div>
      </div>

      <div className="seo-section">
        <label>عنوان الصفحة (Title)</label>
        <input
          type="text"
          placeholder="أدخل عنوان الصفحة (30-60 حرف)"
          value={seoData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          maxLength="60"
        />
        <div className="char-count">
          {seoData.title.length} / 60
          {seoData.title.length >= 30 && seoData.title.length <= 60 && (
            <CheckCircle size={16} className="check-icon" />
          )}
        </div>
      </div>

      <div className="seo-section">
        <label>وصف الصفحة (Meta Description)</label>
        <textarea
          placeholder="أدخل وصف الصفحة (120-160 حرف)"
          value={seoData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          maxLength="160"
          rows="3"
        />
        <div className="char-count">
          {seoData.description.length} / 160
          {seoData.description.length >= 120 && seoData.description.length <= 160 && (
            <CheckCircle size={16} className="check-icon" />
          )}
        </div>
      </div>

      <div className="seo-section">
        <label>الكلمات المفتاحية (Keywords)</label>
        <input
          type="text"
          placeholder="أدخل الكلمات المفتاحية مفصولة بفواصل"
          value={seoData.keywords}
          onChange={(e) => handleChange('keywords', e.target.value)}
        />
        <div className="keywords-list">
          {seoData.keywords.split(',').map((keyword, index) => (
            keyword.trim() && (
              <span key={index} className="keyword-tag">
                {keyword.trim()}
              </span>
            )
          ))}
        </div>
      </div>

      <div className="seo-section">
        <label>رابط الصفحة (Slug)</label>
        <input
          type="text"
          placeholder="example-page-slug"
          value={seoData.slug}
          onChange={(e) => handleChange('slug', e.target.value)}
        />
      </div>

      <div className="seo-tips">
        <h4>💡 نصائح SEO:</h4>
        <ul>
          <li>استخدم عنوان بين 30-60 حرف</li>
          <li>اكتب وصف بين 120-160 حرف</li>
          <li>أضف كلمات مفتاحية ذات صلة</li>
          <li>استخدم رابط واضح وسهل الفهم</li>
          <li>تأكد من تضمين الكلمات المفتاحية في المحتوى</li>
        </ul>
      </div>
    </div>
  );
};

export default SEOEditor;
