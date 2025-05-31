import React from 'react';
import PropertyList from '../components/PropertyList';
import { PropertyFilter } from '../components/PropertyFilter';
import { PropertyListModeEnum } from '../types/enums';
import { Typography } from '@mui/material';

const SearchProperty = () => {
  return (
    <div>
      <Typography variant="h2" gutterBottom sx={{ pb: 1 }}>
        Search Properties to Rent
      </Typography>
      <PropertyFilter />
      <PropertyList mode={PropertyListModeEnum.Search} useContextFilter={true} />
    </div>
  );
};

export default SearchProperty;