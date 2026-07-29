const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  saveJobToggle,
  getStateCounts
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { memoryStore } = require('../config/db');

router.get('/', getJobs);
router.get('/categories', (req, res) => res.json(memoryStore.categories));
router.get('/state-counts', getStateCounts);
router.get('/:id', getJobById);
router.post('/', protect, authorize('employer', 'admin'), createJob);
router.put('/:id', protect, authorize('employer', 'admin'), updateJob);
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);
router.post('/:id/save', protect, saveJobToggle);

module.exports = router;
