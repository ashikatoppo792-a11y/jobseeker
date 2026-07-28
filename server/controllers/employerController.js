const { memoryStore } = require('../config/db');

// @desc Get current employer profile & posted jobs
// @route GET /api/employers/profile
const getEmployerProfile = async (req, res) => {
  let employer = memoryStore.employers.find(e => e.userId === req.user._id);
  if (!employer) {
    // Create default profile for demo if missing
    employer = {
      _id: 'e_' + Date.now(),
      userId: req.user._id,
      companyName: req.user.name + ' Enterprise',
      tagline: 'Leading Local Employer',
      website: 'https://example.com',
      industry: 'Technology',
      companySize: '50-100 employees',
      headquarters: req.user.location || 'Austin, TX',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
      description: 'Innovative company providing high quality services and great local careers.',
      verified: true,
      rating: 4.9,
      reviewCount: 5,
      createdAt: new Date()
    };
    memoryStore.employers.push(employer);
  }

  const jobs = memoryStore.jobs.filter(j => j.employerId === employer._id);
  res.json({ employer, jobs });
};

// @desc Update employer company profile
// @route PUT /api/employers/profile
const updateEmployerProfile = async (req, res) => {
  const index = memoryStore.employers.findIndex(e => e.userId === req.user._id);
  if (index === -1) {
    return res.status(404).json({ message: 'Employer profile not found' });
  }

  const existing = memoryStore.employers[index];
  const updated = { ...existing, ...req.body };
  if (req.file) {
    updated.logo = `/uploads/logos/${req.file.filename}`;
  }

  memoryStore.employers[index] = updated;
  res.json(updated);
};

// @desc Get public profile of an employer by ID & reviews
// @route GET /api/employers/:id
const getEmployerById = async (req, res) => {
  const employer = memoryStore.employers.find(e => e._id === req.params.id);
  if (!employer) {
    return res.status(404).json({ message: 'Company not found' });
  }

  const jobs = memoryStore.jobs.filter(j => j.employerId === employer._id && j.status === 'Active');
  const reviews = memoryStore.reviews.filter(r => r.employerId === employer._id);

  res.json({ employer, jobs, reviews });
};

// @desc Post a company review
// @route POST /api/employers/:id/reviews
const postReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  if (!rating || !title || !comment) {
    return res.status(400).json({ message: 'Rating, title, and comment are required' });
  }

  const employer = memoryStore.employers.find(e => e._id === req.params.id);
  if (!employer) {
    return res.status(404).json({ message: 'Employer not found' });
  }

  const newReview = {
    _id: 'r_' + Date.now(),
    employerId: req.params.id,
    seekerId: req.user._id,
    reviewerName: req.user.name,
    rating: Number(rating),
    title,
    comment,
    createdAt: new Date()
  };

  memoryStore.reviews.unshift(newReview);

  // Recalculate average rating
  const empReviews = memoryStore.reviews.filter(r => r.employerId === req.params.id);
  const avgRating = empReviews.reduce((sum, r) => sum + r.rating, 0) / empReviews.length;
  employer.rating = Number(avgRating.toFixed(1));
  employer.reviewCount = empReviews.length;

  res.status(201).json(newReview);
};

module.exports = {
  getEmployerProfile,
  updateEmployerProfile,
  getEmployerById,
  postReview
};
