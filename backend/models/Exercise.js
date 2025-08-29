const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  bodyPart: {
    type: String,
    required: [true, 'Body part is required'],
    enum: ['arms', 'legs', 'abs', 'chest', 'back', 'shoulders', 'full-body'],
    lowercase: true
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  gifUrl: {
    type: String,
    required: [true, 'GIF URL is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  duration: {
    type: Number,
    default: 30 // seconds
  },
  reps: {
    type: Number,
    default: 10
  },
  caloriesBurned: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
