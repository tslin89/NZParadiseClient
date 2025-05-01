import { Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import PropertyList from '../components/PropertyList';
import { useAuth } from '../components/AuthContext';

const MyListings = () => {
  const { user } = useAuth();
  const userID = user?.userID;

  return (
    <div>
      <Typography variant="h1" gutterBottom>
        My Listings
      </Typography>
      <Button variant="contained" size="small" component={Link} to="/register-property">
        Add new listing
      </Button>
      <br />
      <br />
      <PropertyList userID={userID} useContextFilter={false} />
    </div>
  );
};

export default MyListings;