import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Star,
  CheckCircle,
  MessageSquare,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const CompanyProfilePage = ({ employerId, onBack, onSelectJob, onApplyJob }) => {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review Form
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  const fetchCompanyData = async () => {
    try {
      const res = await apiFetch(`/employers/${employerId || 'e1'}`);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [employerId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please sign in as a job seeker to post a company review.');
      return;
    }

    try {
      await apiFetch(`/employers/${employerId || 'e1'}/reviews`, {
        method: 'POST',
        token,
        body: JSON.stringify({ rating: Number(rating), title, comment })
      });
      setReviewMsg('Review posted successfully!');
      setShowReviewModal(false);
      fetchCompanyData();
    } catch (err) {
      alert('Failed to post review');
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading company profile...</div>;
  if (!data) return <div style={{ padding: '4rem', textAlign: 'center' }}>Company profile not found</div>;

  const { employer, jobs, reviews } = data;

  return (
    <div style={{ padding: '2rem 0', backgroundColor: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        <button onClick={onBack} className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Listings
        </button>

        {/* Company Header Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <img
                src={employer.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'}
                alt={employer.companyName}
                style={{ width: '80px', height: '80px', borderRadius: '16px', border: '1px solid var(--border-color)' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{employer.companyName}</h1>
                  {employer.verified && <span className="badge badge-green"><CheckCircle size={14} /> Verified Employer</span>}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0.25rem 0' }}>{employer.tagline}</p>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <span><MapPin size={14} style={{ display: 'inline' }} /> {employer.headquarters}</span>
                  <span><Users size={14} style={{ display: 'inline' }} /> {employer.companySize}</span>
                  {employer.website && <span><Globe size={14} style={{ display: 'inline' }} /> <a href={employer.website} target="_blank" rel="noreferrer">{employer.website}</a></span>}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.6rem', fontWeight: 800, color: '#F59E0B' }}>
                <Star size={24} fill="#F59E0B" /> {employer.rating || 4.8}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Based on {employer.reviewCount || reviews.length} employee & candidate reviews
              </div>
              <button onClick={() => setShowReviewModal(true)} className="btn btn-outline btn-sm">
                <MessageSquare size={14} /> Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* Open Job Postings */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Open Positions at {employer.companyName} ({jobs.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {jobs.map(j => (
              <JobCard key={j._id} job={j} onSelect={onSelectJob} onApply={onApplyJob} />
            ))}
          </div>
        </div>

        {/* Company Reviews List */}
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Company Ratings & Reviews
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map(r => (
              <div key={r._id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{r.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#F59E0B', fontWeight: 700 }}>
                    <Star size={16} fill="#F59E0B" /> {r.rating} / 5
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '0.5rem' }}>
                  "{r.comment}"
                </p>
                <div style={{ fontSize: '0.785rem', color: 'var(--text-light)' }}>
                  By {r.reviewerName} • {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-backdrop" onClick={() => setShowReviewModal(false)}>
          <div className="modal-card" style={{ maxWidth: '500px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>Review {employer.companyName}</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="input-group">
                <label className="input-label">Rating (1 to 5 Stars)</label>
                <select className="input-control" value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Needs Improvement</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Review Headline / Title</label>
                <input type="text" className="input-control" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Great workplace culture..." />
              </div>

              <div className="input-group">
                <label className="input-label">Detailed Feedback</label>
                <textarea className="input-control" rows={4} required value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience working at or interviewing with this company..." />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfilePage;
