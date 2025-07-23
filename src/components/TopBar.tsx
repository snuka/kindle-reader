import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import {
  WifiOutlined,
  Battery90Outlined,
  HomeOutlined,
  ListOutlined,
  SearchOutlined,
  Brightness7Outlined,
} from '@mui/icons-material';

interface TopBarProps {
  bookTitle: string;
}

const TopBar: React.FC<TopBarProps> = ({ bookTitle }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <Box
      sx={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        borderBottom: '1px solid #ddd',
        bgcolor: '#f8f8f8',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <HomeOutlined sx={{ fontSize: 20, color: '#666' }} />
        <ListOutlined sx={{ fontSize: 20, color: '#666' }} />
        <SearchOutlined sx={{ fontSize: 20, color: '#666' }} />
      </Box>

      <Typography
        variant="body1"
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          color: '#333',
          textAlign: 'center',
          flex: 1,
        }}
      >
        {bookTitle}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Brightness7Outlined sx={{ fontSize: 18, color: '#666' }} />
        <WifiOutlined sx={{ fontSize: 18, color: '#666' }} />
        <Battery90Outlined sx={{ fontSize: 18, color: '#666' }} />
        <Typography variant="body2" sx={{ fontSize: '14px', color: '#666' }}>
          {formatTime(currentTime)}
        </Typography>
      </Box>
    </Box>
  );
};

export default TopBar;