import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Footer from './components/Footer';
import { SnackbarProvider } from './components/SnackbarContext';

export default function Blog(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <SnackbarProvider>
        <CssBaseline enableColorScheme />
        <Router>
          <AppAppBar />
          <Container
            maxWidth="lg"
            component="main"
            sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}>
            <main>
              <Routes>
                <Route path="/" element={<SearchProperty />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/mylistings" element={<MyListings />} />
                <Route path="/wishlist" element={<Wishlists />} />
                <Route path="/messages" element={<MessageCenter />} />
                <Route path="/register-property" element={<RegisterProperty />} />
              </Routes>
            </main>
            <Footer />
          </Container>
        </Router>
      </SnackbarProvider>
    </AppTheme>
  );
}
