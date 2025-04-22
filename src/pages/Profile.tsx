import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { useAuth } from '../components/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom sx={{ pb: 1 }}>
          Profile
        </Typography>
        <Typography variant="body1">
          Name: {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="body1">User ID: {user?.userID}</Typography>
        <Typography variant="body1">User Type: {user?.userType}</Typography>
      </Paper>
    </Container>
  );
};

export default Profile;