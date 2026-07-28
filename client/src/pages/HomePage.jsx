import React, { useState, useEffect } from 'react';
import HeroSearch from '../components/HeroSearch';
import JobCard from '../components/JobCard';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Briefcase,
  Sparkles,
  Building2,
  Users,
  Award,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Star
} from 'lucide-react';

const HomePage = ({ onNavigate, onSelectJob, onApplyJob }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsData = await apiFetch('/jobs?limit=6');
        setFeaturedJobs(jobsData.jobs || []);

        const catData = await apiFetch('/jobs/categories');
        setCategories(catData || []);

        if (user) {
          const aiData = await apiFetch('/ai/recommendations').catch(() => ({ recommendations: [] }));
          setAiRecommendations(aiData.recommendations || []);
        }
      } catch (err) {
        console.error('HomePage data error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleHeroSearch = ({ keyword, location }) => {
    onNavigate('jobs', { keyword, location });
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroSearch onSearch={handleHeroSearch} />

      {/* Stats Counter Bar */}
      <section style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        padding: '2rem 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>2,450+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('activeJobs')}</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>480+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('verifiedEmployers')}</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>12,800+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('successfulHires')}</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>98%</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Employer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section for logged in Seekers */}
      {user && aiRecommendations.length > 0 && (
        <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-main)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <div className="badge badge-purple" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>
                  <Sparkles size={14} /> AI Match Engine
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Top Job Matches For You</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Custom matched based on your skills ({user.skills?.join(', ') || 'React, Node.js'})
                </p>
              </div>
              <button
                onClick={() => onNavigate('jobs')}
                className="btn btn-outline"
              >
                View All Matches <ArrowRight size={16} />
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.5rem'
            }}>
              {aiRecommendations.slice(0, 3).map((job) => (
                <JobCard
                  key={job._id || job.id}
                  job={job}
                  onSelect={onSelectJob}
                  onApply={onApplyJob}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Categories Grid */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-card)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Explore By Popular Category
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Discover career opportunities across India's top industries
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            {categories.map((cat) => (
              <div
                key={cat._id || cat.id || cat.name}
                className="card card-hover"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  cursor: 'pointer'
                }}
                onClick={() => onNavigate('jobs', { category: cat.name })}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: `${cat.color || '#3B82F6'}15`,
                  color: cat.color || '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem'
                }}>
                  <i className={`fas ${cat.icon || 'fa-briefcase'}`}></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {cat.name}
                  </h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {cat.jobCount || 12} open positions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{t('featuredOpenings')}</h2>
              <p style={{ color: 'var(--text-muted)' }}>Recent high-priority jobs from verified employers</p>
            </div>
            <button
              onClick={() => onNavigate('jobs')}
              className="btn btn-primary"
            >
              Browse All Jobs <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}>
            {featuredJobs.map((job) => (
              <JobCard
                key={job._id || job.id}
                job={job}
                onSelect={onSelectJob}
                onApply={onApplyJob}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Employer Call-to-Action Banner */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div className="badge badge-blue" style={{ marginBottom: '1rem', backgroundColor: 'rgba(0, 102, 255, 0.25)', color: '#60A5FA' }}>
                <Building2 size={14} /> For Local Employers
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem', lineHeight: 1.2 }}>
                Hiring Local Talent in India? Post Your Job Opening Today.
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Connect directly with qualified local professionals across all Indian states and districts, review candidate resumes, and manage applicants with our intuitive ATS platform.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('employer-dashboard')}
                className="btn btn-primary btn-lg"
                style={{ padding: '1rem 2rem' }}
              >
                Post a Job Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
