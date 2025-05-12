// src/components/LocationMapPreview.tsx
import React from 'react';
import { Box } from '@mui/material';

interface LocationMapPreviewProps {
  address: string;
  interactive?: boolean;
}

const LocationMapPreview: React.FC<LocationMapPreviewProps> = ({ address, interactive }) => {
  if (!address) return null;

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=16&size=800x300&markers=color:red%7C${encodedAddress}&key=${apiKey}`;

  return (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      {interactive ? (
        <iframe
          title="Google Map"
          width="100%"
          height="400"
          style={{ border: 0, borderRadius: '8px' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`}
        />
      ) : (
        <img
          src={mapUrl}
          alt="Map Preview"
          style={{ width: '100%', maxWidth: '800px', height: 'auto', borderRadius: '8px' }}
        />
      )}
    </Box>
  );
};

export default LocationMapPreview;
