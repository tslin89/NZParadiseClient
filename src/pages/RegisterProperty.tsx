import React from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
// import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// import { useSnackbar } from '../components/SnackbarContext';
// import { useAuth } from '../components/AuthContext';
// import { registerProperty } from '../services/api'; // Assume this API function exists
import RegisterPropertyForm from '../components/RegisterPropertyForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const RegisterProperty: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmitSuccess = () => {

  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* <Button variant="text" size="small" sx={{mb: 2}} onClick={() => navigate('/mylistings')}>
        <ArrowBackIcon sx={{ mr: 1 }} />Back to My Listings
      </Button> */}
      <Button variant="text" size="small" sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        <ArrowBackIcon sx={{ mr: 1 }} /> Back
      </Button>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom sx={{ pb: 1 }}>
          Register Property
        </Typography>
        <RegisterPropertyForm onSubmitSuccess={handleSubmitSuccess} />
      </Paper>
    </Container>
  );
};

export default RegisterProperty;