const express = require('express');
const router = express.Router();
const {
  getEmployerProfile,
  updateEmployerProfile,
  getEmployerById,
  postReview
} = require('../controllers/employerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, authorize('employer', 'admin'), getEmployerProfile);
router.put('/profile', protect, authorize('employer', 'admin'), upload.single('logo'), updateEmployerProfile);
router.get('/:id', getEmployerById);
router.post('/:id/reviews', protect, postReview);

module.exports = router;
