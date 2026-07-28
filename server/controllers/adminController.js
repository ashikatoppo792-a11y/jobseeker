const { memoryStore } = require('../config/db');

// @desc Get platform statistics for Admin Dashboard
// @route GET /api/admin/stats
const getAdminStats = async (req, res) => {
  const totalUsers = memoryStore.users.length;
  const totalSeekers = memoryStore.users.filter(u => u.role === 'seeker').length;
  const totalEmployers = memoryStore.employers.length;
  const totalJobs = memoryStore.jobs.length;
  const activeJobs = memoryStore.jobs.filter(j => j.status === 'Active').length;
  const totalApplications = memoryStore.applications.length;
  const totalCategories = memoryStore.categories.length;

  res.json({
    totalUsers,
    totalSeekers,
    totalEmployers,
    totalJobs,
    activeJobs,
    totalApplications,
    totalCategories,
    recentUsers: memoryStore.users.slice(-5),
    recentJobs: memoryStore.jobs.slice(-5),
    recentApplications: memoryStore.applications.slice(-5)
  });
};

// @desc Get all users list
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  res.json(memoryStore.users);
};

// @desc Toggle user status or delete user
// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  const index = memoryStore.users.findIndex(u => u._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  memoryStore.users.splice(index, 1);
  res.json({ message: 'User removed successfully' });
};

// @desc Verify or Approve/Reject Employer
// @route PUT /api/admin/employers/:id/verify
const toggleEmployerVerification = async (req, res) => {
  const employer = memoryStore.employers.find(e => e._id === req.params.id);
  if (!employer) {
    return res.status(404).json({ message: 'Employer not found' });
  }

  employer.verified = !employer.verified;
  res.json({ message: `Employer verification status updated to ${employer.verified}`, employer });
};

// @desc Manage Categories (Create category)
// @route POST /api/admin/categories
const createCategory = async (req, res) => {
  const { name, icon, color } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const newCat = {
    _id: 'cat_' + Date.now(),
    name,
    icon: icon || 'fa-briefcase',
    color: color || '#3B82F6',
    jobCount: 0
  };

  memoryStore.categories.push(newCat);
  res.status(201).json(newCat);
};

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser,
  toggleEmployerVerification,
  createCategory
};
