import React, { useState } from 'react';
import { STATE_DISTRICT_DATA, ALL_INDIAN_STATES } from '../utils/indiaDistricts';
import { X, MapPin, Search, ChevronRight, Check, Compass, Building2 } from 'lucide-react';

const StateDistrictModal = ({ isOpen, onClose, onSelectLocation }) => {
  if (!isOpen) return null;

  const [activeState, setActiveState] = useState('Karnataka');
  const [searchTerm, setSearchTerm] = useState('');

  const states = Object.keys(STATE_DISTRICT_DATA);
  const districts = STATE_DISTRICT_DATA[activeState] || [];

  const filteredStates = states.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStateClick = (stateName) => {
    setActiveState(stateName);
  };

  const handleDistrictClick = (districtName) => {
    onSelectLocation({ state: activeState, district: districtName, location: `${districtName}, ${activeState}` });
    onClose();
  };

  const handleSelectEntireState = () => {
    onSelectLocation({ state: activeState, district: '', location: activeState });
    onClose();
  };

  const handleSelectPanIndia = () => {
    onSelectLocation({ state: 'Pan India (Remote)', district: '', location: 'Pan India' });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '820px', padding: '0', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div style={{
          padding: '1.5rem 1.75rem',
          backgroundColor: 'var(--primary-light)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div className="badge badge-blue" style={{ marginBottom: '0.35rem', fontWeight: 700 }}>
              <Compass size={14} /> Location Explorer
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              Select State & District in India
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '0.4rem',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Search Bar */}
        <div style={{ padding: '1rem 1.75rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: 'var(--bg-main)',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <Search size={18} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search any Indian State or District (e.g. Pune, Mysuru, Noida, Bengaluru)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.925rem',
                color: 'var(--text-main)'
              }}
            />
          </div>
        </div>

        {/* Modal Body: Split view of States list on left + Districts list on right */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', height: '420px' }}>
          {/* Left Column: States List */}
          <div style={{
            borderRight: '1px solid var(--border-color)',
            overflowY: 'auto',
            padding: '0.75rem',
            backgroundColor: 'var(--bg-main)'
          }}>
            <button
              onClick={handleSelectPanIndia}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-light)',
                border: '1px solid rgba(0, 102, 255, 0.2)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>🌐 Pan India (All / Remote)</span>
              <ChevronRight size={14} />
            </button>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.4rem 0.5rem', textTransform: 'uppercase' }}>
              Select State ({filteredStates.length})
            </div>

            {filteredStates.map(stateName => {
              const isSelected = activeState === stateName;
              return (
                <button
                  key={stateName}
                  onClick={() => handleStateClick(stateName)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? 'var(--bg-card)' : 'transparent',
                    color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'transparent'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>{stateName}</span>
                  <ChevronRight size={14} opacity={isSelected ? 1 : 0.4} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Districts for Active State */}
          <div style={{ padding: '1.25rem', overflowY: 'auto', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{activeState} Districts</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {districts.length} major districts listed
                </span>
              </div>

              <button
                onClick={handleSelectEntireState}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--primary)', fontWeight: 700 }}
              >
                <Check size={14} /> Select All {activeState}
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: '0.75rem'
            }}>
              {districts.map(dist => (
                <button
                  key={dist}
                  onClick={() => handleDistrictClick(dist)}
                  style={{
                    textAlign: 'left',
                    padding: '0.75rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }}
                >
                  <MapPin size={15} color="var(--primary)" /> {dist}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StateDistrictModal;
