const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get user stats
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const maleUsers = await User.countDocuments({ gender: 'male' });
    const femaleUsers = await User.countDocuments({ gender: 'female' });
    const avgAge = await User.aggregate([
      { $group: { _id: null, avgAge: { $avg: '$age' } } }
    ]);

    res.json({
      success: true,
      stats: {
        total: totalUsers,
        gender: {
          male: maleUsers,
          female: femaleUsers
        },
        averageAge: Math.round(avgAge[0]?.avgAge || 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
