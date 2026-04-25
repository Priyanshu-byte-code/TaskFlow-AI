const express = require('express');
const router = express.Router();
const { getMe, getTeamMembers, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/me', getMe);
router.get('/team/:projectId', getTeamMembers);
router.put('/profile', updateProfile);

module.exports = router;
