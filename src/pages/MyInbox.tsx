import { Typography, Box } from '@mui/material';
import React from 'react';
import MessageList from '../components/MessageList';

const MyInbox = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Message Center
      </Typography>
      <Typography gutterBottom>View property enquiry messages</Typography>
      <MessageList />
    </Box>
  );
};

export default MyInbox;
