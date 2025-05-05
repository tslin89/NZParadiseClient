import { Typography } from "@mui/material";
import React from "react";
import PropertyList from "../components/PropertyList";
import { PropertyListModeEnum } from "../types/enums";

const Wishlists = () => <div>
  <Typography variant="h1" gutterBottom>
    My Wishlist
  </Typography>
  <Typography>Properties that I have added into my wishlist</Typography>
  <PropertyList mode={PropertyListModeEnum.Wishlist} useContextFilter={false} />
</div>;

export default Wishlists;
