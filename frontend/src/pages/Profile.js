import React from 'react';
import { Box, Typography, Paper, TextField, Button, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

/**
 * Profile Component
 * Displays and allows editing of user profile
 * @returns {JSX.Element} Profile page
 */
const Profile = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              value={user?.name || ''}
              disabled
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={user?.email || ''}
              disabled
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Role"
              value={user?.role || ''}
              disabled
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              disabled
            >
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile; 