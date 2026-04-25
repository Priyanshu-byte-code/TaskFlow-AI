const express = require('express');
const router = express.Router();
const { prioritizeTasks, askAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/prioritize', prioritizeTasks);
router.post('/ask', askAI);

module.exports = router;
