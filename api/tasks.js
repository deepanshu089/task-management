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

// Mount the router onto the app at the desired base path
// Vercel rewrites will handle routing to this function, so the base path here might be just '/' or '/api/tasks' depending on vercel.json
// Let's use '/' here and handle the /api/tasks base path in vercel.json
app.use('/', router);

// Export the Express app as a Vercel handler
module.exports = async (req, res) => {
  await connectDB(); // Connect to database before handling request
  // Pass the request and response to the Express app
  app(req, res);
}; 