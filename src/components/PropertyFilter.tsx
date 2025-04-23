import { Box, Chip, FormControl, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import React from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const handleClick = () => {
  console.info('You clicked the filter chip.');
};

export default function Search() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }} >
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            gap: 3,
            overflow: 'auto',
          }} >
          <Typography gutterBottom align="center">
          </Typography>
          <Chip onClick={handleClick} size="medium" label="All categories" />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Condominium"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }} />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Apartment"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Landed House"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Mansion"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'row',
            gap: 1,
            width: { xs: '100%', md: 'fit-content' },
            overflow: 'auto',
          }}
        >
          <Box>
            <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
              <OutlinedInput
                size="small"
                id="search"
                placeholder="Search…"
                sx={{ flexGrow: 1 }}
                startAdornment={
                  <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                }
                inputProps={{
                  'aria-label': 'search',
                }}
              />
            </FormControl>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}