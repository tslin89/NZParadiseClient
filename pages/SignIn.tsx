import { Container, Typography, Paper } from '@mui/material';
import React from "react";
import SignInForm from "../components/SignInForm";

const SignIn: React.FC = () => {

  const handleSubmitSuccess = () => {
    console.log('Registration successful');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom sx={{ pb: 1 }}>
          Sign In
        </Typography>
        <SignInForm onSubmitSuccess={handleSubmitSuccess} />
      </Paper>
    </Container>
  );
};


export default SignIn;
