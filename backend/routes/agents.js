const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');

// Create new agent
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, email, mobileNumber, countryCode, password } = req.body;

    // Check if agent already exists
    const existingAgent = await User.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    // Create new agent
    const agent = new User({
      name,
      email,
      mobileNumber,
      countryCode,
      password,
      role: 'agent'
    });

    await agent.save();

    res.status(201).json({
      message: 'Agent created successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobileNumber: agent.mobileNumber,
        countryCode: agent.countryCode
      }
    });
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all agents
router.get('/', adminAuth, async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update agent
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, email, mobileNumber, countryCode } = req.body;
    const agent = await User.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    if (agent.role !== 'agent') {
      return res.status(400).json({ message: 'Invalid agent ID' });
    }

    // Update agent details
    agent.name = name || agent.name;
    agent.email = email || agent.email;
    agent.mobileNumber = mobileNumber || agent.mobileNumber;
    agent.countryCode = countryCode || agent.countryCode;

    await agent.save();

    res.json({
      message: 'Agent updated successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobileNumber: agent.mobileNumber,
        countryCode: agent.countryCode
      }
    });
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete agent
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const agent = await User.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    if (agent.role !== 'agent') {
      return res.status(400).json({ message: 'Invalid agent ID' });
    }

    await agent.remove();

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 