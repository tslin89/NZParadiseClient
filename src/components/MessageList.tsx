// src/components/MessageList.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Link,
  CircularProgress,
  Alert,
  Button,
  CardMedia,
  Avatar,
} from '@mui/material';
import { MessageGroup, PropertyType } from '../types/types';
import { useAuth } from './AuthContext';
import { getMessageList } from '../services/api';
import { useNavigate } from 'react-router-dom';

const MessageList: React.FC = () => {
  const { user } = useAuth();
  const userID = user?.userID || -1;
  const [messages, setMessages] = useState<MessageGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const result = await getMessageList(userID);
        setMessages(result.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load messages');
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
                image={`https://picsum.photos/200/150?random=${group.property.propertyID}`}
                alt={group.property.description}
                onClick={() => navigate(`/property/${group.property.propertyID}`)}
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
                  onClick={() => navigate(`/property/${group.property.propertyID}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="h6" gutterBottom>
                    {group.property.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {group.property.location}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Messages */}
                {group.messages.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No messages for this property.
                  </Typography>
                ) : (
                  group.messages.map((msg, i) => (
                    <Box key={i} mb={3}>
                      {/* Top section: avatar, user info, and reply button */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>
                            {msg.user.firstName[0]}{msg.user.lastName[0]}
                          </Avatar>
                          <Typography>
                            <strong>{msg.user.firstName} {msg.user.lastName}</strong>
                            {/*&mdash;
                             <Link href={`mailto:${msg.user.email}`} sx={{ ml: 1 }}>
                              {msg.user.email}
                            </Link> */}
                          </Typography>
                        </Box>

                        <Button
                          variant="outlined"
                          size="small"
                          href={`mailto:${msg.user.email}`}
                        >
                          Reply via Email
                        </Button>
                      </Box>

                      {/* Message details */}
                      <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
                        {msg.messageDetails}
                      </Typography>

                      <Typography variant="caption" color="text.secondary" >
                        {new Date(msg.date).toLocaleString()}
                      </Typography>

                      {i !== group.messages.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>

                  ))
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MessageList;
