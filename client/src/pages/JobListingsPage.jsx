import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import JobDetailsModal from '../components/JobDetailsModal';
import StateDistrictModal from '../components/StateDistrictModal';
import { apiFetch } from '../utils/api';
import { STATE_DISTRICT_DATA } from '../utils/indiaDistricts';
import {
  Search,
  MapPin,
  Filter,
  IndianRupee,
  Briefcase,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  RotateCcw,
  Compass,
  Building2,
  Landmark
} from 'lucide-react';

const JobListingsPage = ({ initialFilters = {}, onApplyJob, onOpenCompanyProfile }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [keyword, setKeyword] = useState(initialFilters.keyword || '');
  const [location, setLocation] = useState(initialFilters.location || '');
  const [selectedState, setSelectedState] = useState('All States & UTs');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [category, setCategory] = useState(initialFilters.category || 'All Categories');
  const [sector, setSector] = useState(initialFilters.sector || 'All'); // 'All', 'Government', 'Private'
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [payType, setPayType] = useState('all'); // 'all', 'thousands', 'lakhs'
  const [minSalary, setMinSalary] = useState(0);
  const [sort, setSort] = useState('newest');
  const [categoriesList, setCategoriesList] = useState([]);

  // State/District Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const states = Object.keys(STATE_DISTRICT_DATA);
  const districts = selectedState && STATE_DISTRICT_DATA[selectedState] ? STATE_DISTRICT_DATA[selectedState] : [];

  // Fetch Jobs function
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);

      let locQuery = location;
      if (selectedDistrict) locQuery = selectedDistrict;
      if (locQuery) params.append('location', locQuery);

      if (selectedState && selectedState !== 'All States & UTs') params.append('state', selectedState);
      if (category && category !== 'All Categories') params.append('category', category);
      if (sector && sector !== 'All') params.append('sector', sector);
      if (jobType) params.append('jobType', jobType);
      if (workMode) params.append('workMode', workMode);
      if (experienceLevel) params.append('experienceLevel', experienceLevel);
      if (minSalary > 0) params.append('minSalary', minSalary);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('limit', 12);

      const data = await apiFetch(`/jobs?${params.toString()}`);
      let fetchedJobs = data.jobs || [];

      // Filter Thousands vs Lakhs if selected
      if (payType === 'thousands') {
        fetchedJobs = fetchedJobs.filter(j => j.salaryPeriod === 'Monthly' || j.maxSalary < 100000);
      } else if (payType === 'lakhs') {
        fetchedJobs = fetchedJobs.filter(j => j.salaryPeriod === 'Yearly' && j.maxSalary >= 100000);
      }

      setJobs(fetchedJobs);
      setTotalCount(data.totalCount || fetchedJobs.length);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching jobs list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiFetch('/jobs/categories').then(data => setCategoriesList(data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [keyword, location, selectedState, selectedDistrict, category, sector, jobType, workMode, experienceLevel, payType, minSalary, sort, page]);

  const handleResetFilters = () => {
    setKeyword('');
    setLocation('');
    setSelectedState('All States & UTs');
    setSelectedDistrict('');
    setCategory('All Categories');
    setSector('All');
    setJobType('');
    setWorkMode('');
    setExperienceLevel('');
    setPayType('all');
    setMinSalary(0);
    setSort('newest');
    setPage(1);
  };

  const handleSelectModalLocation = ({ state: st, district: dist, location: locStr }) => {
    setSelectedState(st);
    setSelectedDistrict(dist);
    setLocation(locStr);
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Top Search & Sector Toggle Bar */}
        <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-main)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <Search size={18} color="var(--primary)" />
              <input
                type="text"
                placeholder="Job title, department, advt no, or skill"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', color: 'var(--text-main)' }}
              />
            </div>

            {/* Sector Quick Buttons */}
            <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--bg-main)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setSector('All')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  backgroundColor: sector === 'All' ? 'var(--primary)' : 'transparent',
                  color: sector === 'All' ? '#fff' : 'var(--text-main)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                All Jobs
              </button>
              <button
                type="button"
                onClick={() => setSector('Government')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  backgroundColor: sector === 'Government' ? '#10B981' : 'transparent',
                  color: sector === 'Government' ? '#fff' : 'var(--text-main)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Landmark size={14} /> Govt (Sarkari)
              </button>
              <button
                type="button"
                onClick={() => setSector('Private')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  backgroundColor: sector === 'Private' ? 'var(--primary)' : 'transparent',
                  color: sector === 'Private' ? '#fff' : 'var(--text-main)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Building2 size={14} /> Private Jobs
              </button>
            </div>

            {/* State & District Explorer Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn btn-secondary"
              style={{ padding: '0.6rem 1rem', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Compass size={16} /> Location: {selectedDistrict ? `${selectedDistrict}, ${selectedState}` : (selectedState !== 'All States & UTs' ? selectedState : 'Pan India')}
            </button>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-control"
              style={{ flex: '1 1 170px', padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
            >
              <option value="All Categories">All Categories</option>
              {categoriesList.map(c => <option key={c._id || c.name} value={c.name}>{c.name}</option>)}
            </select>

            <button onClick={fetchJobs} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
              Search Jobs
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '2rem' }} className="jobs-layout">
          {/* Left Sidebar Filters */}
          <aside className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <SlidersHorizontal size={18} color="var(--primary)" /> Sector & Filters
              </h3>
              <button onClick={handleResetFilters} style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Sector Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="input-label" style={{ marginBottom: '0.4rem', display: 'block' }}>Job Sector</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: sector === 'All' ? 700 : 500 }}>
                  <input type="radio" name="sectorRadio" checked={sector === 'All'} onChange={() => setSector('All')} />
                  All Job Sectors
                </label>
                <label style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#10B981', fontWeight: sector === 'Government' ? 700 : 500 }}>
                  <input type="radio" name="sectorRadio" checked={sector === 'Government'} onChange={() => setSector('Government')} />
                  🏛️ Govt / Sarkari Naukri & PSUs
                </label>
                <label style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)', fontWeight: sector === 'Private' ? 700 : 500 }}>
                  <input type="radio" name="sectorRadio" checked={sector === 'Private'} onChange={() => setSector('Private')} />
                  🏢 Private Company Openings
                </label>
              </div>
            </div>

            {/* Pay Format Selection (Thousands vs Lakhs) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="input-label" style={{ marginBottom: '0.4rem', display: 'block' }}>Salary Range Type</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="payType" checked={payType === 'all'} onChange={() => setPayType('all')} />
                  All Pay Ranges (Thousands & Lakhs)
                </label>
                <label style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="payType" checked={payType === 'thousands'} onChange={() => setPayType('thousands')} />
                  Thousands / Month (₹15k - ₹50k /mo)
                </label>
                <label style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="payType" checked={payType === 'lakhs'} onChange={() => setPayType('lakhs')} />
                  Lakhs Per Annum (₹6 - ₹30+ LPA)
                </label>
              </div>
            </div>

            {/* State Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="input-label" style={{ marginBottom: '0.4rem', display: 'block' }}>Select State / UT</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('');
                }}
                className="input-control"
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                <option value="All States & UTs">All States & UTs</option>
                <option value="Pan India (Remote)">Pan India (Remote)</option>
                {states.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* District Selector */}
            {selectedState && selectedState !== 'All States & UTs' && selectedState !== 'Pan India (Remote)' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="input-label" style={{ marginBottom: '0.4rem', display: 'block' }}>District in {selectedState}</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.875rem' }}
                >
                  <option value="">All Districts in {selectedState}</option>
                  {districts.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Work Mode */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Work Location Mode</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {['', 'On-site', 'Remote', 'Hybrid'].map((mode) => (
                  <label key={mode} style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input
                      type="radio"
                      name="workMode"
                      checked={workMode === mode}
                      onChange={() => setWorkMode(mode)}
                    />
                    {mode || 'Any Mode'}
                  </label>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Employment Type</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {['', 'Full-time', 'Govt Regular', 'Part-time', 'Contract', 'Internship'].map((type) => (
                  <label key={type} style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                    <input
                      type="radio"
                      name="jobType"
                      checked={jobType === type}
                      onChange={() => setJobType(type)}
                    />
                    {type || 'All Job Types'}
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="input-control"
                style={{ fontSize: '0.875rem' }}
              >
                <option value="">All Experience Levels</option>
                <option value="Freshers Eligible">Freshers Eligible</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </aside>

          {/* Right Column: Header bar + Job Listings Grid */}
          <main>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {totalCount} {totalCount === 1 ? 'Job' : 'Jobs'} Found {sector !== 'All' ? `(${sector} Sector)` : ''}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Showing open positions in {selectedDistrict ? `${selectedDistrict}, ${selectedState}` : (selectedState !== 'All States & UTs' ? selectedState : 'Pan India')}
                </p>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort By:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="input-control"
                  style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
                >
                  <option value="newest">Most Recent</option>
                  <option value="salary-high">Highest Pay</option>
                  <option value="popular">Most Viewed</option>
                </select>
              </div>
            </div>

            {/* Job Cards Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                Loading jobs across Indian states & districts...
              </div>
            ) : jobs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                <Search size={44} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Jobs Found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
                  Try resetting sector or district filters.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {jobs.map((job) => (
                  <JobCard
                    key={job._id || job.id}
                    job={job}
                    isSelected={selectedJob?._id === job._id}
                    onSelect={(j) => setSelectedJob(j)}
                    onApply={onApplyJob}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '2.5rem'
              }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className="btn btn-outline btn-sm"
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <span style={{ fontSize: '0.9rem', fontWeight: 600, padding: '0 0.75rem' }}>
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  className="btn btn-outline btn-sm"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Selected Job Modal View */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={onApplyJob}
          onOpenCompanyProfile={onOpenCompanyProfile}
        />
      )}

      {/* State & District Explorer Modal */}
      <StateDistrictModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLocation={handleSelectModalLocation}
      />
    </div>
  );
};

export default JobListingsPage;
