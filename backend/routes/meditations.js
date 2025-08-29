const express = require('express');
const router = express.Router();
const {
  getAllMeditations,
  getMeditationsByDuration,
  getMeditationStats
} = require('../controllers/meditationController');

// @route   GET /api/meditations
// @desc    Get all meditations
router.get('/', getAllMeditations);

// @route   GET /api/meditations/stats
// @desc    Get meditation statistics
router.get('/stats', getMeditationStats);

// @route   GET /api/meditations/duration/:duration
// @desc    Get meditations by duration
router.get('/duration/:duration', getMeditationsByDuration);

module.exports = router;
