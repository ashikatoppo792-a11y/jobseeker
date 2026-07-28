import React, { useState } from 'react';
import StateDistrictModal from './StateDistrictModal';
import { useLanguage } from '../context/LanguageContext';
import { Search, MapPin, Briefcase, Sparkles, TrendingUp, Compass, Globe } from 'lucide-react';

const HeroSearch = ({ onSearch }) => {
  const { t } = useLanguage();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('Odisha');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ keyword, location });
  };

  const handlePopularClick = (tag) => {
    setKeyword(tag);
    onSearch({ keyword: tag, location });
  };

  const handleSelectLocation = ({ location: selectedLoc }) => {
    setLocation(selectedLoc);
    onSearch({ keyword, location: selectedLoc });
  };

  return (
    <div style={{
      position: 'relative',
      padding: '4rem 0 3.5rem 0',
      background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.06) 0%, rgba(37, 99, 235, 0.02) 100%)',
      borderBottom: '1px solid var(--border-color)',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Blur Orbs */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-50px',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 102, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-120px',
        left: '-50px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          marginBottom: '1.25rem',
          boxShadow: '0 2px 6px rgba(0, 102, 255, 0.12)'
        }}>
          <Sparkles size={16} /> {t('heroTag')}
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '1rem',
          maxWidth: '900px',
          margin: '0 auto 1rem auto'
        }}>
          {t('heroTitle')}
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto'
        }}>
          {t('heroSubtitle')}
        </p>

        {/* Search Box Container */}
        <form onSubmit={handleSubmit} style={{
          maxWidth: '960px',
          margin: '0 auto',
          backgroundColor: 'var(--bg-card)',
          padding: '0.65rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          {/* Keyword Input */}
          <div style={{
            flex: '1 1 240px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.85rem',
            borderRight: '1px solid var(--border-color)'
          }}>
            <Search size={20} color="var(--primary)" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.975rem',
                color: 'var(--text-main)',
                fontWeight: 500
              }}
            />
          </div>

          {/* Location Input & State/District Button */}
          <div style={{
            flex: '1 1 240px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.5rem'
          }}>
            <MapPin size={20} color="var(--primary)" />
            <input
              type="text"
              placeholder={t('locationPlaceholder')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.95rem',
                color: 'var(--text-main)',
                fontWeight: 600
              }}
            />
            {/* Interactive State & District Explorer Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.45rem 0.85rem', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 700 }}
            >
              <Compass size={14} /> {t('stateDistrictBtn')}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{
              padding: '0.85rem 2rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '1rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Search size={18} /> {t('searchBtn')}
          </button>
        </form>

        {/* Odisha 30 Districts & Pan India Quick Filter Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginTop: '1.5rem',
          fontSize: '0.875rem'
        }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Compass size={15} color="var(--primary)" /> {t('popularSearches')}
          </span>
          {[
            { label: 'Khordha (Bhubaneswar)', loc: 'Khordha (Bhubaneswar HQ)' },
            { label: 'Bengaluru Urban', loc: 'Bengaluru Urban, Karnataka' },
            { label: 'Mumbai City', loc: 'Mumbai City, Maharashtra' },
            { label: 'Sundargarh (Rourkela)', loc: 'Sundargarh (Rourkela HQ)' },
            { label: 'Cuttack', loc: 'Cuttack, Odisha' },
            { label: 'Noida / NCR', loc: 'Gautam Buddha Nagar (Noida), Uttar Pradesh' },
            { label: 'Hyderabad', loc: 'Hyderabad, Telangana' }
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setLocation(item.loc);
                onSearch({ keyword, location: item.loc });
              }}
              style={{
                backgroundColor: location === item.loc ? 'var(--primary-light)' : 'var(--bg-card)',
                border: `1px solid ${location === item.loc ? 'var(--primary)' : 'var(--border-color)'}`,
                padding: '0.3rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                color: location === item.loc ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: location === item.loc ? 700 : 500,
                transition: 'all var(--transition-fast)'
              }}
            >
              📍 {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* State & District Explorer Modal */}
      <StateDistrictModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLocation={handleSelectLocation}
      />
    </div>
  );
};

export default HeroSearch;
