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
  Alert,
  Button,
} from '@mui/material';
import { PropertyFilterData } from '../types/formData';
import { PropertyContext } from '../components/PropertyContext';
import { getPropertyList } from '../services/api';
import { BEDROOM_OPTIONS, BATHROOM_OPTIONS, PARKING_OPTIONS, PARKING_OPTIONS_FILTER } from '../config/propertyOptions';


// const useDebounce = <T,>(value: T, delay: number): T => {
//   const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// };

export const PropertyFilter: React.FC = () => {
  const { propertyTypes, fetchPropertyTypes, setProperties } = useContext(PropertyContext);
  const [error, setError] = useState<string | null>(null);

  const { control, reset, getValues } = useForm<PropertyFilterData>({
    defaultValues: {
      description: '',
      propertyTypeID: 0,
      location: '',
      bedRoom: undefined,
      bathRoom: undefined,
      parking: undefined,
      minPrice: undefined,
      maxPrice: undefined
    },
  });

  /*
  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 500);

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
  */

  useEffect(() => {
    fetchPropertyTypes();
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      setError(null);
      const values = getValues();
      console.log('Fetching properties with:', values);
      const response = await getPropertyList({ ...values, userID: null });
      setProperties(response.data || []);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      setError(error.message || 'Failed to load properties');
    }
  };

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

    handleSearch();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2, mb: 2 }}>
      {/* <Typography variant="h1" gutterBottom sx={{ pb: 1 }}>
        Property Filter
      </Typography> */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 3, md: 3 }}>
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
        <Grid size={{ xs: 12, sm: 3, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Bedroom</InputLabel>
            <Controller
              name="bedRoom"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {BEDROOM_OPTIONS.map((n) => (
                    <MenuItem key={n} value={n}>{n}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 3, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Bathroom</InputLabel>
            <Controller
              name="bathRoom"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {BATHROOM_OPTIONS.map((n) => (
                    <MenuItem key={n} value={n}>{n}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 3, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Parking</InputLabel>
            <Controller
              name="parking"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  { PARKING_OPTIONS_FILTER.map((n) => (
                    <MenuItem key={n} value={n}>{n}</MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
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

        <Grid size={{ xs: 12, sm: 3, md: 3 }}>
          <Controller
            name="minPrice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                variant="outlined"
                label="Min Price"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value || '')}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3, md: 3 }}>
          <Controller
            name="maxPrice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                variant="outlined"
                label="Max Price"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value || '')}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={handleSearch}
          >
            Search Properties
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};