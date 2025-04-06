import { Typography } from "@mui/material";
import React from "react";
import PropertyList from "../components/PropertyList.tsx";
import Search from "../components/PropertyFilter.tsx";

const SearchProperty = () => {
  return <div>
    <Typography variant="h1" gutterBottom>
      Search Properties
    </Typography>
    <Search />
    <br/><br/>
    <PropertyList />
  </div>
};

export default SearchProperty;
