// src/components/GoogleAutocomplete.tsx
import React, { useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { TextField } from '@mui/material';

interface GoogleAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

const GoogleAutocomplete: React.FC<GoogleAutocompleteProps> = ({
  value,
  onChange,
  label = "Location",
  required = false,
  error = false,
  helperText = '',
}) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    }
  };

  return (
    <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        required={required}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        error={error}
        helperText={helperText}
      />
    </Autocomplete>
  );
};

export default GoogleAutocomplete;
