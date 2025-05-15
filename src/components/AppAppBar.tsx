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
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import bannerLogo from '../assets/banner-logo.png';
import { useColorScheme } from '@mui/material/styles';
import { useAuth } from '../components/AuthContext';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { mode, setMode } = useColorScheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
    handleMenuClose();
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
              {isAuthenticated && (
                <>
                  <Button variant="text" color="info" size="small" component={Link} to="/dashboard">
                    Dashboard
                  </Button>
                </>
              )}
              <Button variant="text" color="info" size="small" component={Link} to="/search">
                Search Properties to Rent
              </Button>
              {isAuthenticated && (
                <>
                  <Button variant="text" color="info" size="small" component={Link} to="/mylistings">
                    My Listings
                  </Button>
                  <Button variant="text" color="info" size="small" component={Link} to="/wishlist">
                    Wishlists
                  </Button>
                  <Button variant="text" color="info" size="small" component={Link} to="/messages">
                    Inbox
                  </Button>
                </>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {!isAuthenticated ? (
              <>
                <Button color="primary" variant="text" size="small" component={Link} to="/signin">
                  Sign in
                </Button>
                <Button color="secondary" variant="contained" size="small" component={Link} to="/signup">
                  Sign up
                </Button>
              </>
            ) : (
              <>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  onClick={handleMenuOpen}
                >
                  <Avatar
                    sx={{ width: 32, height: 32, mr: 1 }}
                    alt={`${user?.firstName} ${user?.lastName}`}
                  >
                    {user ? user.firstName[0] : ""}
                  </Avatar>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>{`${user?.firstName} ${user?.lastName}`}</Typography>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleEditProfile}><PermIdentityIcon fontSize='small' sx={{ mr: 2 }} />Edit Profile</MenuItem>
                  <MenuItem onClick={handleLogout}><PowerSettingsNewIcon fontSize='small' sx={{ mr: 2 }} />Logout</MenuItem>
                </Menu>
              </>
            )}
            <IconButton onClick={toggleTheme} size="small" aria-label="Toggle theme">
              {mode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <IconButton onClick={toggleTheme} size="small" aria-label="Toggle theme">
              {mode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
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
                {isAuthenticated && (
                  <>
                    <MenuItem component={Link} to="/dashboard">Dashboard</MenuItem>
                  </>)}
                <MenuItem component={Link} to="/search">Search Properties to Rent</MenuItem>
                {isAuthenticated && (
                  <>
                    <MenuItem component={Link} to="/mylistings">My Listings</MenuItem>
                    <MenuItem component={Link} to="/wishlist">Wishlists</MenuItem>
                    <MenuItem component={Link} to="/messages">Inbox</MenuItem>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <MenuItem>
                      <Button color="primary" variant="contained" fullWidth component={Link} to="/signup">
                        Sign up
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button color="primary" variant="outlined" fullWidth component={Link} to="/signin">
                        Sign in
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}