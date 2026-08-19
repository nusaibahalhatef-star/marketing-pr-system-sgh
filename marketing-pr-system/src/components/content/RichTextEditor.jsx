import React, { useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Image, Code } from 'lucide-react';
import '../styles/RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      applyFormat('createLink', linkUrl);
      setShowLinkModal(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const insertImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        applyFormat('insertImage', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <button 
          type="button"
          className="toolbar-btn"
          onClick={() => applyFormat('bold')}
          title="غامق"
        >
          <Bold size={18} />
        </button>
        <button 
          type="button"
          className="toolbar-btn"
          onClick={() => applyFormat('italic')}
          title="مائل"
        >
          <Italic size={18} />
        </button>
        <button 
          type="button"
          className="toolbar-btn"
          onClick={() => applyFormat('underline')}
          title="تسطير"
        >
          <Underline size={18} />
        </button>

        <div className="toolbar-separator"></div>

        <button 
          type="button"
          className="toolbar-btn"
          onClick={() => applyFormat('insertUnorderedList')}
          title="قائمة نقاط"
        >
          <List size={18} />
        </button>
        <button 
          type="button"
          className="toolbar-btn"
          onClick={() => applyFormat('insertOrderedList')}
          title="قائمة مرقمة"
        >
          <ListOrdered size={18} />
        </button>

        <div className="toolbar-separator"></div>

        <button 
          type="button"
          className="toolbar-btn"
          onClick={() => setShowLinkModal(true)}
          title="إضافة رابط"
        >
          <Link size={18} />
        </button>

        <label className="toolbar-btn" title="إضافة صورة">
          <Image size={18} />
          <input 
            type="file" 
            accept="image/*" 
            onChange={insertImage}
            style={{ display: 'none' }}
          />
        </label>

        <button 
          type="button"
          className="toolbar-btn"
          onClick={() => applyFormat('formatBlock', '<code>')}
          title="كود"
        >
          <Code size={18} />
        </button>
      </div>

      <div 
        className="editor-content"
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        suppressContentEditableWarning
      >
        {placeholder}
      </div>

      {showLinkModal && (
        <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>إضافة رابط</h3>
            <input
              type="text"
              placeholder="النص المعروض"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
            <input
              type="url"
              placeholder="رابط URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={insertLink} className="btn-confirm">إضافة</button>
              <button onClick={() => setShowLinkModal(false)} className="btn-cancel">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
