import React, { useState } from 'react';
import { Container, Typography, Paper, TextField, Button, Grid, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarContext';
import { useAuth } from '../components/AuthContext';
import { registerProperty } from '../services/api'; // Assume this API function exists

interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  // Add other property fields as needed
}

const RegisterProperty: React.FC = () => {
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { user } = useAuth(); // Access user info
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) {
      showMessage('User not authenticated', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerProperty({
        ...data,
        userID: user.userID,
        userType: user.userType,
      });
      showMessage('Property registered successfully', 'success');
      navigate('/mylistings');
    } catch (error) {
      showMessage('Failed to register property', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom sx={{ pb: 1 }}>
          Register Property
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Title"
                {...register('title', { required: 'Title is required' })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...register('description', { required: 'Description is required' })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price cannot be negative' },
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register Property'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterProperty;