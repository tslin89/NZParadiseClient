import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import ColorModeIconDropdown from '.././theme/ColorModeIconDropdown';
import { Link } from "react-router-dom";
import bannerLogo from "../assets/banner-logo.png";
import { useColorScheme } from '@mui/material/styles';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderBottomLeftRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  borderBottomRightRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: ((theme as any).vars || theme).palette.divider,
  backgroundColor: (theme as any).vars
    ? `rgba(${(theme as any).vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: ((theme as any).vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const { mode, setMode } = useColorScheme();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 0px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Link to="/">
            <img
              src={bannerLogo} 
              alt="Site Logo"
              style={{ height: 50, marginRight: 16 }} 
              
            />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="small" component={Link} to="/" >
                Search Properties
              </Button>
              <Button variant="text" color="info" size="small" component={Link} to="/mylistings">
                My Listings
              </Button>
              <Button variant="text" color="info" size="small" component={Link} to="/wishlist">
                Wishlists
              </Button>
              <Button variant="text" color="info" size="small" component={Link} to="/messages">
                Message Center
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button color="primary" variant="text" size="small" component={Link}  to="/signin">
              Sign in
            </Button>
            <Button color="primary" variant="contained" size="small" component={Link}  to="/signup" >
              Sign up
            </Button>
            <IconButton onClick={toggleTheme} size="small" aria-label="Toggle theme">
            {mode === 'light' ?  <LightModeIcon /> : <DarkModeIcon /> }
            </IconButton>
            {/* <ColorModeIconDropdown /> */}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            {/* <ColorModeIconDropdown size="medium" />*/}
            <IconButton onClick={toggleTheme} size="small" aria-label="Toggle theme">
              {mode === 'light' ?  <LightModeIcon /> : <DarkModeIcon /> }
            </IconButton>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton> 
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem component={Link} to="/">Search Properties</MenuItem>
                <MenuItem component={Link} to="/mylistings">My Listings</MenuItem>
                <MenuItem component={Link} to="/wishlist">Wishlists</MenuItem>
                <MenuItem component={Link} to="/messages">Message Center</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth component={Link}  to="/signup">
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth component={Link}  to="/signin">
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
