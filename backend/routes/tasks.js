/**
 * Task Management Routes
 * 
 * This module handles all task-related operations including:
 * - File upload and processing (CSV/XLSX)
 * - Task distribution among agents
 * - Task retrieval and management
 * 
 * @module routes/tasks
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Task = require('../models/Task');
const User = require('../models/User');
const { adminAuth } = require('../middleware/auth');

/**
 * File upload configuration for multer
 * Handles file storage and validation
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

/**
 * File filter middleware
 * Validates file type and size before upload
 * @param {Object} req - Express request object
 * @param {Object} file - Uploaded file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['.csv', '.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.size > maxSize) {
    return cb(new Error('File size too large. Maximum size is 5MB.'), false);
  }

  if (!allowedTypes.includes(ext)) {
    return cb(new Error('Invalid file type. Only CSV, XLSX, and XLS files are allowed.'), false);
  }

  cb(null, true);
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

/**
 * Upload and process task file
 * @route POST /api/tasks/upload
 * @access Private (Admin only)
 * @param {File} file - CSV/XLSX file containing task data
 * @returns {Object} Upload summary and distributed tasks
 */
router.post('/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const tasks = [];
    let stats = { total: 0, invalid: 0 };

    // Read and validate file content
    if (fileExt === '.csv') {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            stats.total++;
            if (isValidTask(row)) {
              tasks.push(createTask(row));
            } else {
              stats.invalid++;
            }
          })
          .on('end', resolve)
          .on('error', reject);
      });
    } else {
      const workbook = xlsx.readFile(filePath);
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      
      data.forEach(row => {
        stats.total++;
        if (isValidTask(row)) {
          tasks.push(createTask(row));
        } else {
          stats.invalid++;
        }
      });
    }

    // Validate tasks and agents
    if (tasks.length === 0) {
      cleanup(filePath);
      return res.status(400).json({ message: 'No valid tasks found in the file.' });
    }

    const agents = await User.find({ role: 'agent' });
    if (agents.length === 0) {
      cleanup(filePath);
      return res.status(400).json({ message: 'No agents available for task distribution' });
    }

    // Distribute and save tasks
    const distributedTasks = await distributeTasks(tasks, agents);
    cleanup(filePath);

    res.status(201).json({
      message: 'Tasks uploaded and distributed successfully',
      summary: {
        totalTasks: tasks.length,
        totalRows: stats.total,
        invalidRows: stats.invalid,
        distribution: getDistributionSummary(distributedTasks, agents)
      },
      tasks: distributedTasks
    });
  } catch (error) {
    if (req.file) cleanup(req.file.path);
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Error processing file', error: error.message });
  }
});

/**
 * Get all tasks
 * @route GET /api/tasks
 * @access Private (Admin only)
 * @returns {Array} List of all tasks with agent details
 */
router.get('/', adminAuth, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get tasks for a specific agent
 * @route GET /api/tasks/agent/:agentId
 * @access Private (Admin only)
 * @param {string} agentId - ID of the agent
 * @returns {Array} List of tasks assigned to the agent
 */
router.get('/agent/:agentId', adminAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.agentId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get agent tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Update a task by ID
 * @route PATCH /api/tasks/:taskId
 * @access Private (Admin or assigned Agent)
 * @param {string} taskId - ID of the task to update
 * @param {Object} req.body - Updated task data (e.g., status, notes)
 * @returns {Object} Updated task object
 */
router.patch('/:taskId', adminAuth, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updates = req.body;
    const allowedUpdates = ['status', 'notes'];
    const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates!' });
    }

    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Basic authorization check (can be expanded)
    if (req.user.role !== 'admin' && task.assignedTo?.toString() !== req.user._id.toString()) {
         return res.status(403).json({ message: 'Not authorized to update this task' });
    }


    Object.keys(updates).forEach((update) => task[update] = updates[update]);

    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Validates a task row from the uploaded file
 * @param {Object} row - Row data from CSV/XLSX
 * @returns {boolean} Whether the row contains valid task data
 */
function isValidTask(row) {
  return row.FirstName && row.Phone && /^\d{10}$/.test(row.Phone);
}

/**
 * Creates a task object from row data
 * @param {Object} row - Row data from CSV/XLSX
 * @returns {Object} Formatted task object
 */
function createTask(row) {
  return {
    firstName: row.FirstName.trim(),
    phone: row.Phone,
    notes: row.Notes ? row.Notes.trim() : ''
  };
}

/**
 * Distributes tasks among available agents
 * @param {Array} tasks - List of tasks to distribute
 * @param {Array} agents - List of available agents
 * @returns {Array} List of distributed tasks
 */
async function distributeTasks(tasks, agents) {
  const distributedTasks = [];
  const tasksPerAgent = Math.ceil(tasks.length / agents.length);

  for (let i = 0; i < tasks.length; i++) {
    const agentIndex = Math.floor(i / tasksPerAgent) % agents.length;
    const task = new Task({
      ...tasks[i],
      assignedTo: agents[agentIndex]._id
    });
    await task.save();
    distributedTasks.push(task);
  }

  return distributedTasks;
}

/**
 * Generates a summary of task distribution among agents
 * @param {Array} tasks - List of distributed tasks
 * @param {Array} agents - List of agents
 * @returns {Array} Distribution summary
 */
function getDistributionSummary(tasks, agents) {
  const distribution = new Map();
  tasks.forEach(task => {
    const count = distribution.get(task.assignedTo.toString()) || 0;
    distribution.set(task.assignedTo.toString(), count + 1);
  });

  return Array.from(distribution.entries()).map(([agentId, count]) => {
    const agent = agents.find(a => a._id.toString() === agentId);
    return { agentName: agent.name, taskCount: count };
  });
}

/**
 * Cleans up uploaded file
 * @param {string} filePath - Path to the file to be deleted
 */
function cleanup(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

module.exports = router; 