import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import JobCard from '../components/JobCard';
import {
  User,
  FileText,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  Upload,
  Save,
  AlertCircle,
  Bell
} from 'lucide-react';

const JobSeekerDashboard = ({ onSelectJob, onApplyJob }) => {
  const { user, token, updateUser, savedJobs } = useAuth();
  const [activeTab, setActiveTab] = useState('applications'); // 'applications', 'saved', 'profile', 'recommendations'
  
  // Applications State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.title || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skillsStr, setSkillsStr] = useState(user?.skills?.join(', ') || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Saved Jobs & AI Recommendations State
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!token) return;

    // Fetch User Applications
    apiFetch('/applications/my-applications', { token })
      .then(data => setApplications(data || []))
      .catch(err => console.error(err))
      .finally(() => setLoadingApps(false));

    // Fetch Saved Jobs
    apiFetch('/jobs').then(res => {
      const allJobs = res.jobs || [];
      setSavedJobsList(allJobs.filter(j => savedJobs.includes(j._id)));
    });

    // Fetch AI Recommendations
    apiFetch('/ai/recommendations', { token })
      .then(data => setRecommendations(data.recommendations || []))
      .catch(() => {});
  }, [token, savedJobs]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');

    try {
      const skillsArray = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      const updated = await apiFetch('/auth/profile', {
        method: 'PUT',
        token,
        body: JSON.stringify({
          name,
          title,
          phone,
          location,
          bio,
          skills: skillsArray
        })
      });

      updateUser(updated);
      setProfileMsg('Profile and skills updated successfully!');
    } catch (err) {
      setProfileMsg('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return <span className="badge badge-green"><CheckCircle2 size={13} /> Accepted</span>;
      case 'Interviewing':
        return <span className="badge badge-purple"><Sparkles size={13} /> Interview Scheduled</span>;
      case 'Under Review':
        return <span className="badge badge-blue"><Clock size={13} /> Under Review</span>;
      case 'Rejected':
        return <span className="badge badge-gray" style={{ color: '#EF4444' }}>Not Selected</span>;
      default:
        return <span className="badge badge-amber"><Clock size={13} /> Pending</span>;
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Profile Summary */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontWeight: 800,
              fontSize: '1.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--primary)'
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>{user?.name}</h1>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {user?.title || 'Job Seeker'} • {user?.location || 'Austin, TX'}
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                {(user?.skills || ['React', 'JavaScript']).slice(0, 4).map((s, i) => (
                  <span key={i} className="badge badge-blue" style={{ fontSize: '0.75rem' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '0.75rem 1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{applications.length}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Applied Jobs</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.75rem 1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>{savedJobs.length}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Saved Jobs</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('applications')}
            className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`}
          >
            <FileText size={16} /> Applied Jobs ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`btn ${activeTab === 'saved' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Bookmark size={16} /> Saved Jobs ({savedJobsList.length})
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`btn ${activeTab === 'recommendations' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Sparkles size={16} /> AI Matches
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
          >
            <User size={16} /> Edit Profile & Resume
          </button>
        </div>

        {/* TAB 1: APPLIED JOBS */}
        {activeTab === 'applications' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>Application Tracker</h2>

            {loadingApps ? (
              <div style={{ color: 'var(--text-muted)' }}>Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <FileText size={40} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3>No Applications Submitted Yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Start applying for local job openings to track application progress here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {applications.map((app) => (
                  <div key={app._id} className="card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{app.job?.title || 'Applied Position'}</h3>
                        {getStatusBadge(app.status)}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                        <span><Building2 size={14} style={{ display: 'inline', marginRight: '4px' }} /> {app.job?.companyName}</span>
                        <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Resume: <strong>{app.resumeName || 'Resume.pdf'}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED JOBS */}
        {activeTab === 'saved' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>Saved Job Bookmarks</h2>

            {savedJobsList.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <Bookmark size={40} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3>No Saved Jobs</h3>
                <p style={{ color: 'var(--text-muted)' }}>Click the bookmark icon on any job card to save it for later.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                {savedJobsList.map(job => (
                  <JobCard key={job._id} job={job} onSelect={onSelectJob} onApply={onApplyJob} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI MATCHES */}
        {activeTab === 'recommendations' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>AI Skill-Matched Jobs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {recommendations.map(job => (
                <JobCard key={job._id} job={job} onSelect={onSelectJob} onApply={onApplyJob} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EDIT PROFILE & RESUME */}
        {activeTab === 'profile' && (
          <div className="card" style={{ maxWidth: '680px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>Profile & Resume Settings</h2>

            {profileMsg && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontWeight: 600 }}>
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input type="text" className="input-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Professional Title</label>
                  <input type="text" className="input-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" />
                </div>
                <div className="input-group">
                  <label className="input-label">Location</label>
                  <input type="text" className="input-control" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Austin, TX" />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Skills (Comma Separated)</label>
                <input type="text" className="input-control" value={skillsStr} onChange={(e) => setSkillsStr(e.target.value)} placeholder="React, Node.js, JavaScript, MongoDB, CSS" />
              </div>

              <div className="input-group">
                <label className="input-label">Bio / Summary</label>
                <textarea className="input-control" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Brief introduction about your technical background..." />
              </div>

              <button type="submit" disabled={savingProfile} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
                <Save size={18} /> {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
