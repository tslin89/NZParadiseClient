// src/pages/EditProperty.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, CircularProgress, Box, Button } from '@mui/material';
import RegisterPropertyForm from '../components/RegisterPropertyForm';
import { getPropertyDetails } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [propertyExists, setPropertyExists] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPropertyExists = async () => {
      if (!id) {
        setPropertyExists(false);
        setIsLoading(false);
        return;
      }
      try {
        const response = await getPropertyDetails(parseInt(id, 10));
        if (!response || !response.data) {
          setPropertyExists(false);
        }
      } catch (error) {
        setPropertyExists(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkPropertyExists();
  }, [id]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!propertyExists || !id) {
    return <Typography sx={{ mt: 8, textAlign: 'center' }}>Invalid or missing property ID.</Typography>;
  }

  const propertyID = parseInt(id, 10);

  const handleSubmitSuccess = () => {
    // After successful update, handled inside RegisterPropertyForm
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Button variant="text" size="small" sx={{mb: 2}} onClick={() => navigate('/mylistings')}>
        <ArrowBackIcon sx={{ mr: 1 }} /> Back to My Listings
      </Button>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom sx={{ pb: 1 }}>
          Edit Property
        </Typography>
        <RegisterPropertyForm
          onSubmitSuccess={handleSubmitSuccess}
          mode="edit"
          propertyID={propertyID}
        />
      </Paper>
    </Container>
  );
};

export default EditProperty;
