const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserStats
} = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users
router.get('/', getAllUsers);

// @route   GET /api/users/stats
// @desc    Get user statistics
router.get('/stats', getUserStats);

module.exports = router;
