// src/components/RegisterPropertyForm.tsx
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
  CircularProgress,
  Typography,
  ImageList,
  ImageListItem,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { registerProperty, updateProperty, getPropertyMetadata, getPropertyDetails } from '../services/api';
import { RegisterPropertyFormData, PropertyType, PropertyFeature } from '../types/formData';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarContext';
import { useAuth } from '../components/AuthContext';
import { format } from 'date-fns';
import GoogleAutocomplete from './GoogleAutocomplete';
import LocationMapPreview from './LocationMapPreview';
import { uploadPropertyImages } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';

interface RegisterPropertyFormProps {
  onSubmitSuccess: () => void;
  mode?: 'create' | 'edit';
  propertyID?: number;
}

const RegisterPropertyForm: React.FC<RegisterPropertyFormProps> = ({ onSubmitSuccess, mode = 'create', propertyID }) => {
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { user } = useAuth();

  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [propertyFeatures, setPropertyFeatures] = useState<PropertyFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingProperty, setIsFetchingProperty] = useState(mode === 'edit');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    watch,
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

  useEffect(() => {
    const fetchMetadata = async () => {
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
    fetchMetadata();
  }, [showMessage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    setSelectedImages([...selectedImages, ...fileArray]);

    const previews = fileArray.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    const updatedFiles = [...selectedImages];
    const updatedPreviews = [...imagePreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setSelectedImages(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (mode === 'edit' && propertyID) {
        setIsFetchingProperty(true);
        try {
          const response = await getPropertyDetails(propertyID);
          if (response && response.data) {
            reset({
              ...response.data,
              availableDate: response.data.availableDate ? format(new Date(response.data.availableDate), 'yyyy-MM-dd') : null,
              PropertyFeatureIDs: (response.data.propertyFeatures || []).map((f: any) => f.propertyFeatureID).join(',')
            });
          }
        } catch (error) {
          console.error('Failed to load property details', error);
        } finally {
          setIsFetchingProperty(false);
        }
      }
    };
    fetchPropertyDetails();
  }, [mode, propertyID, reset]);

  const onSubmit = async (data: RegisterPropertyFormData) => {
    if (!user || !user.userID) {
      showMessage('You must be logged in', 'error');
      navigate('/signin');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        userID: user.userID,
        userType: user.userType,
        PropertyFeatureIDs: data.PropertyFeatureIDs,
        availableDate: data.availableDate,
      };
      const resultObj = mode === 'edit' ? await updateProperty(payload) : await registerProperty(payload);

      if (resultObj.status === -1) {
        showMessage(resultObj.message || 'An error occurred', 'error');
      } else {

        if (selectedImages.length > 0 && resultObj.data?.propertyID) {
          await uploadPropertyImages(resultObj.data.propertyID, selectedImages);
        }

        showMessage(mode === 'edit' ? 'Property Updated Successfully' : 'New Property Registered', 'success');
        navigate('/mylistings');
        onSubmitSuccess();
      }
    } catch (error) {
      showMessage((error instanceof Error) ? error.message : 'Unexpected error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isFetchingProperty) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Button variant="outlined" component="label">
            Upload Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageSelect}
            />
          </Button>
        </Grid>

        {imagePreviews.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Image Preview
            </Typography>
            <ImageList cols={4} rowHeight={140}>
              {imagePreviews.map((src, index) => (
                <ImageListItem key={index}>
                  <img src={src} alt={`preview-${index}`} loading="lazy" />
                  <IconButton size="small" onClick={() => removeImage(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
        )}
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
            {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price cannot be negative' } })}
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
            <LocationMapPreview address={watch('location')} />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6, sm: 12 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Bedrooms"
            type="number"
            required
            {...register('bedRoom', { required: 'Bedrooms are required', min: { value: 0, message: 'Cannot be negative' } })}
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
            {...register('bathRoom', { required: 'Bathrooms are required', min: { value: 0, message: 'Cannot be negative' } })}
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
            {...register('parking', { required: 'Parking spaces are required', min: { value: 0, message: 'Cannot be negative' } })}
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
            {...register('area', { required: 'Area is required', min: { value: 0, message: 'Cannot be negative' } })}
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
                slotProps={{ textField: { fullWidth: true, variant: 'outlined', error: !!errors.availableDate, helperText: errors.availableDate?.message } }}
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
                  <MenuItem value={0} disabled>Select Property Type</MenuItem>
                  {propertyTypes.map((type) => (
                    <MenuItem key={type.propertyTypeID} value={type.propertyTypeID}>
                      {type.description}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 12, sm: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" size="small" disabled={isSubmitting || isLoading}>
              {isSubmitting ? 'Submitting...' : (mode === 'edit' ? 'Update Property' : 'Register Property')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterPropertyForm;
