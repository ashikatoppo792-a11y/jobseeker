const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('resume'), applyForJob);
router.get('/my-applications', protect, authorize('seeker'), getMyApplications);
router.get('/employer-applications', protect, authorize('employer', 'admin'), getEmployerApplications);
router.put('/:id/status', protect, authorize('employer', 'admin'), updateApplicationStatus);

module.exports = router;
