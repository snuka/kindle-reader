import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import {
  TodayOutlined,
  DateRangeOutlined,
  TimerOutlined,
  MenuBookOutlined,
} from '@mui/icons-material';

interface StudyStatsPanelProps {
  todayTotal: number;
  weekTotal: number;
  currentSession: number;
  pagesRead: number;
}

const StudyStatsPanel: React.FC<StudyStatsPanelProps> = ({
  todayTotal,
  weekTotal,
  currentSession,
  pagesRead,
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const stats = [
    {
      icon: <TodayOutlined sx={{ fontSize: 16 }} />,
      label: "Today's total",
      value: formatTime(todayTotal),
    },
    {
      icon: <DateRangeOutlined sx={{ fontSize: 16 }} />,
      label: 'This week',
      value: formatTime(weekTotal),
    },
    {
      icon: <TimerOutlined sx={{ fontSize: 16 }} />,
      label: 'Current session',
      value: formatTime(currentSession),
    },
    {
      icon: <MenuBookOutlined sx={{ fontSize: 16 }} />,
      label: 'Pages read',
      value: pagesRead.toString(),
    },
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '100%',
        right: 0,
        mt: 1,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        p: 2,
        minWidth: '200px',
        zIndex: 100,
        animation: 'slideDown 0.2s ease-out',
        '@keyframes slideDown': {
          from: { transform: 'translateY(-10px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontSize: '12px', color: '#666', mb: 1.5, fontWeight: 600 }}
      >
        STUDY STATISTICS
      </Typography>

      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 0.75,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: '#999' }}>{stat.icon}</Box>
              <Typography variant="caption" sx={{ fontSize: '12px', color: '#666' }}>
                {stat.label}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ fontSize: '13px', color: '#333', fontWeight: 500 }}
            >
              {stat.value}
            </Typography>
          </Box>
          {index < stats.length - 1 && (
            <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.06)' }} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default StudyStatsPanel;