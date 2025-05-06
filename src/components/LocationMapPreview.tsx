// src/components/LocationMapPreview.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface LocationMapPreviewProps {
  address: string;
}

const LocationMapPreview: React.FC<LocationMapPreviewProps> = ({ address }) => {
  if (!address) return null;

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=16&size=800x300&markers=color:red%7C${encodedAddress}&key=${apiKey}`;

  return (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      {/* <Typography variant="subtitle1" sx={{ mb: 1 }}>Location Preview</Typography> */}
      <img
        src={mapUrl}
        alt="Map Preview"
        style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px' }}
      />
    </Box>
  );
};

export default LocationMapPreview;
