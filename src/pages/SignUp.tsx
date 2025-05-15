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
    console.log('Registration successful');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          User Registration
        </Typography>
        <SignUpForm onSubmitSuccess={handleSubmitSuccess} />
      </Paper>
    </Container>
  );
};

export default SignUp;