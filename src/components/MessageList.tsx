// src/components/MessageList.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Button,
  CardMedia,
  Avatar,
} from '@mui/material';
import { PropertyMessage } from '../types/types';
import { useAuth } from './AuthContext';
import { getMessageList } from '../services/api';
import { useNavigate } from 'react-router-dom';
import emptyImage from '../assets/empty-image.png';

const MessageList: React.FC = () => {
  const { user } = useAuth();
  const userID = user?.userID || -1;
  const [messages, setMessages] = useState<PropertyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const result = await getMessageList(userID);
        setMessages(result.data || []);
      } catch (err: any) {
        setError("We're unable to load your inbox at the moment. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [userID]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography>No messages found.</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={4} mt={2}>
      {messages.map((group, idx) => (
        <Card key={idx} variant="outlined">
          <CardContent>
            <Box display="flex" gap={2}>
              {/* Image */}
              <CardMedia
                component="img"
                //image={`https://picsum.photos/200/150?random=${group.property.propertyID}`}
                image={group.propertyImage ? group.propertyImage : emptyImage}
                alt={group.propertyDesc}
                onClick={() => navigate(`/property/${group.propertyID}`)}
                sx={{
                  width: 200,
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                }}
              />

              {/* Right section: Property details + messages */}
              <Box flex={1}>
                {/* Property title & location (clickable) */}
                <Box
                  onClick={() => navigate(`/property/${group.propertyID}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="h6" gutterBottom>
                    {group.propertyDesc}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {group.location}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ maxHeight: '300px', overflowY: 'scroll', width: '100%'}}>
                  {/* Messages */}
                  {group.messageList.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No messages for this property.
                    </Typography>
                  ) : (
                    group.messageList.map((msg, i) => (
                      <Box key={i} mb={3} >
                        {/* Top section: avatar, user info, and reply button */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>
                              {msg.senderFirstName[0]}
                            </Avatar>
                            <Typography>
                              <strong>{msg.senderFirstName} {msg.senderLastName}</strong>
                            </Typography>
                          </Box>

                          <Button
                            variant="outlined"
                            size="small"
                            href={`mailto:${msg.senderEmail}`}
                          >
                            Reply via Email
                          </Button>
                        </Box>
                        {/* Message details */}
                        <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
                          {msg.messageDesc}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" >
                          {new Date(msg.createdDate).toLocaleString()}
                        </Typography>

                        {i !== group.messageList.length - 1 && <Divider sx={{ mt: 2 }} />}
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MessageList;
