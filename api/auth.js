// api/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../backend/controllers/authController');
const connectDB = require('../backend/config/db'); // Import connectDB
const dotenv = require('dotenv'); // Import dotenv

dotenv.config({ path: './backend/.env' }); // Load backend environment variables

// Initialize a mini-Express app for this function
const app = express();

// Add middleware
app.use(express.json());

// Define your authentication routes using the router
router.post('/login', authController.login);

// Mount the router onto the app at the desired base path
app.use('/api/auth', router);

// Export the Express app as a Vercel handler
module.exports = async (req, res) => {
  await connectDB(); // Connect to database before handling request
  // Pass the request and response to the Express app
  app(req, res);
};

/*
Alternatively, you could directly handle the request and response
without a full Express app for simpler cases:

module.exports = (req, res) => {
  if (req.method === 'POST' && req.url === '/api/auth/login') {
    // Directly handle login logic or call a controller function
    // Need to parse body manually if not using express.json here
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const userData = JSON.parse(body);
      // Call login logic
      // Send response
    });
  } else {
    res.status(404).send('Not Found');
  }
};
*/ 