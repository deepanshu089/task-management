const authController = require('../../controllers/authController');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://task-management-swart-alpha.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request for testing
  if (req.method === 'GET') {
    res.json({ message: 'Login endpoint is working' });
    return;
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      await authController.login(req, res);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
    return;
  }

  // Handle other methods
  res.status(405).json({ message: 'Method not allowed' });
}; 