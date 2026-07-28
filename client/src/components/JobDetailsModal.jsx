import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatIndianSalary } from './JobCard';
import {
  X,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  Bookmark,
  Sparkles,
  Share2,
  CheckCircle,
  Clock,
  Star,
  ExternalLink,
  Award
} from 'lucide-react';

const JobDetailsModal = ({ job, onClose, onApply, onOpenCompanyProfile }) => {
  const { savedJobs, toggleSaveJob } = useAuth();
  if (!job) return null;

  const isSaved = savedJobs.includes(job._id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job opening for ${job.title} at ${job.companyName}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '780px', padding: '0', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header */}
        <div style={{
          backgroundColor: 'var(--primary-light)',
          padding: '2rem 2rem 1.5rem 2rem',
          borderBottom: '1px solid var(--border-color)',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <img
              src={job.companyLogo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80'}
              alt={job.companyName}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)'
              }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span
                  onClick={() => {
                    onClose();
                    if (onOpenCompanyProfile) onOpenCompanyProfile(job.employerId);
                  }}
                  style={{
                    fontWeight: 700,
                    color: 'var(--primary)',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {job.companyName} <ExternalLink size={14} />
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', color: '#F59E0B', fontWeight: 700 }}>
                  <Star size={14} fill="#F59E0B" /> 4.8
                </span>
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.25rem 0 0.75rem 0', color: 'var(--text-main)' }}>
                {job.title}
              </h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-blue"><MapPin size={13} /> {job.location}</span>
                <span className="badge badge-green"><IndianRupee size={13} /> {formatIndianSalary(job)}</span>
                <span className="badge badge-purple"><Briefcase size={13} /> {job.jobType} ({job.workMode})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* Action Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => {
                onClose();
                onApply(job);
              }}
              className="btn btn-primary btn-lg"
              style={{ flex: 1, maxWidth: '280px' }}
            >
              Apply for this Job
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => toggleSaveJob(job._id)}
                className="btn btn-outline"
                style={{ color: isSaved ? 'var(--primary)' : 'var(--text-main)' }}
              >
                <Bookmark size={18} fill={isSaved ? 'var(--primary)' : 'none'} /> {isSaved ? 'Saved' : 'Save Job'}
              </button>
              <button onClick={handleShare} className="btn btn-outline">
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>

          {/* Job Overview Specs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            backgroundColor: 'var(--bg-main)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Experience Level</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{job.experienceLevel || 'Mid Level'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Job Category</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{job.category}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date Posted</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{new Date(job.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Applicants</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{job.applicantsCount || 0} applicants</div>
            </div>
          </div>

          {/* Detailed Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Full Job Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.975rem' }}>
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.85rem' }}>Key Responsibilities</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {job.responsibilities.map((resp, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    <CheckCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.85rem' }}>Requirements & Qualifications</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {job.requirements.map((req, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    <Award size={18} color="#8B5CF6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.85rem' }}>Perks & Benefits</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.benefits.map((benefit, i) => (
                  <span key={i} className="badge badge-green" style={{ padding: '0.4rem 0.85rem', fontSize: '0.875rem' }}>
                    <Sparkles size={14} /> {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.85rem' }}>Required Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.skills.map((skill, i) => (
                  <span key={i} className="badge badge-blue" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
