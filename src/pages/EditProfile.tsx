import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import SignUpForm from '../components/SignUpForm';
import { useAuth } from '../components/AuthContext';

const EditProfile: React.FC = () => {
  const { user } = useAuth(); // Reuse logged-in user

  const handleSubmitSuccess = () => {
    console.log('Profile updated');
    // Optionally: trigger a re-fetch or context update here
  };

  if (!user) return <div>Loading...</div>; // Or redirect to login

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Edit Profile
        </Typography>
        <SignUpForm
          onSubmitSuccess={handleSubmitSuccess}
          initialValues={user} // ⚠️ ensure shape matches UserData
          mode="edit"
        />
      </Paper>
    </Container>
  );
};

export default EditProfile;
