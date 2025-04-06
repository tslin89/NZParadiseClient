import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from './theme/AppTheme.tsx';
import AppAppBar from './components/AppAppBar.tsx';
// import MainContent from './components/PropertyList.tsx';
import SignUp from './pages/SignUp.tsx';
import SignIn from './pages/SignIn.tsx';
import MessageCenter from './pages/MessageCenter.tsx';
import Wishlists from './pages/Wishlists.tsx';
import MyListings from './pages/MyListings.tsx';
import RegisterProperty from './pages/RegisterProperty.tsx';
import SearchProperty from './pages/SearchProperty.tsx';
import Footer from './components/Footer.tsx';


export default function Blog(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
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
          <Footer/>
        </Container>
      </Router>
    </AppTheme>
  );
}
