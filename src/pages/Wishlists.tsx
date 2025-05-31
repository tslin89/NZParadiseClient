import { Typography } from "@mui/material";
import React from "react";
import PropertyList from "../components/PropertyList";
import { PropertyListModeEnum } from "../types/enums";

const Wishlists = () => <div>
  <Typography variant="h2" gutterBottom sx={{ pb: 1 }}>
    My Wishlist
  </Typography>
  <Typography>View properties in my wishlist</Typography>

  <PropertyList mode={PropertyListModeEnum.Wishlist} useContextFilter={false} />
</div>;

export default Wishlists;
