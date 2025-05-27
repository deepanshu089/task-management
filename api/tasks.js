// api/tasks.js

const express = require('express');
const router = express.Router();
const taskController = require('../backend/controllers/taskController');
const { adminAuth } = require('../backend/middleware/auth');
const connectDB = require('../backend/config/db'); // Import connectDB
const dotenv = require('dotenv'); // Import dotenv
const multer = require('multer');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: './backend/.env' }); // Load backend environment variables

// Multer configuration for file uploads (adapted for serverless if needed)
// In a serverless environment, file handling might need adjustments depending on the service
// For Vercel, typically you would not save files to the filesystem directly in a standard way
// However, keeping the multer setup here for now, but be aware of potential limitations/alternatives
const upload = multer({ dest: '/tmp/' }); // Use /tmp/ for temporary storage in Vercel functions

// Initialize a mini-Express app for this function
const app = express();

// Add middleware
app.use(express.json());

// Define task routes using the router
// Note: The base path /api/tasks will be handled by vercel.json rewrites
router.post('/upload', adminAuth, upload.single('file'), taskController.uploadTasks);
router.get('/', adminAuth, taskController.getAllTasks);
router.get('/agent/:agentId', adminAuth, taskController.getAgentTasks);
router.patch('/:taskId', adminAuth, taskController.updateTask);

// Mount the router onto the app at the root path since vercel.json handles the /api/tasks prefix
app.use('/', router);

// Export the Express app as a Vercel handler
module.exports = async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();
    app(req, res);
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 