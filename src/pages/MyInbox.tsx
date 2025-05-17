import { Typography, Box } from '@mui/material';
import React from 'react';
import MessageList from '../components/MessageList';

const MyInbox = () => {
  return (
    <Box>
      <Typography variant="h2" gutterBottom sx={{ pb: 1 }}>
        My Inbox
      </Typography>
      <Typography gutterBottom sx={{mb: 0}}>View enquiry messages sent to my properties.</Typography>
      <MessageList />
    </Box>
  );
};

export default MyInbox;
