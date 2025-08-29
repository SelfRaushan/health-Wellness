const mongoose = require('mongoose');

const alarmSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  alarmName: {
    type: String,
    required: [true, 'Alarm name is required'],
    trim: true,
    maxlength: [50, 'Alarm name cannot exceed 50 characters']
  },
  time: {
    type: String,
    required: [true, 'Alarm time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time format (HH:MM)']
  },
  days: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  puzzleType: {
    type: String,
    enum: ['math', 'memory', 'pattern'],
    default: 'math'
  },
  puzzleDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  alarmTone: {
    type: String,
    enum: ['gentle', 'nature', 'classic', 'energetic'],
    default: 'gentle'
  },
  snoozeCount: {
    type: Number,
    default: 0
  },
  maxSnooze: {
    type: Number,
    default: 3
  },
  vibration: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastTriggered: {
    type: Date
  }
});

module.exports = mongoose.model('Alarm', alarmSchema);
