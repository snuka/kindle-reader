import React from 'react';
import { Box, Typography } from '@mui/material';

interface BottomControlsProps {
  currentPage: number;
  totalPages: number;
}

const BottomControls: React.FC<BottomControlsProps> = ({
  currentPage,
  totalPages,
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        px: 4,
        zIndex: 5,
      }}
    >
      <Typography variant="caption" sx={{ fontSize: '12px', color: '#999' }}>
        344
      </Typography>
      <Typography variant="caption" sx={{ fontSize: '12px', color: '#999' }}>
        345
      </Typography>
    </Box>
  );
};

export default BottomControls;