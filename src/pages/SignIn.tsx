import { Container, Typography, Paper } from '@mui/material';
import React from "react";
import SignInForm from "../components/SignInForm";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const SignIn: React.FC = () => {
  if (useAuth().isAuthenticated) {
    return <Navigate to="/dashboard" replace />; 
  }
  
  const handleSubmitSuccess = () => {
  };

  return (
    <Container maxWidth="sm" >
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h2" gutterBottom sx={{ pb: 1 }}>
          Sign In
        </Typography>
        <SignInForm onSubmitSuccess={handleSubmitSuccess} />
      </Paper>
    </Container>
  );
};


export default SignIn;
