import React, { useState } from 'react';
import {
    Grid,
    TextField,
    Button,
    Box,
    FormControlLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { registerUser } from '../services/api';
import { FormData } from '../types/formData';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarContext';

interface SignInFormProps {
    onSubmitSuccess: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSubmitSuccess }) => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
        setError,
    } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            agencyName: '',
            phoneNo: '',
            gender: 0,
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showMessage } = useSnackbar();

      const onSubmit = async (data: FormData) => {
        
        setIsSubmitting(true);
        try {
          const { confirmPassword, ...apiData } = data;
          const resultObj = await registerUser(apiData);
    
          if (resultObj.status == -1) {
            showMessage(resultObj.message || 'An error occurred', 'error');
          }
          else {
            //alert('success')
            showMessage('Success', 'error');
            navigate('/'); // after login, go to home page 
            onSubmitSuccess();
          }
        } catch (error) {
          setError('confirmPassword', {
            type: 'manual',
            message: 'Unable to login. Please try again.',
          });
        } finally {
          setIsSubmitting(false);
        }
      };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
                
                <Grid size={{ xs: 12, md: 12 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Email"
                        type="email"
                        required
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /\S+@\S+\.\S+/, message: 'Email is invalid' },
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                </Grid>
                
                <Grid size={{ xs: 12, md: 12 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Password"
                        type="password"
                        required
                        {...register('password', { required: 'Password is required' })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default SignInForm;