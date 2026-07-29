import React from 'react';
import { X, Briefcase, Building2, UserCheck, ArrowRight } from 'lucide-react';

const GoalSelectionModal = ({ isOpen, onClose, onSelectGoal }) => {
  if (!isOpen) return null;

  const handleSelect = (goal) => {
    onSelectGoal(goal);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        zIndex: 1100,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div
        className="modal-card animate-scale-up"
        style={{
          maxWidth: '720px',
          width: '90%',
          padding: '2.5rem 2rem 2.25rem 2rem',
          borderRadius: '24px',
          backgroundColor: 'var(--bg-card)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          marginBottom: '2rem',
          fontFamily: 'var(--font-heading)'
        }}>
          What do you want to do?
        </h2>

        {/* 2 Choice Cards Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem',
          marginBottom: '0.5rem'
        }}>
          {/* Card 1: I want a job */}
          <div
            onClick={() => handleSelect('seeker')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s'
            }}
            className="goal-card"
          >
            <div style={{
              width: '100%',
              height: '210px',
              borderRadius: '20px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.2)',
              border: '2px solid rgba(37, 99, 235, 0.15)',
              background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem 1rem 1.5rem 1.5rem'
            }}>
              {/* Left Text inside Card */}
              <div style={{
                zIndex: 2,
                textAlign: 'left',
                maxWidth: '55%'
              }}>
                <h3 style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  margin: 0
                }}>
                  I want a job
                </h3>
              </div>

              {/* Candidate Image */}
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80"
                alt="Job Seeker Candidate"
                style={{
                  width: '160px',
                  height: '210px',
                  objectFit: 'cover',
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
                }}
              />
            </div>

            {/* Hindi Subtext */}
            <span style={{
              marginTop: '1rem',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#1E40AF',
              fontFamily: 'sans-serif'
            }}>
              मुझे नौकरी चाहिए
            </span>
          </div>

          {/* Card 2: I want to hire people */}
          <div
            onClick={() => handleSelect('employer')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s'
            }}
            className="goal-card"
          >
            <div style={{
              width: '100%',
              height: '210px',
              borderRadius: '20px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.2)',
              border: '2px solid rgba(37, 99, 235, 0.15)',
              background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem 1rem 1.5rem 1.5rem'
            }}>
              {/* Left Text inside Card */}
              <div style={{
                zIndex: 2,
                textAlign: 'left',
                maxWidth: '55%'
              }}>
                <h3 style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  margin: 0
                }}>
                  I want to hire people
                </h3>
              </div>

              {/* Employer / Recruiter Image */}
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80"
                alt="Employer Recruiter"
                style={{
                  width: '160px',
                  height: '210px',
                  objectFit: 'cover',
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
                }}
              />
            </div>

            {/* Hindi Subtext */}
            <span style={{
              marginTop: '1rem',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#1D4ED8',
              fontFamily: 'sans-serif'
            }}>
              मुझे लोग काम पे रखने है
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSelectionModal;
