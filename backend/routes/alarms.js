const express = require('express');
const router = express.Router();
const {
  createAlarm,
  getUserAlarms,
  updateAlarm,
  deleteAlarm,
  toggleAlarm,
  generatePuzzle
} = require('../controllers/alarmController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// @route   POST /api/alarms
// @desc    Create new alarm
router.post('/', createAlarm);

// @route   GET /api/alarms
// @desc    Get user's alarms
router.get('/', getUserAlarms);

// @route   PUT /api/alarms/:id
// @desc    Update alarm
router.put('/:id', updateAlarm);

// @route   DELETE /api/alarms/:id
// @desc    Delete alarm
router.delete('/:id', deleteAlarm);

// @route   PATCH /api/alarms/:id/toggle
// @desc    Toggle alarm active status
router.patch('/:id/toggle', toggleAlarm);

// @route   GET /api/alarms/puzzle
// @desc    Generate puzzle for alarm
router.get('/puzzle', generatePuzzle);

module.exports = router;
