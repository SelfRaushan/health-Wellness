const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware
app.use('/uploads', express.static('uploads'));

// Import routes
const userRoutes = require('./routes/users');
const meditationRoutes = require('./routes/meditations');
const authRoutes = require('./routes/auth');
const alarmRoutes = require('./routes/alarms');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/meditations', meditationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/alarms', alarmRoutes);

// Test route for Day 4-5
app.get('/ping', async (req, res) => {
  const mongoose = require('mongoose');
  
  res.json({ 
    message: 'pong',
    timestamp: new Date().toISOString(),
    project: 'health-Wellness',
    status: 'Day 4-5: Morning Alarm System Ready! ⏰',
    day: 'Day 4-5 - Morning Alarm with Puzzle Complete',
    database: {
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      name: mongoose.connection.name || 'health-wellness',
      collections: ['users', 'meditations', 'exercises', 'calories', 'alarms']
    },
    alarmEndpoints: [
      'POST /api/alarms - Create new alarm',
      'GET /api/alarms - Get user alarms',
      'PUT /api/alarms/:id - Update alarm',
      'DELETE /api/alarms/:id - Delete alarm',
      'PATCH /api/alarms/:id/toggle - Toggle alarm',
      'GET /api/alarms/puzzle - Generate puzzle'
    ],
    nextSteps: ['Day 6-7: Meditation Section', 'Day 8-9: Exercise Section']
  });
});

// Enhanced API status for Day 4-5
app.get('/api/status', async (req, res) => {
  const mongoose = require('mongoose');
  
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    
    res.json({
      status: 'active',
      message: 'Health Wellness API with Alarm System Ready',
      version: '1.1.0',
      day: 'Day 4-5 Complete',
      database: {
        connected: mongoose.connection.readyState === 1,
        name: mongoose.connection.name,
        collections: collections.map(col => col.name),
        totalCollections: collections.length,
        totalUsers: userCount
      },
      features: {
        authentication: 'JWT with bcrypt',
        alarms: 'Smart alarms with puzzle challenges',
        database: 'MongoDB Atlas',
        security: 'Helmet + CORS + Rate Limiting',
        validation: 'Mongoose schemas'
      },
      endpoints: {
        // Authentication
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/profile',
        // Data
        users: 'GET /api/users',
        userStats: 'GET /api/users/stats',
        meditations: 'GET /api/meditations',
        meditationStats: 'GET /api/meditations/stats',
        // Alarms
        alarms: 'GET /api/alarms',
        createAlarm: 'POST /api/alarms',
        updateAlarm: 'PUT /api/alarms/:id',
        deleteAlarm: 'DELETE /api/alarms/:id',
        toggleAlarm: 'PATCH /api/alarms/:id/toggle',
        generatePuzzle: 'GET /api/alarms/puzzle'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database query failed',
      error: error.message
    });
  }
});

// Health check with alarm system status
app.get('/health', async (req, res) => {
  const mongoose = require('mongoose');
  
  res.status(200).json({
    success: true,
    message: 'Server is healthy with alarm system',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    alarmSystem: 'Active'
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    availableRoutes: [
      '/ping', '/api/status', '/health',
      '/api/auth/register', '/api/auth/login',
      '/api/users', '/api/meditations', '/api/alarms'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error Details:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Health-Wellness Backend Server Started');
  console.log(`📱 Server running on port ${PORT}`);
  console.log(`📅 Day 4-5: Morning Alarm System Ready!`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('📊 Database: Connected with alarm collection');
  console.log('⏰ Alarm System: Active with puzzle challenges');
});

module.exports = app;
