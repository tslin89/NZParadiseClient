// src/context/BannerContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert, Collapse } from '@mui/material';

interface BannerContextType {
  showBanner: (message: string) => void;
  hideBanner: () => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const useBanner = () => {
  const context = useContext(BannerContext);
  if (!context) throw new Error("useBanner must be used within a BannerProvider");
  return context;
};

export const BannerProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);

  const showBanner = (msg: string) => setMessage(msg);
  const hideBanner = () => setMessage(null);

  return (
    <BannerContext.Provider value={{ showBanner, hideBanner }}>
      <>
        <Collapse in={!!message}>
          {message && (
            <Alert
              severity="error"
              onClose={hideBanner}
              sx={{ borderRadius: 1 }}
              variant="filled"
            >
              {message}
            </Alert>
          )}
        </Collapse>
        {children}
      </>
    </BannerContext.Provider>
  );
};
