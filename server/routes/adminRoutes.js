const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  deleteUser,
  toggleEmployerVerification,
  createCategory
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/employers/:id/verify', protect, authorize('admin'), toggleEmployerVerification);
router.post('/categories', protect, authorize('admin'), createCategory);

module.exports = router;
