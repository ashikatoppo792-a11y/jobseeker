const Job = require('../models/Job');
const mongoose = require('mongoose');
const { memoryStore } = require('../config/db');
const { seedDatabaseIfEmpty } = require('../config/seedJobs');

// Helper to check if MongoDB connection is active
const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc Get all jobs with filtering, sorting, searching & pagination
// @route GET /api/jobs
const getJobs = async (req, res) => {
  try {
    let {
      keyword,
      location,
      state,
      district,
      category,
      sector,
      jobType,
      workMode,
      experienceLevel,
      minSalary,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    // Ensure seed data exists
    await seedDatabaseIfEmpty();

    if (isDBConnected()) {
      // MongoDB Mode
      const query = { status: 'Active' };

      if (keyword) {
        const regex = new RegExp(keyword, 'i');
        query.$or = [
          { title: regex },
          { companyName: regex },
          { description: regex },
          { govtDepartment: regex },
          { officialAdvtNo: regex },
          { skills: { $in: [regex] } }
        ];
      }

      if (location && location !== 'Pan India' && location !== 'All Locations') {
        const locRegex = new RegExp(location, 'i');
        if (!query.$or) {
          query.$or = [
            { location: locRegex },
            { state: locRegex },
            { district: locRegex },
            { city: locRegex }
          ];
        }
      }

      if (state && state !== 'All States & UTs' && state !== 'Pan India (Remote)') {
        query.state = new RegExp(state, 'i');
      }

      if (district) {
        query.district = new RegExp(district, 'i');
      }

      if (category && category !== 'All Categories') {
        query.category = new RegExp(category, 'i');
      }

      if (sector && sector !== 'All') {
        query.sector = sector;
      }

      if (jobType) {
        query.jobType = jobType;
      }

      if (workMode) {
        query.workMode = workMode;
      }

      if (experienceLevel) {
        query.experienceLevel = experienceLevel;
      }

      if (minSalary && Number(minSalary) > 0) {
        query.maxSalary = { $gte: Number(minSalary) };
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'salary-high') {
        sortOptions = { maxSalary: -1 };
      } else if (sort === 'salary-low') {
        sortOptions = { minSalary: 1 };
      } else if (sort === 'popular') {
        sortOptions = { viewsCount: -1 };
      }

      const totalCount = await Job.countDocuments(query);
      const jobs = await Job.find(query)
        .sort(sortOptions)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      return res.json({
        jobs,
        totalCount,
        page: Number(page),
        totalPages: Math.ceil(totalCount / limit) || 1
      });
    }

    // In-Memory Fallback Mode
    let filteredJobs = [...memoryStore.jobs].filter(j => j.status === 'Active');

    // Keyword filter
    if (keyword) {
      const q = keyword.toLowerCase();
      filteredJobs = filteredJobs.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          (j.govtDepartment && j.govtDepartment.toLowerCase().includes(q)) ||
          (j.officialAdvtNo && j.officialAdvtNo.toLowerCase().includes(q)) ||
          (j.skills && j.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    // Location filter
    if (location && location !== 'Pan India' && location !== 'All Locations') {
      const loc = location.toLowerCase();
      filteredJobs = filteredJobs.filter(
        j =>
          j.location.toLowerCase().includes(loc) ||
          (j.state && j.state.toLowerCase().includes(loc)) ||
          (j.district && j.district.toLowerCase().includes(loc))
      );
    }

    // State filter
    if (state && state !== 'All States & UTs' && state !== 'Pan India (Remote)') {
      const st = state.toLowerCase();
      filteredJobs = filteredJobs.filter(
        j => (j.state && j.state.toLowerCase() === st) || j.location.toLowerCase().includes(st)
      );
    }

    // District filter
    if (district) {
      const dist = district.toLowerCase();
      filteredJobs = filteredJobs.filter(
        j => (j.district && j.district.toLowerCase().includes(dist)) || j.location.toLowerCase().includes(dist)
      );
    }

    // Category filter
    if (category && category !== 'All Categories') {
      filteredJobs = filteredJobs.filter(
        j => j.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sector filter (Private vs Government)
    if (sector && sector !== 'All') {
      filteredJobs = filteredJobs.filter(j => j.sector === sector);
    }

    // Job type filter
    if (jobType) {
      filteredJobs = filteredJobs.filter(j => j.jobType === jobType);
    }

    // Work mode filter
    if (workMode) {
      filteredJobs = filteredJobs.filter(j => j.workMode === workMode);
    }

    // Experience level filter
    if (experienceLevel) {
      filteredJobs = filteredJobs.filter(j => j.experienceLevel === experienceLevel);
    }

    // Min salary filter
    if (minSalary && Number(minSalary) > 0) {
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
      totalPages: Math.ceil(totalCount / limit) || 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// @desc Get single job details
// @route GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    if (isDBConnected()) {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: 'Job not found' });
      job.viewsCount = (job.viewsCount || 0) + 1;
      await job.save();
      return res.json(job);
    }

    const job = memoryStore.jobs.find(j => j._id === req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    job.viewsCount = (job.viewsCount || 0) + 1;

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching job details', error: err.message });
  }
};

// @desc Create new job (Employer only)
// @route POST /api/jobs
const createJob = async (req, res) => {
  const {
    title,
    category,
    sector,
    govtDepartment,
    officialAdvtNo,
    location,
    state,
    district,
    city,
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
    applyLink,
    lastDateToApply,
    featured
  } = req.body;

  if (!title || !category || !location || !description) {
    return res.status(400).json({ message: 'Title, category, location, and description are required' });
  }

  try {
    const employer = memoryStore.employers.find(e => e.userId === req.user?._id) || {
      _id: 'e_' + Date.now(),
      companyName: req.user?.name ? req.user.name + ' Corp' : 'Apex Tech',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80'
    };

    const jobData = {
      title,
      employerId: employer._id,
      companyName: employer.companyName,
      companyLogo: employer.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
      sector: sector || 'Private',
      govtDepartment: govtDepartment || '',
      officialAdvtNo: officialAdvtNo || '',
      category,
      location,
      state: state || 'Pan India',
      district: district || '',
      city: city || '',
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
      applyLink: applyLink || '',
      lastDateToApply: lastDateToApply ? new Date(lastDateToApply) : undefined,
      createdAt: new Date()
    };

    if (isDBConnected()) {
      const newJob = await Job.create(jobData);
      return res.status(201).json(newJob);
    }

    jobData._id = 'j_' + Date.now();
    memoryStore.jobs.unshift(jobData);
    res.status(201).json(jobData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create job', error: err.message });
  }
};

// @desc Update job post
// @route PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    if (isDBConnected()) {
      const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!job) return res.status(404).json({ message: 'Job not found' });
      return res.json(job);
    }

    const index = memoryStore.jobs.findIndex(j => j._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Job not found' });

    const updatedJob = { ...memoryStore.jobs[index], ...req.body };
    memoryStore.jobs[index] = updatedJob;
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update job', error: err.message });
  }
};

// @desc Delete job post
// @route DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    if (isDBConnected()) {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) return res.status(404).json({ message: 'Job not found' });
      return res.json({ message: 'Job deleted successfully' });
    }

    const index = memoryStore.jobs.findIndex(j => j._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Job not found' });

    memoryStore.jobs.splice(index, 1);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete job', error: err.message });
  }
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
