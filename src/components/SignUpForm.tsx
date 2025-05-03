import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import PasswordStrength from './PasswordStrength'
import { registerUser } from '../services/api';
import { UserData } from '../types/formData';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarContext';


interface SignUpFormProps {
  onSubmitSuccess: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmitSuccess }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setError,
  } = useForm<UserData>({
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
  const password = watch('password'); // Watch password for strength and confirmPassword validation
  const { showMessage } = useSnackbar();

  const onSubmit = async (data: UserData) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...apiData } = data;
      const resultObj = await registerUser(apiData);

      if (resultObj.status == -1) {
        //alert(resultObj.message); // i don't like this one.
        showMessage(resultObj.message || 'An error occurred', 'error');
      }
      else {
        //alert('success')
        showMessage('Success', 'error');
        navigate('/signin');
        onSubmitSuccess();
      }
    } catch (error) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="First Name"
            required
            {...register('firstName', { required: 'First Name is required' })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Last Name"
            required
            {...register('lastName', { required: 'Last Name is required' })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Agency Name"
            {...register('agencyName')}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Phone Number"
            required
            {...register('phoneNo', { required: 'Phone Number is required' })}
            error={!!errors.phoneNo}
            helperText={errors.phoneNo?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value={2} control={<Radio />} label="Female" />
                <FormControlLabel value={1} control={<Radio />} label="Male" />
                <FormControlLabel value={0} control={<Radio />} label="Other" />
              </RadioGroup>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
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
          <PasswordStrength password={password || ''} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Confirm Password"
            type="password"
            required
            {...register('confirmPassword', { required: 'Confirm Password is required' })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
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
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUpForm;