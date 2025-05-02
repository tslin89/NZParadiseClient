import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { registerProperty, getPropertyMetadata } from '../services/api';
import { RegisterPropertyFormData, PropertyType, PropertyFeature } from '../types/formData';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarContext';
import { useAuth } from '../components/AuthContext';
import { format } from 'date-fns';
import GoogleAutocomplete from './GoogleAutocomplete';
import LocationMapPreview from './LocationMapPreview';

interface RegisterPropertyFormProps {
  onSubmitSuccess: () => void;
}

const RegisterPropertyForm: React.FC<RegisterPropertyFormProps> = ({ onSubmitSuccess }) => {
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { user } = useAuth();

  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [propertyFeatures, setPropertyFeatures] = useState<PropertyFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    watch
  } = useForm<RegisterPropertyFormData>({
    defaultValues: {
      description: '',
      price: 0,
      location: '',
      bedRoom: 0,
      bathRoom: 0,
      parking: 0,
      area: 0,
      PropertyFeatureIDs: '',
      availableDate: null,
      propertyTypeID: 0,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch property metadata on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPropertyMetadata();
        setPropertyTypes(result.data.propertyTypes || []);
        setPropertyFeatures(result.data.propertyFeatures || []);
      } catch (error) {
        showMessage('Failed to load property metadata', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [showMessage]);

  const onSubmit = async (data: RegisterPropertyFormData) => {
    if (!user || !user.userID) {
      showMessage('You must be logged in to register a property', 'error');
      navigate('/signin');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        userID: user.userID,
        userType: user.userType,
        PropertyFeatureIDs: data.PropertyFeatureIDs, // Comma-separated string
        availableDate: data.availableDate, // string | null
      };
      const resultObj = await registerProperty(payload);

      if (resultObj.status === -1) {
        showMessage(resultObj.message || 'An error occurred', 'error');
      } else {
        showMessage('New Property Registered', 'success');
        navigate('/mylistings');
        onSubmitSuccess();
      }
    } catch (error) {
      showMessage((error instanceof Error) ? error.message : 'Unexpected error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, sm: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Description"
            required
            {...register('description', { required: 'Property Description is required' })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, sm: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Price"
            type="number"
            required
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price cannot be negative' },
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, sm: 12 }}>
          <Controller
            name="location"
            control={control}
            rules={{ required: 'Location is required' }}
            render={({ field }) => (
              <GoogleAutocomplete
                value={field.value || ''}
                onChange={field.onChange}
                label="Location"
                required
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            )}
          />
          {watch('location') && (
            <LocationMapPreview address={watch('location')}/>
)}
        </Grid>
        <Grid size={{ xs: 12, md: 6, sm: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Bedrooms"
            type="number"
            required
            {...register('bedRoom', {
              required: 'Bedrooms are required',
              min: { value: 0, message: 'Cannot be negative' },
            })}
            error={!!errors.bedRoom}
            helperText={errors.bedRoom?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, sm: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Bathrooms"
            type="number"
            required
            {...register('bathRoom', {
              required: 'Bathrooms are required',
              min: { value: 0, message: 'Cannot be negative' },
            })}
            error={!!errors.bathRoom}
            helperText={errors.bathRoom?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, sm: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Parking Spaces"
            type="number"
            required
            {...register('parking', {
              required: 'Parking spaces are required',
              min: { value: 0, message: 'Cannot be negative' },
            })}
            error={!!errors.parking}
            helperText={errors.parking?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, sm: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Area (sq ft)"
            type="number"
            required
            {...register('area', {
              required: 'Area is required',
              min: { value: 0, message: 'Cannot be negative' },
            })}
            error={!!errors.area}
            helperText={errors.area?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, sm: 12 }}>
          <FormControl fullWidth error={!!errors.PropertyFeatureIDs} required>
            <InputLabel>Features</InputLabel>
            <Controller
              name="PropertyFeatureIDs"
              control={control}
              rules={{ required: 'At least one feature is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  value={field.value ? field.value.split(',') : []}
                  onChange={(e: SelectChangeEvent<string[]>) => {
                    console.log('Field Value:', field.value, 'New Value:', e.target.value);
                    field.onChange(Array.isArray(e.target.value) ? e.target.value.join(',') : '');
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const feature = propertyFeatures.find(f => f.propertyFeatureID.toString() === value);
                        return <Chip key={value} label={feature?.description || value} />;
                      })}
                    </Box>
                  )}
                >
                  {propertyFeatures.map((feature) => (
                    <MenuItem key={feature.propertyFeatureID} value={feature.propertyFeatureID.toString()}>
                      {feature.description}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.PropertyFeatureIDs && (
              <Box component="p" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                {errors.PropertyFeatureIDs.message}
              </Box>
            )}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6, sm: 12 }}>
          <Controller
            name="availableDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Available Date"
                value={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : null)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    error: !!errors.availableDate,
                    helperText: errors.availableDate?.message,
                  },
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, sm: 12 }}>
          <FormControl fullWidth error={!!errors.propertyTypeID} required>
            <InputLabel>Property Type</InputLabel>
            <Controller
              name="propertyTypeID"
              control={control}
              rules={{ required: 'Property Type is required', validate: value => value !== 0 || 'Please select a property type' }}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <MenuItem value={0} disabled>
                    Select Property Type
                  </MenuItem>
                  {propertyTypes.map((type) => (
                    <MenuItem key={type.propertyTypeID} value={type.propertyTypeID}>
                      {type.description}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.propertyTypeID && (
              <Box component="p" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                {errors.propertyTypeID.message}
              </Box>
            )}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterPropertyForm;