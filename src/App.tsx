import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from './theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import MessageCenter from './pages/MessageCenter';
import Wishlists from './pages/Wishlists';
import MyListings from './pages/MyListings';
import RegisterProperty from './pages/RegisterProperty';
import SearchProperty from './pages/SearchProperty';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import { SnackbarProvider } from './components/SnackbarContext';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PropertyProvider } from './components/PropertyContext';

export default function Blog(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <SnackbarProvider>
        <AuthProvider>
          <PropertyProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline enableColorScheme />
              <Router>
                <AppAppBar />
                <Container
                  maxWidth="lg"
                  component="main"
                  sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
                >
                  <main>
                    <Routes>
                      <Route path="/" element={<SearchProperty />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/signin" element={<SignIn />} />
                      <Route
                        path="/mylistings"
                        element={<PrivateRoute element={<MyListings />} />}
                      />
                      <Route path="/wishlist" element={<Wishlists />} />
                      <Route path="/messages" element={<MessageCenter />} />
                      <Route path="/register-property" element={<RegisterProperty />} />
                      <Route
                        path="/profile"
                        element={<PrivateRoute element={<Profile />} />}
                      />
                    </Routes>
                  </main>
                  <Footer />
                </Container>
              </Router>
            </LocalizationProvider>
          </PropertyProvider>
        </AuthProvider>
      </SnackbarProvider>
    </AppTheme>
  );
}