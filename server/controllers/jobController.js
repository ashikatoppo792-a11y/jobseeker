const { memoryStore } = require('../config/db');

// @desc Get all jobs with filtering, sorting, searching & pagination
// @route GET /api/jobs
const getJobs = async (req, res) => {
  try {
    let {
      keyword,
      location,
      state,
      category,
      jobType,
      workMode,
      experienceLevel,
      minSalary,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    let filteredJobs = [...memoryStore.jobs].filter(j => j.status === 'Active');

    // Keyword filter (title, skills, description, company)
    if (keyword) {
      const q = keyword.toLowerCase();
      filteredJobs = filteredJobs.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          (j.skills && j.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    // Location filter
    if (location && location !== 'Pan India' && location !== 'All Locations') {
      const loc = location.toLowerCase();
      filteredJobs = filteredJobs.filter(
        j => j.location.toLowerCase().includes(loc) || (j.state && j.state.toLowerCase().includes(loc))
      );
    }

    // State filter
    if (state && state !== 'All States & UTs') {
      const st = state.toLowerCase();
      filteredJobs = filteredJobs.filter(
        j => (j.state && j.state.toLowerCase() === st) || j.location.toLowerCase().includes(st)
      );
    }

    // Category filter
    if (category && category !== 'All Categories') {
      filteredJobs = filteredJobs.filter(
        j => j.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Job type filter
    if (jobType) {
      filteredJobs = filteredJobs.filter(j => j.jobType === jobType);
    }

    // Work mode filter (Remote, On-site, Hybrid)
    if (workMode) {
      filteredJobs = filteredJobs.filter(j => j.workMode === workMode);
    }

    // Experience level filter
    if (experienceLevel) {
      filteredJobs = filteredJobs.filter(j => j.experienceLevel === experienceLevel);
    }

    // Min salary filter (in INR / LPA)
    if (minSalary) {
      filteredJobs = filteredJobs.filter(j => j.maxSalary >= Number(minSalary));
    }

    // Sorting
    if (sort === 'salary-high') {
      filteredJobs.sort((a, b) => b.maxSalary - a.maxSalary);
    } else if (sort === 'salary-low') {
      filteredJobs.sort((a, b) => a.minSalary - b.minSalary);
    } else if (sort === 'popular') {
      filteredJobs.sort((a, b) => b.viewsCount - a.viewsCount);
    } else {
      // Default newest
      filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const totalCount = filteredJobs.length;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + Number(limit));

    res.json({
      jobs: paginatedJobs,
      totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// @desc Get single job details & increment view count
// @route GET /api/jobs/:id
const getJobById = async (req, res) => {
  const job = memoryStore.jobs.find(j => j._id === req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  job.viewsCount = (job.viewsCount || 0) + 1;

  const employer = memoryStore.employers.find(e => e._id === job.employerId) || {
    companyName: job.companyName,
    logo: job.companyLogo,
    rating: 4.8,
    reviewCount: 10,
    headquarters: job.location,
    website: 'https://example.com'
  };

  res.json({ ...job, employer });
};

// @desc Create new job (Employer only)
// @route POST /api/jobs
const createJob = async (req, res) => {
  const {
    title,
    category,
    location,
    state,
    workMode,
    jobType,
    experienceLevel,
    minSalary,
    maxSalary,
    salaryPeriod,
    description,
    responsibilities,
    requirements,
    benefits,
    skills,
    featured
  } = req.body;

  if (!title || !category || !location || !description) {
    return res.status(400).json({ message: 'Title, category, location, and description are required' });
  }

  const employer = memoryStore.employers.find(e => e.userId === req.user._id) || {
    _id: 'e_custom_' + Date.now(),
    companyName: req.user.name + ' Corp',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80'
  };

  const newJob = {
    _id: 'j_' + Date.now(),
    title,
    employerId: employer._id,
    companyName: employer.companyName,
    companyLogo: employer.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
    category,
    location,
    state: state || 'Karnataka',
    workMode: workMode || 'On-site',
    jobType: jobType || 'Full-time',
    experienceLevel: experienceLevel || 'Mid Level',
    minSalary: Number(minSalary) || 600000,
    maxSalary: Number(maxSalary) || 1200000,
    salaryCurrency: 'INR',
    salaryPeriod: salaryPeriod || 'Yearly',
    featured: Boolean(featured),
    status: 'Active',
    viewsCount: 0,
    applicantsCount: 0,
    description,
    responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n') : []),
    requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n') : []),
    benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split('\n') : []),
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  };

  memoryStore.jobs.unshift(newJob);
  res.status(201).json(newJob);
};

// @desc Update job post
// @route PUT /api/jobs/:id
const updateJob = async (req, res) => {
  const index = memoryStore.jobs.findIndex(j => j._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Job not found' });
  }

  const existingJob = memoryStore.jobs[index];
  const updatedJob = { ...existingJob, ...req.body };
  memoryStore.jobs[index] = updatedJob;

  res.json(updatedJob);
};

// @desc Delete job post
// @route DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  const index = memoryStore.jobs.findIndex(j => j._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Job not found' });
  }

  memoryStore.jobs.splice(index, 1);
  res.json({ message: 'Job deleted successfully' });
};

// @desc Save / Bookmark job
// @route POST /api/jobs/:id/save
const saveJobToggle = async (req, res) => {
  const userId = req.user._id;
  const jobId = req.params.id;

  const userIndex = memoryStore.users.findIndex(u => u._id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const user = memoryStore.users[userIndex];
  if (!user.savedJobs) user.savedJobs = [];

  const isSaved = user.savedJobs.includes(jobId);
  if (isSaved) {
    user.savedJobs = user.savedJobs.filter(id => id !== jobId);
  } else {
    user.savedJobs.push(jobId);
  }

  memoryStore.users[userIndex] = user;

  res.json({
    saved: !isSaved,
    savedJobs: user.savedJobs,
    message: !isSaved ? 'Job saved to your bookmarks' : 'Job removed from bookmarks'
  });
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  saveJobToggle
};
