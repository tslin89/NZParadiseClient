import React, { useState, useRef, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { signIn } from '../services/api';
import { UserData } from '../types/formData';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarContext';
import { useAuth } from '../components/AuthContext';

interface SignInFormProps {
  onSubmitSuccess: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSubmitSuccess }) => {
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UserData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: UserData) => {
    setIsSubmitting(true);
    try {
      const resultObj = await signIn(data);

      if (resultObj.status === -1) {
        showMessage(resultObj.message || 'An error occurred', 'error');
      } else {
        // Store the JWT and user info
        login(resultObj.data.token, resultObj.data.user);
        //showMessage('Login successful', 'success');
        navigate('/dashboard');
        onSubmitSuccess();
      }
    } catch (error) {
      setError('password', {
        type: 'manual',
        message: 'Unable to login. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ pb: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          <TextField
            fullWidth
            inputRef={emailRef}
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              sx={{

                width: { xs: '100%', md: 'auto' }
              }}

              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignInForm;