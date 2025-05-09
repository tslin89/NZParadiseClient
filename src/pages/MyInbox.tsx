import { Typography, Box } from '@mui/material';
import React from 'react';
import MessageList from '../components/MessageList';

const MyInbox = () => {
  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        My Inbox
      </Typography>
      <Typography gutterBottom>View enquiry messages sent to my properties.</Typography>
      <MessageList />
    </Box>
  );
};

export default MyInbox;
