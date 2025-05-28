const express = require('express');
const cors = require('cors');
const authController = require('../../controllers/authController');

const app = express();

// CORS middleware
app.use(cors({
  origin: 'https://task-management-swart-alpha.vercel.app',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Handle preflight
app.options('*', cors());

// Login route
app.post('/', async (req, res) => {
  try {
    // Set CORS headers explicitly
    res.setHeader('Access-Control-Allow-Origin', 'https://task-management-swart-alpha.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    await authController.login(req, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Export the Express app
module.exports = app; 