import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import {
  X,
  UserCheck,
  Building2,
  Briefcase,
  Lock,
  Mail,
  User,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const AuthModal = ({ initialMode = 'login', onClose }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'forgot'
  const [role, setRole] = useState('seeker'); // 'seeker', 'employer'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('Austin, TX');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // 1-Click Quick Demo Accounts
  const handleQuickDemo = async (demoRole) => {
    setLoading(true);
    setError('');
    let demoEmail = 'seeker@example.com';
    if (demoRole === 'employer') demoEmail = 'employer@techcorp.com';
    if (demoRole === 'admin') demoEmail = 'admin@jobseeker.com';

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: demoEmail, password: 'password123' })
      });

      login(data, data.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      if (mode === 'forgot') {
        const res = await apiFetch('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
        setInfoMessage(res.message);
        setLoading(false);
        return;
      }

      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { email, password }
        : { name, email, password, role, companyName, location };

      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      login(data, data.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '480px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {mode === 'login' ? 'Welcome Back' : (mode === 'register' ? 'Create Account' : 'Reset Password')}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {mode === 'login' ? 'Sign in to access local jobs and applications' : 'Join thousands of local job seekers & employers'}
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '0.4rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
            <X size={18} />
          </button>
        </div>

        {/* 1-Click Fast Demo Buttons */}
        <div style={{
          backgroundColor: 'var(--primary-light)',
          border: '1px solid rgba(0, 102, 255, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.785rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={14} /> 1-Click Instant Demo Login:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
            <button
              onClick={() => handleQuickDemo('seeker')}
              className="btn btn-outline btn-sm"
              style={{ backgroundColor: 'var(--bg-card)', fontSize: '0.75rem', padding: '0.35rem' }}
            >
              <User size={13} /> Seeker
            </button>
            <button
              onClick={() => handleQuickDemo('employer')}
              className="btn btn-outline btn-sm"
              style={{ backgroundColor: 'var(--bg-card)', fontSize: '0.75rem', padding: '0.35rem' }}
            >
              <Building2 size={13} /> Employer
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="btn btn-outline btn-sm"
              style={{ backgroundColor: 'var(--bg-card)', fontSize: '0.75rem', padding: '0.35rem' }}
            >
              <ShieldCheck size={13} /> Admin
            </button>
          </div>
        </div>

        {/* Role Selector (Job Seeker vs Employer) when registering */}
        {mode === 'register' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            backgroundColor: 'var(--bg-main)',
            padding: '0.3rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <button
              type="button"
              onClick={() => setRole('seeker')}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem',
                backgroundColor: role === 'seeker' ? 'var(--bg-card)' : 'transparent',
                color: role === 'seeker' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: role === 'seeker' ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Briefcase size={15} /> Job Seeker
            </button>

            <button
              type="button"
              onClick={() => setRole('employer')}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem',
                backgroundColor: role === 'employer' ? 'var(--bg-card)' : 'transparent',
                color: role === 'employer' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: role === 'employer' ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Building2 size={15} /> Employer
            </button>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {infoMessage && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: '#10B981',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            {infoMessage}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-control"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
              />
            </div>
          )}

          {mode === 'register' && role === 'employer' && (
            <div className="input-group">
              <label className="input-label">Company Name</label>
              <input
                type="text"
                className="input-control"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Apex Innovations Inc"
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    style={{ fontSize: '0.785rem', color: 'var(--primary)' }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                className="input-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {loading ? 'Processing...' : (
              mode === 'login' ? 'Sign In' : (mode === 'register' ? 'Create Account' : 'Send Reset Link')
            )}
          </button>
        </form>

        {/* Footer switch mode */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{ color: 'var(--primary)', fontWeight: 700 }}
              >
                Sign Up Free
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{ color: 'var(--primary)', fontWeight: 700 }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
