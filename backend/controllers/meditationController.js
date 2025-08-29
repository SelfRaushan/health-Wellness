const Meditation = require('../models/Meditation');

// Get all meditations
exports.getAllMeditations = async (req, res) => {
  try {
    const meditations = await Meditation.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: meditations.length,
      data: meditations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get meditations by duration
exports.getMeditationsByDuration = async (req, res) => {
  try {
    const { duration } = req.params;
    const meditations = await Meditation.find({ duration: parseInt(duration) });
    
    res.json({
      success: true,
      count: meditations.length,
      duration: parseInt(duration),
      data: meditations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get meditation stats
exports.getMeditationStats = async (req, res) => {
  try {
    const total = await Meditation.countDocuments();
    const byDuration = await Meditation.aggregate([
      { $group: { _id: '$duration', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        total,
        byDuration,
        popularDurations: byDuration
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
