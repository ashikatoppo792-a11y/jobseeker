import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSelector = () => {
  const { lang, changeLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);

  const activeLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-outline"
        style={{
          padding: '0.4rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.825rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)'
        }}
        title="Change UI Language"
      >
        <Globe size={15} color="var(--primary)" />
        <span>{activeLang.native}</span>
        <ChevronDown size={13} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '115%',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          width: '170px',
          padding: '0.4rem 0',
          zIndex: 300,
          animation: 'fadeIn 0.15s ease'
        }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.3rem 0.85rem', textTransform: 'uppercase' }}>
            Select Language
          </div>

          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => {
                changeLanguage(l.code);
                setOpen(false);
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.5rem 0.85rem',
                fontSize: '0.875rem',
                fontWeight: lang === l.code ? 700 : 500,
                color: lang === l.code ? 'var(--primary)' : 'var(--text-main)',
                backgroundColor: lang === l.code ? 'var(--primary-light)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <span>{l.native}</span>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>({l.name})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
