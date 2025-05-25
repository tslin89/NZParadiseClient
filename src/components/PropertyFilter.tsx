import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Button,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { PropertyFilterData } from '../types/formData';
import { PropertyContext } from '../components/PropertyContext';
import { getPropertyList } from '../services/api';
import { BEDROOM_OPTIONS, BATHROOM_OPTIONS, PARKING_OPTIONS_FILTER } from '../config/propertyOptions';
import { useAuth } from './AuthContext';
import { PropertyListModeEnum } from '../types/enums';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useSnackbar } from './SnackbarContext';

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
  const [showFilter, setShowFilter] = useState(true);
  const { user } = useAuth();
  const userID = user?.userID || null;
  const { showMessage } = useSnackbar();

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

  const handleSearch = useCallback(async () => {
    try {
      setError(null);
      const values = getValues();

      if (values.minPrice && values.maxPrice && values.minPrice > 0 && values.maxPrice > 0 && values.minPrice > values.maxPrice) {
        showMessage("Invalid price range. Minimum price must be smaller than maximum price!", 'error');
      }
      else {
        const response = await getPropertyList({ ...values, userID: userID, mode: PropertyListModeEnum.Search });
        setProperties(response.data || []);
      }

    } catch (error: any) {
      setError("We're unable to load property list at the moment. Please try again later.");
    }
  }, [getValues, setProperties, userID, showMessage]);

  useEffect(() => {
    fetchPropertyTypes();
    handleSearch();
  }, [fetchPropertyTypes, handleSearch]);


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
    // <Paper elevation={3} sx={{ p: 2.5, mt: 2, mb: 3 }}>
    <Box marginBottom={3} marginTop={3}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* <Typography variant="h1" gutterBottom sx={{ pb: 1 }}>
        Property Filter
      </Typography> */}
      {/* {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )} */}
      {/* <Grid container spacing={2}> */}

      {showFilter && (
        <Grid container spacing={1} sx={{ mb: 2 }}>
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
                    {PARKING_OPTIONS_FILTER.map((n) => (
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
              rules={{
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
                  label="Min Price"
                  type="number"
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

          <Grid size={{ xs: 12, sm: 3, md: 3 }}>
            <Controller
              name="maxPrice"
              control={control}
              rules={{
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
                  label="Max Price"
                  type="number"
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
        </Grid>
      )}
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }}>
          <Box display="flex" alignItems="center">

            {showFilter && (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mr: 1 }}
                  onClick={handleSearch}
                >
                  Search
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </>
            )}

            <Button
              variant="text"
              onClick={() => setShowFilter((prev) => !prev)}
              sx={{ ml: 'auto' }} // Pushes this button to the right
            >
              {showFilter ? <><ExpandLessIcon fontSize='medium' /><Typography color="text.secondary">Hide Filter</Typography></> : <><ExpandMoreIcon fontSize='medium' /><Typography color="text.secondary">Show Filter</Typography></>}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};