import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = ({ style = {}, isCollapsed = false, className = '' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    try {
      localStorage.setItem('govinnovate_lang', lang);
    } catch (e) {
      console.error('Failed to save language preference:', e);
    }
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => toggleLanguage(currentLang === 'en' ? 'mr' : 'en')}
        title={currentLang === 'en' ? "मराठीमध्ये बदला" : "Switch to English"}
        className={`lang-btn-collapsed ${className}`}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
          borderRadius: '6px',
          padding: '0.35rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.75rem',
          ...style
        }}
      >
        <span style={{ color: '#FF9933' }}>{currentLang === 'en' ? 'म' : 'EN'}</span>
      </button>
    );
  }

  return (
    <div 
      className={`language-switcher-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '2px',
        gap: '2px',
        ...style
      }}
    >
      <button
        type="button"
        onClick={() => toggleLanguage('en')}
        className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
        style={{
          background: currentLang === 'en' ? '#FF9933' : 'transparent',
          color: currentLang === 'en' ? '#0A2540' : '#FFFFFF',
          border: 'none',
          borderRadius: '4px',
          padding: '0.25rem 0.6rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => toggleLanguage('mr')}
        className={`lang-btn ${currentLang === 'mr' ? 'active' : ''}`}
        style={{
          background: currentLang === 'mr' ? '#FF9933' : 'transparent',
          color: currentLang === 'mr' ? '#0A2540' : '#FFFFFF',
          border: 'none',
          borderRadius: '4px',
          padding: '0.25rem 0.6rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        मराठी
      </button>
    </div>
  );
};

export default LanguageSwitcher;
