import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import SignUpForm from '../components/SignUpForm';
import { useAuth } from '../components/AuthContext';
import { Navigate } from 'react-router-dom';

const SignUp: React.FC = () => {

  if (useAuth().isAuthenticated) {
    return <Navigate to="/dashboard" replace />; 
  }
  
  const handleSubmitSuccess = () => {
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h2" gutterBottom sx={{ pb: 1 }}>
          User Registration
        </Typography>
        <SignUpForm onSubmitSuccess={handleSubmitSuccess} />
      </Paper>
    </Container>
  );
};

export default SignUp;