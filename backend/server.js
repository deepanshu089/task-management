const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Note: Routes and middleware are now primarily handled within the api/ directory for serverless deployment.
// This server.js file might only be used for local development setup that mimics the serverless environment
// or can be entirely removed if local development is also done via a serverless emulation tool.

// Error handling middleware (keep for potential local testing setup)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// This file no longer starts a traditional server listening on a port.
// In a serverless deployment, each function (e.g., in api/) is an entry point.
// For local development, you might use a tool like vercel dev.

module.exports = app; // Export the app for potential use in local serverless emulation 