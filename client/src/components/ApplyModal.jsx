import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import confetti from 'canvas-confetti';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  User,
  Mail,
  Phone
} from 'lucide-react';

const ApplyModal = ({ job, onClose, onSuccess }) => {
  const { user, token } = useAuth();
  const [applicantName, setApplicantName] = useState(user?.name || '');
  const [applicantEmail, setApplicantEmail] = useState(user?.email || '');
  const [applicantPhone, setApplicantPhone] = useState(user?.phone || '');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!job) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('jobId', job._id);
      formData.append('applicantName', applicantName);
      formData.append('applicantEmail', applicantEmail);
      formData.append('applicantPhone', applicantPhone);
      formData.append('coverLetter', coverLetter);

      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const response = await apiFetch('/applications', {
        method: 'POST',
        body: formData,
        token
      });

      // Fire confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '580px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Apply for Position</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {job?.title} at <strong style={{ color: 'var(--primary)' }}>{job?.companyName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem',
              borderRadius: '50%',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={40} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Application Sent!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Your application & resume have been successfully transmitted to <strong>{job?.companyName}</strong>. You can track status updates inside your dashboard.
            </p>
            <button onClick={onClose} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Back to Job Search
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #EF4444',
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

            {/* Applicant Contact Details */}
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-control"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  className="input-control"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input
                  type="tel"
                  className="input-control"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Resume File Upload */}
            <div className="input-group">
              <label className="input-label">Upload Resume (PDF / DOC / DOCX)</label>
              <div style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-main)',
                cursor: 'pointer',
                position: 'relative'
              }}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <Upload size={24} color="var(--primary)" style={{ marginBottom: '0.4rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {resumeFile ? resumeFile.name : (user?.resumeName || 'Click or drop your resume here')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Max size: 10MB (PDF, DOCX)
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="input-group">
              <label className="input-label">Cover Letter (Optional)</label>
              <textarea
                className="input-control"
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Share why you're a great fit for this local position..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                {loading ? 'Transmitting...' : (
                  <>
                    <Send size={18} /> Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;
