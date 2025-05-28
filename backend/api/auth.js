const express = require('express');
const cors = require('cors');
const authController = require('../controllers/authController');

const router = express.Router();

// CORS middleware
const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://task-management-swart-alpha.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
};

// Apply CORS middleware to all routes
router.use(corsMiddleware);

// Auth routes
router.post('/login', authController.login);

module.exports = router; 