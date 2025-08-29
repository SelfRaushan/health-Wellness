const mongoose = require('mongoose');

const calorieSchema = new mongoose.Schema({
  food: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
    maxlength: [100, 'Food name cannot exceed 100 characters']
  },
  calories: {
    type: Number,
    required: [true, 'Calories value is required'],
    min: [0, 'Calories cannot be negative'],
    max: [2000, 'Calories per serving cannot exceed 2000']
  },
  servingSize: {
    type: String,
    required: [true, 'Serving size is required'],
    maxlength: [50, 'Serving size cannot exceed 50 characters']
  },
  category: {
    type: String,
    enum: ['fruit', 'vegetable', 'protein', 'grain', 'dairy', 'snack', 'beverage'],
    default: 'snack'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Calorie', calorieSchema);
