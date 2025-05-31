import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import SignUpForm from '../components/SignUpForm';
import { useAuth } from '../components/AuthContext';

const EditProfile: React.FC = () => {
  const { user } = useAuth();

  const handleSubmitSuccess = () => {
    
  };

  if (!user) return <div>Loading...</div>; 

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Edit Profile
        </Typography>
        <SignUpForm
          onSubmitSuccess={handleSubmitSuccess}
          initialValues={user} 
          mode="edit"
        />
      </Paper>
    </Container>
  );
};

export default EditProfile;
