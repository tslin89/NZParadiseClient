import React from 'react';
import { Typography, Box } from '@mui/material';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Za-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (pwd.length === 0) return { label: '', color: 'gray' };
    if (score <= 2) return { label: 'Weak', color: 'red' };
    if (score === 3) return { label: 'Medium', color: 'orange' };
    return { label: 'Strong', color: 'green' };
  };

  const { label, color } = calculateStrength(password);

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" color={color}>
        Password Strength: {label}
      </Typography>
    </Box>
  );
};

export default PasswordStrength;