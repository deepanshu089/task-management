/**
 * Tasks Component
 * 
 * This component handles the task management interface, including:
 * - Displaying all tasks in a table format
 * - Uploading and processing task files (CSV/XLSX)
 * - Showing task distribution summary
 * - Error handling and loading states
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  TextField,
  MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

/**
 * Styled component for hidden file input
 * Ensures the file input is not visible but still accessible
 */
const HiddenInput = styled('input')`
  display: none;
`;

/**
 * Tasks Component
 * @returns {JSX.Element} Rendered component
 */
const Tasks = () => {
  // State management
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [summary, setSummary] = useState(null);
  const { user } = useAuth();

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTaskData, setUpdatedTaskData] = useState({ status: '', notes: '' });

  /**
   * Fetch tasks from the API
   * @async
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Handle file upload and processing
   * @param {Event} event - File input change event
   */
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      setError('Please upload a CSV, XLSX, or XLS file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload file');
      }

      const data = await response.json();
      setSuccess('Tasks uploaded successfully');
      setSummary(data.summary);
      fetchTasks();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'warning';
      case 'pending':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleOpenUpdateDialog = (task) => {
    setSelectedTask(task);
    setUpdatedTaskData({ status: task.status || '', notes: task.notes || '' });
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedTask(null);
    setUpdatedTaskData({ status: '', notes: '' });
    setError(''); // Clear any previous errors on close
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;

    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${selectedTask._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedTaskData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update task');
      }

      // Refresh tasks after successful update
      fetchTasks();
      handleCloseUpdateDialog();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedTaskData({ ...updatedTaskData, [name]: value });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Task Management
        </Typography>
        {user?.role === 'admin' && (
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
          >
            Upload Tasks
            <HiddenInput
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
            />
          </Button>
        )}
      </Box>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty State */}
      {!loading && tasks.length === 0 && !error && (
        <Alert severity="info">
          No tasks found. {user?.role === 'admin' ? 'Upload a file to create tasks.' : 'No tasks have been assigned to you yet.'}
        </Alert>
      )}

      {/* Tasks Table */}
      {!loading && tasks.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.firstName}</TableCell>
                  <TableCell>{task.phone}</TableCell>
                  <TableCell>{task.notes}</TableCell>
                  <TableCell>{task.assignedTo?.name || 'Unassigned'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status || 'Pending'} 
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(task.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenUpdateDialog(task)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Upload Summary Dialog */}
      <Dialog
        open={!!summary}
        onClose={() => setSummary(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Summary</DialogTitle>
        <DialogContent>
          {summary && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Total Rows Processed"
                  secondary={summary.totalRows}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Valid Tasks"
                  secondary={summary.totalTasks}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Invalid Rows"
                  secondary={summary.invalidRows}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Task Distribution"
                  secondary={
                    <List dense>
                      {summary.distribution.map((dist, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={dist.agentName}
                            secondary={`${dist.taskCount} tasks`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  }
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSummary(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Task Update Dialog */}
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update Task</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          <TextField
            margin="dense"
            name="status"
            label="Status"
            type="text"
            fullWidth
            variant="outlined"
            value={updatedTaskData.status}
            onChange={handleInputChange}
            select
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="notes"
            label="Notes"
            type="text"
            fullWidth
            variant="outlined"
            value={updatedTaskData.notes}
            onChange={handleInputChange}
            multiline
            rows={4}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateTask} color="primary" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tasks; 