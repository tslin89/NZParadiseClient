import React, { useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import PasswordStrength from './PasswordStrength';
import { registerUser, updateUser } from '../services/api';
import { UserData } from '../types/formData';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarContext';
import { useAuth } from '../components/AuthContext';

interface SignUpFormProps {
  onSubmitSuccess: () => void;
  initialValues?: Partial<UserData>;
  mode?: 'register' | 'edit';
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmitSuccess, initialValues, mode = 'register' }) => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    resetField,
    setError,
    reset
  } = useForm<UserData>({
    defaultValues: {
      userID: 0,
      firstName: '',
      lastName: '',
      agencyName: '',
      phoneNo: '',
      gender: 0,
      email: '',
      currentPassword: '',
      ...initialValues,
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        password: '',
        confirmPassword: '',
        currentPassword: '',
      });
    }
  }, [initialValues, reset]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);

  const password = watch('password');
  //const confirmPassword = watch('confirmPassword');
  const { showMessage } = useSnackbar();

  const onSubmit = async (data: UserData) => {

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...apiData } = data;

      if (mode === 'edit') {
        if (showNewPasswordFields) {
          if (!data.currentPassword) {
            setError('currentPassword', {
              type: 'manual',
              message: 'Please enter your current password',
            });
            return;
          }

          if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
              type: 'manual',
              message: 'New passwords do not match',
            });
            return;
          }
        } else {
          delete apiData.password;
          //delete apiData.currentPassword;
        }

        const result = await updateUser(apiData);
        if (result.status === -1) {
          showMessage(result.message || 'Update failed', 'error');
        } else {
          showMessage('Profile updated successfully', 'success');
          onSubmitSuccess();

          // update user object
          login(localStorage.getItem('token')!, {
            ...user!,
            ...result.data
          });
        }
        resetField('currentPassword');

      } else {
        if (!data.password || !data.confirmPassword) {
          setError('confirmPassword', {
            type: 'manual',
            message: 'Password and confirmation are required',
          });
          return;
        }

        if (data.password !== data.confirmPassword) {
          setError('confirmPassword', {
            type: 'manual',
            message: 'Passwords do not match',
          });
          return;
        }

        const result = await registerUser(apiData);
        if (result.status === -1) {
          showMessage(result.message || 'Registration failed', 'error');
        } else {
          showMessage('Registration successful', 'success');
          navigate('/signin');
          onSubmitSuccess();
        }
      }
    } catch (error) {
      // setError('currentPassword', {
      //   type: 'manual',
      //   message: 'Submission failed. Please try again.',
      // });
      showMessage("Submission failed. Please try again", "error")
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
            label="First Name"
            slotProps={{
              htmlInput: { maxLength: 100 },
            }}
            required
            {...register('firstName', { required: 'First Name is required' })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Last Name"
            required
            slotProps={{
              htmlInput: { maxLength: 100 },
            }}
            {...register('lastName', { required: 'Last Name is required' })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField fullWidth label="Agency Name" 
          {...register('agencyName')}
            slotProps={{
              htmlInput: { maxLength: 120 },
            }} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Phone Number"
            type="tel"
            required
            {...register('phoneNo', {
              required: 'Phone Number is required',
              maxLength: { value: 15, message: 'Maximum 15 digits allowed' },
              pattern: {
                value: /^[0-9]*$/,
                message: 'Only digits are allowed',
              },
            })}
            inputProps={{ maxLength: 15 }}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault(); // block any non-digit key
              }
            }}
            error={!!errors.phoneNo}
            helperText={errors.phoneNo?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            slotProps={{
              htmlInput: { maxLength: 50 },
            }}
            required
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
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

        {mode === 'edit' && (
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showNewPasswordFields}
                  onChange={(e) => setShowNewPasswordFields(e.target.checked)}
                  color="primary"
                />
              }
              label="Change Password"
            />
          </Grid>
        )}

        {(mode === 'register' || showNewPasswordFields) && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={mode === 'edit' ? 'New Password' : 'Password'}
                type="password"
                {...register('password', {
                  required:
                    mode === 'register' || showNewPasswordFields
                      ? 'Password is required'
                      : false,
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <PasswordStrength password={password || ''} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={mode === 'edit' ? 'Confirm New Password' : 'Confirm Password'}
                type="password"
                {...register('confirmPassword', {
                  required:
                    mode === 'register' || showNewPasswordFields
                      ? 'Confirm Password is required'
                      : false,
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>
          </>
        )}

        {mode === 'edit' && (
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              {...register('currentPassword', {
                required: mode === 'edit' ? 'Current Password is required' : false
              })}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? mode === 'edit'
                  ? 'Updating...'
                  : 'Registering...'
                : mode === 'edit'
                  ? 'Update'
                  : 'Register'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUpForm;
