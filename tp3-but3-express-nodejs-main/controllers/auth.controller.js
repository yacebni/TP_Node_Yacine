import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// Secret key for JWT signing - in production, this should be in environment variables
const JWT_SECRET = 'my-ultra-secure-and-ultra-long-secret';
const JWT_EXPIRES_IN = '24h';

// Create JWT token
const signToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// Send JWT token in response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      userId: user._id,
      role: user.role
    }
  });
};

// Signup a new user
const signup = async (req, res) => {
  try {
    // If trying to create an admin and not an admin, prevent it
    if (req.body.role === 'admin' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to create an admin user'
      });
    }

    // Create new user
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'user'
    });

    // Remove password from output
    newUser.password = undefined;

    // Create and send token
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

export { signup, login };