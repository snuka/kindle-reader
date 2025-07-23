import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Badge } from '@mui/material';
import {
  WifiOutlined,
  Battery90Outlined,
  HomeOutlined,
  SearchOutlined,
  Brightness7Outlined,
  NotesOutlined,
} from '@mui/icons-material';

import StudyTimer from './StudyTimer';

interface TopBarProps {
  bookTitle: string;
  isVisible: boolean;
  onSearchClick: () => void;
  onAnnotationsClick?: () => void;
  annotationsCount?: number;
  studyTime: number;
  todayTotal: number;
  weekTotal: number;
  currentSessionPages: number;
}

const TopBar: React.FC<TopBarProps> = ({ 
  bookTitle, 
  isVisible, 
  onSearchClick,
  onAnnotationsClick,
  annotationsCount = 0,
  studyTime,
  todayTotal,
  weekTotal,
  currentSessionPages,
}) => {

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        bgcolor: 'transparent',
        zIndex: 10,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: '200px' }}>
        <IconButton sx={{ p: 0.5 }} onClick={(e) => e.stopPropagation()}>
          <HomeOutlined sx={{ fontSize: 20, color: '#666' }} />
        </IconButton>
        <IconButton sx={{ p: 0.5 }} onClick={(e) => { e.stopPropagation(); onSearchClick(); }}>
          <SearchOutlined sx={{ fontSize: 20, color: '#666' }} />
        </IconButton>
        {onAnnotationsClick && (
          <IconButton sx={{ p: 0.5 }} onClick={(e) => { e.stopPropagation(); onAnnotationsClick(); }}>
            <Badge badgeContent={annotationsCount} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
              <NotesOutlined sx={{ fontSize: 20, color: '#666' }} />
            </Badge>
          </IconButton>
        )}
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: '200px', justifyContent: 'flex-end' }}>
        <Brightness7Outlined sx={{ fontSize: 18, color: '#666' }} />
        <WifiOutlined sx={{ fontSize: 18, color: '#666' }} />
        <Battery90Outlined sx={{ fontSize: 18, color: '#666' }} />
        <StudyTimer
          studyTime={studyTime}
          todayTotal={todayTotal}
          weekTotal={weekTotal}
          currentSessionPages={currentSessionPages}
        />
      </Box>
    </Box>
  );
};

export default TopBar;