import { Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import PropertyList from '../components/PropertyList';
import { useAuth } from '../components/AuthContext';
import { PropertyListModeEnum } from '../types/enums';

const MyListings = () => {
  const { user } = useAuth();
  const userID = user?.userID;

  return (
    <div>
      <Typography variant="h2" gutterBottom sx={{ pb: 1 }}>
        My Listings
      </Typography>
      <Button
        variant="outlined"
        component={Link}
        color="primary"
        to="/register-property">
        Add new listing
      </Button>
      <br />
      <br />
      <PropertyList mode={PropertyListModeEnum.MyListings} userID={userID} useContextFilter={false} />
    </div>
  );
};

export default MyListings;