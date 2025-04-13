import { Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import PropertyList from "../components/PropertyList";

const MyListings = () => {
  return <div>
    <Typography variant="h1" gutterBottom>
      My Listings
    </Typography>
    <Button variant="contained" size="small" component={Link} to="/register-property" >
      Add new listing
    </Button>
    <br/>
    <br/>
    <PropertyList />
  </div>

};

export default MyListings