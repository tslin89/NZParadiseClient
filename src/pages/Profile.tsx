import React from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from '../components/AuthContext';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h2" gutterBottom sx={{ pb: 1 }}>
          My Profile
        </Typography>
        <List dense disablePadding>
          <ListItem disableGutters>
            <ListItemText
              primary={
                <>
                  <Typography component="span" variant="body2" color="text.secondary">Name:&nbsp;</Typography>
                  <Typography component="span" variant="body1" fontWeight="bold">{user?.firstName + " " + user?.lastName}</Typography>
                </>
              }
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={
                <>
                  <Typography component="span" variant="body2" color="text.secondary">Email:&nbsp;</Typography>
                  <Typography component="span" variant="body1" fontWeight="bold">{user?.email}</Typography>
                </>
              }
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={
                <>
                  <Typography component="span" variant="body2" color="text.secondary">Phone:&nbsp;</Typography>
                  <Typography component="span" variant="body1" fontWeight="bold">{user?.phoneNo}</Typography>
                </>
              }
            />
          </ListItem>
          {user?.agencyName && (
            <ListItem disableGutters>
              <ListItemText
                primary={
                  <>
                    <Typography component="span" variant="body2" color="text.secondary">Agency Name:&nbsp;</Typography>
                    <Typography component="span" variant="body1" fontWeight="bold">{user?.agencyName}</Typography>
                  </>
                }
              />
            </ListItem>)}
          <ListItem disableGutters>
            <ListItemText
              primary={
                <>
                  <Typography component="span" variant="body2" color="text.secondary">Gender:&nbsp;</Typography>
                  <Typography component="span" variant="body1" fontWeight="bold">{user?.gender === 1 ? "Male" : user?.gender === 2 ? "Female" : "Other"}</Typography>
                </>
              }
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={
                <>
                  <Typography component="span" variant="body2" color="text.secondary">Member since:&nbsp;</Typography>
                  <Typography component="span" variant="body1" fontWeight="bold">{format(user?.createdDate || '', "dd MMM yyyy")}</Typography>
                </>
              }
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default Profile;