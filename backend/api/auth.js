const express = require('express');
const cors = require('cors');
const authController = require('../controllers/authController');

const router = express.Router();

// CORS configuration
const corsOptions = {
  origin: [
    'https://task-management-swart-alpha.vercel.app',
    'http://localhost:3000' // for local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS to all routes
router.use(cors(corsOptions));

// Auth routes
router.post('/login', authController.login);

module.exports = router; 