import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import {
  Briefcase,
  Search,
  Bookmark,
  Sun,
  Moon,
  User,
  PlusCircle,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Bell,
  HelpCircle
} from 'lucide-react';

const Navbar = ({ onOpenAuth, onNavigate, currentPage, onOpenGoalModal }) => {
  const { user, logout, savedJobs } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--bg-header)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'all var(--transition-normal)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Logo */}
        <div
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(0, 102, 255, 0.3)'
          }}>
            <Briefcase size={22} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.03em'
            }}>
              Job<span style={{ color: 'var(--primary)' }}>Seeker</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginTop: '-4px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Pan India Jobs
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }} className="desktop-nav">
          {/* WorkIndia-style Goal Switch Button */}
          <button
            onClick={onOpenGoalModal}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.45rem 0.85rem',
              fontWeight: 700,
              fontSize: '0.825rem',
              borderRadius: 'var(--radius-full)',
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <HelpCircle size={15} /> Goal: Job or Hire?
          </button>

          <button
            onClick={() => onNavigate('home')}
            style={{
              fontWeight: currentPage === 'home' ? 700 : 500,
              color: currentPage === 'home' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.95rem'
            }}
          >
            {t('findJobs')}
          </button>
          <button
            onClick={() => onNavigate('jobs')}
            style={{
              fontWeight: currentPage === 'jobs' ? 700 : 500,
              color: currentPage === 'jobs' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.95rem'
            }}
          >
            {t('browseAll')}
          </button>

          {user?.role === 'seeker' && (
            <button
              onClick={() => onNavigate('seeker-dashboard')}
              style={{
                fontWeight: currentPage === 'seeker-dashboard' ? 700 : 500,
                color: currentPage === 'seeker-dashboard' ? 'var(--primary)' : 'var(--text-main)',
                fontSize: '0.95rem'
              }}
            >
              {t('myApplications')}
            </button>
          )}

          {user?.role === 'employer' && (
            <button
              onClick={() => onNavigate('employer-dashboard')}
              style={{
                fontWeight: currentPage === 'employer-dashboard' ? 700 : 500,
                color: currentPage === 'employer-dashboard' ? 'var(--primary)' : 'var(--text-main)',
                fontSize: '0.95rem'
              }}
            >
              {t('employerHub')}
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin-panel')}
              style={{
                fontWeight: currentPage === 'admin-panel' ? 700 : 500,
                color: currentPage === 'admin-panel' ? 'var(--primary)' : 'var(--text-main)',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <ShieldCheck size={16} color="var(--primary)" /> {t('adminPanel')}
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Pan India Multi-Language Selector */}
          <LanguageSelector />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-outline"
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-main)'
            }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#F59E0B" />}
          </button>

          {/* Saved Jobs Icon */}
          <button
            onClick={() => onNavigate('seeker-dashboard')}
            style={{
              position: 'relative',
              padding: '0.55rem',
              color: 'var(--text-main)'
            }}
            title="Saved Jobs"
          >
            <Bookmark size={20} />
            {savedJobs.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {savedJobs.length}
              </span>
            )}
          </button>

          {/* User Auth state */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span className="badge badge-blue" style={{ fontSize: '0.65rem', textTransform: 'capitalize' }}>
                  {user.role}
                </span>
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  width: '210px',
                  padding: '0.5rem 0',
                  zIndex: 200
                }}>
                  <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>

                  {user.role === 'seeker' && (
                    <button
                      onClick={() => { onNavigate('seeker-dashboard'); setUserDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <User size={16} /> My Profile & Resume
                    </button>
                  )}

                  {user.role === 'employer' && (
                    <button
                      onClick={() => { onNavigate('employer-dashboard'); setUserDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <PlusCircle size={16} /> Post a Job
                    </button>
                  )}

                  {user.role === 'admin' && (
                    <button
                      onClick={() => { onNavigate('admin-panel'); setUserDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <ShieldCheck size={16} /> Admin Panel
                    </button>
                  )}

                  <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.3rem', paddingTop: '0.3rem' }}>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                        color: '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn btn-outline btn-sm"
              >
                {t('signIn')}
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn btn-primary btn-sm"
              >
                {t('postFindJobs')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
