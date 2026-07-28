const express = require('express');
const router = express.Router();
const { getRecommendations, aiAssistantChat } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recommendations', protect, getRecommendations);
router.post('/chat', protect, aiAssistantChat);

module.exports = router;
