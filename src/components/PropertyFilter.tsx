import React, { useEffect, useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Button,
} from '@mui/material';
import { PropertyFilterData } from '../types/formData';
import { PropertyContext } from '../components/PropertyContext';
import { getPropertyList } from '../services/api';
import { Property } from '../types/types';

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [JSON.stringify(value), delay]);
  return debouncedValue;
};

export const PropertyFilter: React.FC = () => {
  const { propertyTypes, fetchPropertyTypes, setProperties } = useContext(PropertyContext);
  const [error, setError] = useState<string | null>(null);

  const { control, watch, reset } = useForm<PropertyFilterData>({
    defaultValues: {
      description: '',
      propertyTypeID: 0,
      location: '',
      bedRoom: undefined,
      bathRoom: undefined,
      parking: undefined,
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 500);

  // Fetch property types if not loaded
  useEffect(() => {
    if (propertyTypes.length === 0) {
      fetchPropertyTypes();
    }
  }, [propertyTypes, fetchPropertyTypes]);

  // Fetch properties on filter change
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('Fetching properties with:', { ...debouncedValues, userID: null });
        setError(null);
        const response = await getPropertyList({ ...debouncedValues, userID: null });
        setProperties(response.data || []);
      } catch (error: any) {
        console.error('Error fetching properties:', error);
        setError(error.message || 'Failed to load properties');
      }
    };
    fetchProperties();
  }, [debouncedValues, setProperties]);

  // Reset form to default values
  const handleReset = () => {
    reset({
      description: '',
      propertyTypeID: 0,
      location: '',
      bedRoom: undefined,
      bathRoom: undefined,
      parking: undefined,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
      {/* <Typography variant="h1" gutterBottom sx={{ pb: 1 }}>
        Property Filter
      </Typography> */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 3, md: 3}}>
          <FormControl fullWidth>
            <InputLabel>Property Type</InputLabel>
            <Controller
              name="propertyTypeID"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <MenuItem value={0}>All</MenuItem>
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
        <Grid size={{ xs: 12, sm: 3, md: 3}}>
          <Controller
            name="bedRoom"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Bedroom"
                type="number"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                inputProps={{ min: 0 }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3, md: 3}}>
          <Controller
            name="bathRoom"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Bathroom"
                type="number"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                inputProps={{ min: 0 }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 3, md: 3}}>
          <Controller
            name="parking"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Parking"
                type="number"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                inputProps={{ min: 0 }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Description"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value || '')}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Location"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value || '')}
              />
            )}
          />
        </Grid>
        
        <Grid size={{ xs: 12}}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleReset}
            sx={{ mt: 2 }}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};