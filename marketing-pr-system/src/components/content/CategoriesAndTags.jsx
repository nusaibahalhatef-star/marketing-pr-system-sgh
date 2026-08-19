import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import '../styles/CategoriesAndTags.css';

const CategoriesAndTags = ({ onCategorySelect, onTagSelect }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('خطأ في جلب الفئات:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tags', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error('خطأ في جلب الوسوم:', error);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newCategory })
      });

      if (response.ok) {
        const data = await response.json();
        setCategories([...categories, data]);
        setNewCategory('');
      }
    } catch (error) {
      console.error('خطأ في إضافة الفئة:', error);
    }
  };

  const addTag = async () => {
    if (!newTag.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/tags', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newTag })
      });

      if (response.ok) {
        const data = await response.json();
        setTags([...tags, data]);
        setNewTag('');
      }
    } catch (error) {
      console.error('خطأ في إضافة الوسم:', error);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('هل تريد حذف هذه الفئة؟')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('خطأ في حذف الفئة:', error);
    }
  };

  const deleteTag = async (id) => {
    if (!confirm('هل تريد حذف هذا الوسم؟')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tags/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setTags(tags.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('خطأ في حذف الوسم:', error);
    }
  };

  const toggleCategory = (id) => {
    const updated = selectedCategories.includes(id)
      ? selectedCategories.filter(c => c !== id)
      : [...selectedCategories, id];
    setSelectedCategories(updated);
    onCategorySelect(updated);
  };

  const toggleTag = (id) => {
    const updated = selectedTags.includes(id)
      ? selectedTags.filter(t => t !== id)
      : [...selectedTags, id];
    setSelectedTags(updated);
    onTagSelect(updated);
  };

  return (
    <div className="categories-and-tags">
      <div className="section">
        <h3>📂 الفئات</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="أضف فئة جديدة..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
          />
          <button onClick={addCategory} className="btn-add">
            <Plus size={20} />
          </button>
        </div>

        <div className="items-list">
          {categories.map(cat => (
            <div key={cat.id} className="item">
              <label className="item-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                />
                <span>{cat.name}</span>
              </label>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="btn-delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>🏷️ الوسوم</h3>
        <div className="input-group">
          <input
            type="text"
            placeholder="أضف وسم جديد..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <button onClick={addTag} className="btn-add">
            <Plus size={20} />
          </button>
        </div>

        <div className="tags-cloud">
          {tags.map(tag => (
            <div key={tag.id} className="tag-item">
              <label className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                />
                <span>{tag.name}</span>
              </label>
              <button
                onClick={() => deleteTag(tag.id)}
                className="btn-delete-tag"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesAndTags;
