import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { STATE_DISTRICT_DATA, ALL_INDIAN_STATES } from '../utils/indiaDistricts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
  Building2,
  PlusCircle,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  FileText,
  TrendingUp,
  Download,
  Trash2,
  Edit3,
  Award,
  IndianRupee,
  MapPin
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const EmployerDashboard = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [employerProfile, setEmployerProfile] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post Job Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology & IT');
  const [state, setState] = useState('Odisha');
  const [district, setDistrict] = useState('Khordha (Bhubaneswar HQ)');
  const [location, setLocation] = useState('Bhubaneswar');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [jobType, setJobType] = useState('Full-time');
  const [experienceLevel, setExperienceLevel] = useState('Mid Level');
  const [salaryPeriod, setSalaryPeriod] = useState('Yearly'); // 'Yearly' (Lakhs / LPA) or 'Monthly' (Thousands / Month)
  const [minSalary, setMinSalary] = useState('1000000');
  const [maxSalary, setMaxSalary] = useState('1600000');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [skills, setSkills] = useState('React, Node.js, JavaScript');
  const [posting, setPosting] = useState(false);
  const [postMsg, setPostMsg] = useState('');

  const availableDistricts = STATE_DISTRICT_DATA[state] || [];

  const fetchEmployerData = async () => {
    if (!token) return;
    try {
      const data = await apiFetch('/employers/profile', { token });
      setEmployerProfile(data.employer);
      setMyJobs(data.jobs || []);

      const appsData = await apiFetch('/applications/employer-applications', { token });
      setApplicants(appsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerData();
  }, [token]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    setPostMsg('');

    try {
      const fullLocation = district ? `${district}, ${state}` : `${location}, ${state}`;
      const resp = await apiFetch('/jobs', {
        method: 'POST',
        token,
        body: JSON.stringify({
          title,
          category,
          location: fullLocation,
          state,
          district,
          workMode,
          jobType,
          experienceLevel,
          salaryPeriod,
          minSalary: Number(minSalary),
          maxSalary: Number(maxSalary),
          salaryCurrency: 'INR',
          description,
          responsibilities: responsibilities.split('\n').filter(Boolean),
          requirements: requirements.split('\n').filter(Boolean),
          skills: skills.split(',').map(s => s.trim())
        })
      });

      setPostMsg(`Job opening published successfully!`);
      fetchEmployerData();
      setActiveTab('myjobs');
      setTitle('');
      setDescription('');
    } catch (err) {
      setPostMsg(err.message || 'Failed to publish job');
    } finally {
      setPosting(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await apiFetch(`/applications/${appId}/status`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ status: newStatus })
      });
      fetchEmployerData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job post?')) return;
    try {
      await apiFetch(`/jobs/${jobId}`, { method: 'DELETE', token });
      fetchEmployerData();
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  const chartLabels = myJobs.map(j => j.title.length > 18 ? j.title.substring(0, 18) + '...' : j.title);
  const chartViewsData = {
    labels: chartLabels.length > 0 ? chartLabels : ['React Dev', 'Support Exec', 'Junior Trainee', 'ICU Nurse'],
    datasets: [
      {
        label: 'Job Views',
        data: myJobs.length > 0 ? myJobs.map(j => j.viewsCount || 45) : [480, 520, 610, 260],
        backgroundColor: '#3B82F6'
      },
      {
        label: 'Applicants',
        data: myJobs.length > 0 ? myJobs.map(j => j.applicantsCount || 8) : [29, 42, 50, 12],
        backgroundColor: '#10B981'
      }
    ]
  };

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        {/* Header Profile */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img
              src={employerProfile?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'}
              alt="Company Logo"
              style={{ width: '60px', height: '60px', borderRadius: '12px', border: '1px solid var(--border-color)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                  {employerProfile?.companyName || 'Apex Infotech India'}
                </h1>
                <span className="badge badge-green"><CheckCircle size={13} /> Verified Employer</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {employerProfile?.industry || 'Technology'} • {employerProfile?.headquarters || 'Bhubaneswar, Odisha'}
              </div>
            </div>
          </div>

          <button onClick={() => setActiveTab('post')} className="btn btn-primary btn-lg">
            <PlusCircle size={18} /> Post Job (Thousands or Lakhs)
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('overview')} className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}>
            <TrendingUp size={16} /> Analytics Overview
          </button>
          <button onClick={() => setActiveTab('myjobs')} className={`btn ${activeTab === 'myjobs' ? 'btn-primary' : 'btn-outline'}`}>
            <Briefcase size={16} /> My Posted Jobs ({myJobs.length})
          </button>
          <button onClick={() => setActiveTab('applicants')} className={`btn ${activeTab === 'applicants' ? 'btn-primary' : 'btn-outline'}`}>
            <Users size={16} /> ATS Applicant Tracking ({applicants.length})
          </button>
          <button onClick={() => setActiveTab('post')} className={`btn ${activeTab === 'post' ? 'btn-primary' : 'btn-outline'}`}>
            <PlusCircle size={16} /> Post Job Form
          </button>
        </div>

        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Job Openings</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{myJobs.length}</div>
              </div>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Applicants</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>{applicants.length}</div>
              </div>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Views</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8B5CF6' }}>
                  {myJobs.reduce((sum, j) => sum + (j.viewsCount || 0), 0) || 1870}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Job Engagement Analytics</h3>
              <div style={{ height: '320px' }}>
                <Bar data={chartViewsData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY POSTED JOBS */}
        {activeTab === 'myjobs' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>Managed Job Posts</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myJobs.map((job) => (
                <div key={job._id} className="card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{job.title}</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                      <span><MapPin size={14} style={{ display: 'inline' }} /> {job.location}</span>
                      <span>• {job.jobType}</span>
                      <span>• Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ fontSize: '0.85rem', textAlign: 'center' }}>
                      <div style={{ fontWeight: 700 }}>{job.applicantsCount || 0}</div>
                      <div style={{ color: 'var(--text-muted)' }}>Applicants</div>
                    </div>
                    <div style={{ fontSize: '0.85rem', textAlign: 'center' }}>
                      <div style={{ fontWeight: 700 }}>{job.viewsCount || 0}</div>
                      <div style={{ color: 'var(--text-muted)' }}>Views</div>
                    </div>

                    <button onClick={() => handleDeleteJob(job._id)} className="btn btn-outline btn-sm" style={{ color: '#EF4444' }}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ATS APPLICANT TRACKING */}
        {activeTab === 'applicants' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>Applicant Tracking System (ATS)</h2>

            {applicants.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <Users size={40} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3>No Applications Received Yet</h3>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {applicants.map((app) => (
                  <div key={app._id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{app.applicantName}</h3>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          Applied for: <strong>{app.jobTitle}</strong> • {new Date(app.appliedDate).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Email: {app.applicantEmail} • Phone: {app.applicantPhone}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="input-control"
                          style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {app.coverLetter && (
                      <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                        "{app.coverLetter}"
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                        <Download size={14} /> Download Candidate Resume ({app.resumeName || 'Resume.pdf'})
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: POST JOB FORM IN INDIA (THOUSANDS OR LAKHS) */}
        {activeTab === 'post' && (
          <div className="card" style={{ maxWidth: '720px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>Post Job (Thousands/Month or Lakhs/Year)</h2>

            {postMsg && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontWeight: 600 }}>
                {postMsg}
              </div>
            )}

            <form onSubmit={handlePostJob}>
              <div className="input-group">
                <label className="input-label">Job Title</label>
                <input type="text" className="input-control" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Customer Support Exec / React Developer" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Category</label>
                  <select className="input-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Technology & IT">Technology & IT</option>
                    <option value="Customer Service & BPO">Customer Service & BPO</option>
                    <option value="Healthcare & Medical">Healthcare & Medical</option>
                    <option value="Hospitality & Retail">Hospitality & Retail</option>
                    <option value="Engineering & Manufacturing">Engineering & Manufacturing</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">State / UT</label>
                  <select
                    className="input-control"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      const dists = STATE_DISTRICT_DATA[e.target.value] || [];
                      if (dists.length > 0) setDistrict(dists[0]);
                    }}
                  >
                    {ALL_INDIAN_STATES.filter(s => s !== 'All States & UTs' && s !== 'Pan India (Remote)').map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">District Target</label>
                  <select className="input-control" value={district} onChange={(e) => setDistrict(e.target.value)}>
                    {availableDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Work Mode</label>
                  <select className="input-control" value={workMode} onChange={(e) => setWorkMode(e.target.value)}>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Pay Frequency</label>
                  <select
                    className="input-control"
                    value={salaryPeriod}
                    onChange={(e) => {
                      setSalaryPeriod(e.target.value);
                      if (e.target.value === 'Monthly') {
                        setMinSalary('18000');
                        setMaxSalary('35000');
                      } else {
                        setMinSalary('1000000');
                        setMaxSalary('1600000');
                      }
                    }}
                  >
                    <option value="Yearly">Lakhs Per Annum (₹ LPA / Year)</option>
                    <option value="Monthly">Thousands Per Month (₹ / Month)</option>
                  </select>
                </div>
              </div>

              {/* Pay Range (Thousands or Lakhs) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">
                    Min Pay ({salaryPeriod === 'Monthly' ? '₹ Thousands / Month' : '₹ Annual, e.g. 1000000 for 10 LPA'})
                  </label>
                  <input
                    type="number"
                    className="input-control"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    placeholder={salaryPeriod === 'Monthly' ? '18000' : '1000000'}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">
                    Max Pay ({salaryPeriod === 'Monthly' ? '₹ Thousands / Month' : '₹ Annual, e.g. 1600000 for 16 LPA'})
                  </label>
                  <input
                    type="number"
                    className="input-control"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    placeholder={salaryPeriod === 'Monthly' ? '35000' : '1600000'}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Required Skills (Comma Separated)</label>
                <input type="text" className="input-control" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>

              <div className="input-group">
                <label className="input-label">Job Description</label>
                <textarea className="input-control" rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Comprehensive job description..." />
              </div>

              <button type="submit" disabled={posting} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
                <PlusCircle size={18} /> {posting ? 'Publishing Job...' : 'Publish Job Opening'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
