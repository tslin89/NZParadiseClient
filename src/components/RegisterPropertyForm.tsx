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
  CircularProgress,
  Typography,
  ImageList,
  ImageListItem,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { registerProperty, updateProperty, getPropertyMetadata, getPropertyDetails, deleteProperty } from '../services/api';
import { RegisterPropertyFormData, PropertyType, PropertyFeature } from '../types/formData';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarContext';
import { useAuth } from '../components/AuthContext';
import { format } from 'date-fns';
import GoogleAutocomplete from './GoogleAutocomplete';
import LocationMapPreview from './LocationMapPreview';
import DeleteIcon from '@mui/icons-material/Delete';
import Lightbox from 'yet-another-react-lightbox';
import { BEDROOM_OPTIONS, BATHROOM_OPTIONS, PARKING_OPTIONS } from '../config/propertyOptions';
import ConfirmDialog from './ConfirmDialog';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface RegisterPropertyFormProps {
  onSubmitSuccess: () => void;
  mode?: 'create' | 'edit';
  propertyID?: number;
}

type DisplayImage = {
  url: string;
  isUploaded: boolean;
  file?: File;
  id?: number;
};

const RegisterPropertyForm: React.FC<RegisterPropertyFormProps> = ({ onSubmitSuccess, mode = 'create', propertyID }) => {
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const { user } = useAuth();

  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [propertyFeatures, setPropertyFeatures] = useState<PropertyFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingProperty, setIsFetchingProperty] = useState(mode === 'edit');
  const [images, setImages] = useState<DisplayImage[]>([]);
  const [removedImageIDs, setRemovedImageIDs] = useState<number[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegisterPropertyFormData>({
    defaultValues: {
      description: '',
      price: 0,
      location: '',
      bedroom: 0,
      bathroom: 0,
      parking: 0,
      area: 0,
      propertyFeatureIDs: '',
      availableFromDate: null,
      propertyTypeID: 0,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteProperty = async () => {
    if (!user || !propertyID) return;

    setConfirmOpen(true);
  };

  const handleConfirmClose = async (confirmed: boolean) => {
    setConfirmOpen(false);

    if (!confirmed || !user || !propertyID) return;

    try {
      const result = await deleteProperty(propertyID, user.userID);
      if (result.status === 1) {
        showMessage('Property successfully deleted.', 'success');
        navigate('/mylistings');
      } else {
        showMessage('Unable to delete this property.', 'error');
      }
    } catch (error) {
      showMessage('An error occurred while deleting the property.', 'error');
    }
  };

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

    const newImages: DisplayImage[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      isUploaded: false,
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (mode === 'edit' && propertyID) {
        setIsFetchingProperty(true);
        try {
          const response = await getPropertyDetails(propertyID);
          if (response && response.data) {
            const propertyData = {
              ...response.data,
              availableDate: response.data.availableDate
                ? format(new Date(response.data.availableDate), 'yyyy-MM-dd')
                : null,
              PropertyFeatureIDs: (response.data.propertyFeatures || [])
                .map((f: any) => f.propertyFeatureID.toString())
                .join(','),
            };

            reset(propertyData);

            const existingImages: DisplayImage[] = (response.data.attachments || []).map((att: any) => ({
              url: att.filePath,
              isUploaded: true,
              id: att.attachmentID,
            }));

            setImages(existingImages);
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
        propertyTypeID: data.propertyTypeID,
        userID: user.userID,
        userType: user.userType,
        PropertyFeatureIDs: data.propertyFeatureIDs,
        availableDate: data.availableFromDate,
      };

      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        formData.append(key, value?.toString() ?? '');
      }

      images
        .filter((img) => !img.isUploaded && img.file)
        .forEach((img) => {
          formData.append('files', img.file!);
        });

      removedImageIDs.forEach((id) => {
        formData.append('removedFileIDs', id.toString());
      });

      const resultObj = mode === 'edit' ? await updateProperty(propertyID!, formData) : await registerProperty(formData);

      if (resultObj.status === -1) {
        showMessage(resultObj.message || 'An error occurred', 'error');
      } else {
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
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12, sm: 12 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Description"
              multiline
              slotProps={{
                htmlInput: { maxLength: 300 },
              }}
              rows={3}
              required
              {...register('description', { required: 'Property Description is required' })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, sm: 12 }}>
            <FormControl fullWidth error={!!errors.propertyTypeID} required>
              <InputLabel>Property Type</InputLabel>
              <Controller
                name="propertyTypeID"
                control={control}
                rules={{
                  required: 'Property Type is required',
                  validate: (value) => value !== 0 || 'Please select a valid property type',
                }}
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
              {errors.propertyTypeID && (
                <FormHelperText>{errors.propertyTypeID.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, sm: 12 }}>
            <FormControl fullWidth error={!!errors.propertyFeatureIDs} required>
              <InputLabel>Features</InputLabel>
              <Controller
                name="propertyFeatureIDs"
                control={control}
                rules={{ required: 'At least one feature is required' }}
                render={({ field }) => (
                  <Select
                    multiple
                    value={field.value ? field.value.split(',').filter(Boolean) : []}
                    onChange={(e) => {
                      const value = Array.isArray(e.target.value) ? e.target.value.join(',') : '';
                      field.onChange(value);
                    }}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const feature = propertyFeatures.find((f) => f.propertyFeatureID.toString() === value);
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
              {!!errors.propertyFeatureIDs && (
                <FormHelperText>{errors.propertyFeatureIDs.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, sm: 12 }}>
            {/* <TextField
              fullWidth
              variant="outlined"
              label="Price (Weekly)"
              type="number"
              required
              {...register('price', { required: 'Price is required', min: { value: 1, message: 'Price must be more than NZ$ 0' } })}
              error={!!errors.price}
              helperText={errors.price?.message}
            /> */}

            <Controller
              name="price"
              control={control}
              rules={{
                required: 'Price is required',
                min: { value: 1, message: 'Area must be greater than NZ$ 0' },
                pattern: {
                  value: /^[1-9]\d*$/,
                  message: 'Price must be a positive integer without leading zeros',
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label="Price (Weekly)"
                  type="number"
                  required
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      field.onChange('');
                    } else {
                      const cleanedValue = value.replace(/^0+/, '').replace(/[^0-9]/g, '');
                      field.onChange(cleanedValue);
                    }
                  }}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, sm: 12 }}>
            <FormControl fullWidth error={!!errors.bedroom} required>
              <InputLabel>Bedrooms</InputLabel>
              <Controller
                name="bedroom"
                control={control}
                rules={{
                  required: 'Bedrooms are required',
                  validate: (value) => value !== 0 || 'Please select number of bedrooms',
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {BEDROOM_OPTIONS.map((n) => (
                      <MenuItem key={n} value={n}>{n}</MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, sm: 12 }}>
            <FormControl fullWidth error={!!errors.bathroom} required>
              <InputLabel>Bathrooms</InputLabel>
              <Controller
                name="bathroom"
                control={control}
                rules={{
                  required: 'Bathrooms are required',
                  validate: (value) => value !== 0 || 'Please select number of bathrooms',
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <MenuItem value="" disabled>
                      Select Bathrooms
                    </MenuItem>
                    {BATHROOM_OPTIONS.map((n) => (
                      <MenuItem key={n} value={n.toString()}>
                        {n}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.bathroom?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, sm: 12 }}>
            <FormControl fullWidth error={!!errors.parking}>
              <InputLabel>Parkings</InputLabel>
              <Controller
                name="parking"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value !== undefined ? field.value : ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {PARKING_OPTIONS.map((n) => (
                      <MenuItem key={n} value={n}>{n}</MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6, sm: 12 }}>
            <Controller
              name="area"
              control={control}
              rules={{
                required: 'Area is required',
                min: { value: 1, message: 'Area must be greater than 0 sqft' },
                pattern: {
                  value: /^[1-9]\d*$/,
                  message: 'Area must be a positive integer without leading zeros',
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label="Area (sqft)"
                  type="number"
                  required
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      field.onChange('');
                    } else {
                      const cleanedValue = value.replace(/^0+/, '').replace(/[^0-9]/g, '');
                      field.onChange(cleanedValue);
                    }
                  }}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, sm: 12 }}>
            <Controller
              name="availableFromDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Available Date"
                  value={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : null)}
                  slotProps={{ textField: { fullWidth: true, variant: 'outlined', error: !!errors.availableFromDate, helperText: errors.availableFromDate?.message } }}
                />
              )}
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
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Property Images:
              </Typography>
              <Button variant="outlined" component="label" size='small'>
                Select Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </Button>
            </Box>

            {images.length > 0 && (
              <Box sx={{ overflowY: 'auto', maxHeight: 400, mt: 2 }}>
                <ImageList cols={3} rowHeight={100}>
                  {images.map((img, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={img.url}
                        alt={`image-${index}`}
                        loading="lazy"
                        onClick={() => setLightboxIndex(index)}
                        style={{
                          cursor: 'pointer', objectFit: 'cover',
                          borderRadius: 8
                        }}
                      />
                      <IconButton
                        sx={{ position: 'absolute', right: 5, top: 5 }}
                        color="primary"
                        size="small"
                        onClick={() => {
                          if (img.isUploaded && img.id) {
                            setRemovedImageIDs(prev => [...prev, img.id!]);
                          }
                          setImages(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ImageListItem>
                  ))}

                  {lightboxIndex !== null && (
                    <Lightbox
                      open={lightboxIndex !== null}
                      index={lightboxIndex}
                      close={() => setLightboxIndex(null)}
                      slides={images.map((img) => ({ src: img.url }))}
                    />
                  )}
                </ImageList>
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 12, sm: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? 'Submitting...' : (mode === 'edit' ? 'Update Property' : 'Register Property')}
              </Button>
            </Box>
          </Grid>
        </Grid>

        <ConfirmDialog
          open={confirmOpen}
          message="Are you sure you want to permanently delete this property?"
          onClose={handleConfirmClose}
        />
      </Box>
      {mode === 'edit' && propertyID && (
        <Box textAlign="center" paddingTop={3}>
          <Button variant="text" startIcon={<DeleteForeverIcon color="error" />} onClick={handleDeleteProperty}>
            <Typography sx={{ color: 'error.light' }}>
              Delete this property
            </Typography>
          </Button>
        </Box>
      )}
    </>
  );
};

export default RegisterPropertyForm;