const Alarm = require('../models/Alarm');

// Create new alarm
exports.createAlarm = async (req, res) => {
  try {
    const { alarmName, time, days, puzzleType, puzzleDifficulty, alarmTone, maxSnooze, vibration } = req.body;
    
    const alarm = await Alarm.create({
      userId: req.user.id,
      alarmName,
      time,
      days: days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      puzzleType,
      puzzleDifficulty,
      alarmTone,
      maxSnooze,
      vibration
    });

    res.status(201).json({
      success: true,
      message: 'Alarm created successfully',
      data: alarm
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get user's alarms
exports.getUserAlarms = async (req, res) => {
  try {
    const alarms = await Alarm.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: alarms.length,
      data: alarms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update alarm
exports.updateAlarm = async (req, res) => {
  try {
    const alarm = await Alarm.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!alarm) {
      return res.status(404).json({
        success: false,
        message: 'Alarm not found'
      });
    }

    const updatedAlarm = await Alarm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Alarm updated successfully',
      data: updatedAlarm
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete alarm
exports.deleteAlarm = async (req, res) => {
  try {
    const alarm = await Alarm.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!alarm) {
      return res.status(404).json({
        success: false,
        message: 'Alarm not found'
      });
    }

    await Alarm.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Alarm deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Toggle alarm active status
exports.toggleAlarm = async (req, res) => {
  try {
    const alarm = await Alarm.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!alarm) {
      return res.status(404).json({
        success: false,
        message: 'Alarm not found'
      });
    }

    alarm.isActive = !alarm.isActive;
    await alarm.save();

    res.json({
      success: true,
      message: `Alarm ${alarm.isActive ? 'activated' : 'deactivated'} successfully`,
      data: alarm
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Generate puzzle for alarm
exports.generatePuzzle = async (req, res) => {
  try {
    const { type, difficulty } = req.query;
    
    let puzzle = {};
    
    switch (type) {
      case 'math':
        puzzle = generateMathPuzzle(difficulty);
        break;
      case 'memory':
        puzzle = generateMemoryPuzzle(difficulty);
        break;
      case 'pattern':
        puzzle = generatePatternPuzzle(difficulty);
        break;
      default:
        puzzle = generateMathPuzzle('easy');
    }

    res.json({
      success: true,
      data: puzzle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Helper functions for puzzle generation
const generateMathPuzzle = (difficulty) => {
  let num1, num2, operation, answer;
  
  switch (difficulty) {
    case 'easy':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operation = '+';
      answer = num1 + num2;
      break;
    case 'medium':
      num1 = Math.floor(Math.random() * 50) + 10;
      num2 = Math.floor(Math.random() * 20) + 5;
      operation = Math.random() > 0.5 ? '+' : '-';
      answer = operation === '+' ? num1 + num2 : num1 - num2;
      break;
    case 'hard':
      num1 = Math.floor(Math.random() * 12) + 2;
      num2 = Math.floor(Math.random() * 12) + 2;
      operation = '×';
      answer = num1 * num2;
      break;
    default:
      return generateMathPuzzle('easy');
  }
  
  return {
    type: 'math',
    question: `${num1} ${operation} ${num2} = ?`,
    answer: answer,
    options: generateMathOptions(answer)
  };
};

const generateMathOptions = (correctAnswer) => {
  const options = [correctAnswer];
  
  while (options.length < 4) {
    const wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
    if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }
  
  return options.sort(() => Math.random() - 0.5);
};

const generateMemoryPuzzle = (difficulty) => {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const sequenceLength = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  
  const sequence = [];
  for (let i = 0; i < sequenceLength; i++) {
    sequence.push(colors[Math.floor(Math.random() * colors.length)]);
  }
  
  return {
    type: 'memory',
    sequence: sequence,
    question: 'Repeat this color sequence',
    showTime: difficulty === 'easy' ? 3000 : difficulty === 'medium' ? 2000 : 1500
  };
};

const generatePatternPuzzle = (difficulty) => {
  const patterns = [
    [1, 2, 3, 4, 5],
    [2, 4, 6, 8, 10],
    [1, 4, 9, 16, 25],
    [1, 1, 2, 3, 5]
  ];
  
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  const missing = Math.floor(Math.random() * pattern.length);
  const patternWithMissing = [...pattern];
  const answer = patternWithMissing[missing];
  patternWithMissing[missing] = '?';
  
  return {
    type: 'pattern',
    pattern: patternWithMissing,
    question: 'Complete the pattern',
    answer: answer,
    options: [answer, answer + 1, answer - 1, answer + 2].sort(() => Math.random() - 0.5)
  };
};
