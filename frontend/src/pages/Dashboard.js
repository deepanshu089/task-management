import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard Component
 * Displays overview of tasks and agents
 * @returns {JSX.Element} Dashboard page
 */
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTaskOverviewClick = () => {
    navigate('/tasks');
  };

  const handleAgentOverviewClick = () => {
    navigate('/agents');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{
              p: 3, 
              cursor: 'pointer', 
              textAlign: 'center',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
            onClick={handleTaskOverviewClick}
          >
            <Typography variant="h6" gutterBottom>
              Task Overview
            </Typography>
            {/* Add task statistics here */}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
            onClick={handleAgentOverviewClick}
          >
            <Typography variant="h6" gutterBottom>
              Agent Overview
            </Typography>
            {/* Add agent statistics here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 