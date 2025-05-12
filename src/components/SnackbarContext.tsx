// src/context/SnackbarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

// Define types for Snackbar messages
interface SnackbarMessage {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  key?: number; // For unique rendering
}

interface SnackbarContextType {
  showMessage: (message: string, severity?: SnackbarMessage['severity']) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

// Custom hook to access the context
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

// Snackbar Provider component
interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [, setSnackbars] = useState<SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<SnackbarMessage | null>(null);

  const showMessage = (message: string, severity: SnackbarMessage['severity'] = 'info') => {
    const newMessage: SnackbarMessage = {
      message,
      severity,
      key: Date.now(), // Unique key for each message
    };
    setSnackbars((prev) => [...prev, newMessage]);
    if (!open) {
      // Show immediately if no Snackbar is open
      setCurrentMessage(newMessage);
      setOpen(true);
    }
  };

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return; 
    }
    setOpen(false);
  };

  const handleExited = () => {
    setSnackbars((prev) => {
      const [, ...rest] = prev;
      if (rest.length > 0) {
        setCurrentMessage(rest[0]);
        setOpen(true);
      } else {
        setCurrentMessage(null);
      }
      return rest;
    });
  };

  const SlideTransition = (props: any) => {
    return <Slide {...props} direction="down" />;
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      {currentMessage && (
        <Snackbar
          key={currentMessage.key}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          TransitionProps={{ onExited: handleExited }}
          TransitionComponent={SlideTransition}
          slotProps={{
            root: {
              sx: {
                top: '100px !important', // required to override default
              },
            },
          }}
        >
          <Alert
            onClose={handleClose}
            severity={currentMessage.severity}
            sx={{ width: '100%' }}
            variant="filled"
          >
            {currentMessage.message}
          </Alert>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
};