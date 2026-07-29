import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  Bookmark,
  Sparkles,
  Eye,
  Clock,
  Landmark,
  Calendar
} from 'lucide-react';

export const formatIndianSalary = (job) => {
  if (!job.minSalary && !job.maxSalary) return 'Competitive Pay';

  // Monthly Period OR under 1 Lakh
  if (job.salaryPeriod === 'Monthly' || job.maxSalary < 100000) {
    const minK = job.minSalary >= 1000 ? `₹${(job.minSalary / 1000).toFixed(0)}k` : `₹${job.minSalary}`;
    const maxK = job.maxSalary >= 1000 ? `₹${(job.maxSalary / 1000).toFixed(0)}k` : `₹${job.maxSalary}`;
    return `${minK} - ${maxK} /month`;
  }

  // Yearly & >= 1 Lakh -> Format as Lakhs (LPA)
  const minLakhs = (job.minSalary / 100000).toFixed(1).replace('.0', '');
  const maxLakhs = (job.maxSalary / 100000).toFixed(1).replace('.0', '');
  return `₹${minLakhs} - ${maxLakhs} LPA`;
};

const JobCard = ({ job, onSelect, onApply, isSelected }) => {
  const { savedJobs, toggleSaveJob } = useAuth();
  const { t } = useLanguage();
  const isSaved = savedJobs.includes(job._id);

  const isGovt = job.sector === 'Government';

  const getWorkModeColor = (mode) => {
    switch (mode) {
      case 'Remote': return 'badge-purple';
      case 'Hybrid': return 'badge-blue';
      default: return 'badge-amber';
    }
  };

  return (
    <div
      className="card card-hover"
      style={{
        padding: '1.25rem 1.5rem',
        borderColor: isSelected ? 'var(--primary)' : (isGovt ? '#10B981' : 'var(--border-color)'),
        backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={() => onSelect(job)}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Company Logo */}
          <img
            src={job.companyLogo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80'}
            alt={job.companyName}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: `1px solid ${isGovt ? '#10B981' : 'var(--border-color)'}`,
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isGovt ? '#10B981' : 'var(--text-muted)' }}>
                {job.companyName}
              </span>

              {/* Govt vs Private Sector Badge */}
              <span
                className={`badge ${isGovt ? 'badge-green' : 'badge-blue'}`}
                style={{ fontSize: '0.7rem', fontWeight: 800 }}
              >
                {isGovt ? <><Landmark size={12} /> {t('govtBadge', 'Govt / Sarkari')}</> : <><Building2 size={12} /> Private</>}
              </span>

              {job.featured && (
                <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                  <Sparkles size={12} /> {t('featured', 'Featured')}
                </span>
              )}
            </div>

            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              margin: '0.2rem 0 0.35rem 0',
              lineHeight: 1.3
            }}>
              {job.title}
            </h3>
          </div>
        </div>

        {/* Save Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveJob(job._id);
          }}
          style={{
            padding: '0.5rem',
            borderRadius: '50%',
            color: isSaved ? 'var(--primary)' : 'var(--text-muted)',
            backgroundColor: isSaved ? 'var(--primary-light)' : 'transparent',
            transition: 'all var(--transition-fast)'
          }}
          title={isSaved ? t('saved', 'Saved') : t('saveJob', 'Save Job')}
        >
          <Bookmark size={19} fill={isSaved ? 'var(--primary)' : 'none'} />
        </button>
      </div>

      {/* Badges / Pill Tags */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        margin: '1rem 0 0.85rem 0'
      }}>
        <span className="badge badge-blue">
          <MapPin size={13} /> {job.location}
        </span>
        <span className="badge badge-green">
          <IndianRupee size={13} /> {formatIndianSalary(job)}
        </span>
        <span className={`badge ${getWorkModeColor(job.workMode)}`}>
          <Briefcase size={13} /> {job.workMode}
        </span>
        <span className="badge badge-gray">
          {job.jobType}
        </span>

        {job.officialAdvtNo && (
          <span className="badge badge-purple" style={{ fontWeight: 700 }}>
            {job.officialAdvtNo}
          </span>
        )}

        {job.lastDateToApply && (
          <span className="badge badge-amber" style={{ fontWeight: 700 }}>
            <Calendar size={12} /> {t('applyBy', 'Apply by')} {new Date(job.lastDateToApply).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Snippet Description */}
      <p style={{
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        lineClamp: 2,
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        display: '-webkit-box',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        {job.description}
      </p>

      {/* Footer Meta & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.75rem',
        borderTop: '1px dashed var(--border-color)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={14} /> {t('posted', 'Posted')} {new Date(job.createdAt).toLocaleDateString()}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(job);
            }}
            className="btn btn-outline btn-sm"
          >
            <Eye size={14} /> {t('quickView', 'Quick View')}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply(job);
            }}
            className={`btn ${isGovt ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          >
            {isGovt ? t('officialApply', 'Official Apply') : t('applyNow', 'Apply Now')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
