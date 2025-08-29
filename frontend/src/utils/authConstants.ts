import { Request, Response } from 'express';
import User from '../../backend/models/User'; // Import User as default export from backend model
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/authUtils'; // Import generateToken as named export from authUtils

exports.login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }); // Use the imported User model
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 🚨 DEBUG: Add these console logs
    console.log('=== LOGIN DEBUG ===');
    console.log('Email:', email);
    console.log('Password provided:', password);
    console.log('Stored hash:', user.password);
    console.log('Stored hash length:', user.password.length);
    console.log('Hash starts with:', user.password.substring(0, 7));
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('bcrypt.compare result:', isMatch);
    console.log('===================');

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error: unknown) { // Handle unknown error type
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error', // Safely access error message
    });
  }
};
