import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import { ExpandMoreOutlined, ExpandLessOutlined } from '@mui/icons-material';
import StudyStatsPanel from './StudyStatsPanel';

interface StudyTimerProps {
  studyTime: number; // in seconds
  todayTotal: number;
  weekTotal: number;
  currentSessionPages: number;
}

const StudyTimer: React.FC<StudyTimerProps> = ({
  studyTime,
  todayTotal,
  weekTotal,
  currentSessionPages,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleToggle = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      // Auto-collapse after 5 seconds
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
      collapseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
    } else {
      setIsExpanded(false);
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    };
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { opacity: 0.8 },
        }}
        onClick={handleToggle}
      >
        <Typography variant="body2" sx={{ fontSize: '14px', color: '#666' }}>
          Study: {formatTime(studyTime)}
        </Typography>
        <Box sx={{ ml: 0.5, color: '#666', display: 'flex', alignItems: 'center' }}>
          {isExpanded ? (
            <ExpandLessOutlined sx={{ fontSize: 16 }} />
          ) : (
            <ExpandMoreOutlined sx={{ fontSize: 16 }} />
          )}
        </Box>
      </Box>

      <Collapse 
        in={isExpanded}
        timeout={{ enter: 50, exit: 50 }}
      >
        <StudyStatsPanel
          todayTotal={todayTotal}
          weekTotal={weekTotal}
          currentSession={studyTime}
          pagesRead={currentSessionPages}
        />
      </Collapse>
    </Box>
  );
};

export default StudyTimer;