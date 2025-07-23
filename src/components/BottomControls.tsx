import React from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import {
  NavigateBeforeOutlined,
  NavigateNextOutlined,
  HomeOutlined,
  UndoOutlined,
  MoreVertOutlined,
  PlayCircleOutlineOutlined,
  AccessTimeOutlined,
} from '@mui/icons-material';

interface BottomControlsProps {
  bookTitle: string;
  chapterTitle: string;
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onLocationChange: (value: number) => void;
}

const BottomControls: React.FC<BottomControlsProps> = ({
  bookTitle,
  chapterTitle,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onLocationChange,
}) => {
  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  return (
    <Box
      sx={{
        bgcolor: '#f8f8f8',
        borderTop: '1px solid #ddd',
        p: 2,
      }}
    >
      {/* Book and Chapter Info */}
      <Box sx={{ mb: 2, px: 2 }}>
        <Typography variant="body2" sx={{ fontSize: '13px', color: '#666', mb: 0.5 }}>
          {bookTitle}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
          10 · {chapterTitle}
        </Typography>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ fontSize: '12px', color: '#666', minWidth: '45px' }}>
            04:47:24
          </Typography>
          <Slider
            value={progress}
            onChange={(_, value) => onLocationChange(value as number)}
            sx={{
              flex: 1,
              '& .MuiSlider-rail': {
                height: 3,
                bgcolor: '#ddd',
              },
              '& .MuiSlider-track': {
                height: 3,
                bgcolor: '#666',
              },
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                bgcolor: '#666',
              },
            }}
          />
          <Typography variant="caption" sx={{ fontSize: '12px', color: '#666', minWidth: '45px' }}>
            -8:49:25
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: '11px', color: '#999' }}>
            344 of 671
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '11px', color: '#999' }}>
            28 pages left in this chapter
          </Typography>
        </Box>
      </Box>

      {/* Control Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 1,
        }}
      >
        <IconButton onClick={onPrevious} sx={{ p: 1 }}>
          <NavigateBeforeOutlined sx={{ fontSize: 28, color: '#666' }} />
        </IconButton>

        <IconButton sx={{ p: 1 }}>
          <UndoOutlined sx={{ fontSize: 22, color: '#666' }} />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontSize: '12px', color: '#666' }}>
            Speed 1x
          </Typography>
          <IconButton sx={{ p: 1 }}>
            <PlayCircleOutlineOutlined sx={{ fontSize: 36, color: '#666' }} />
          </IconButton>
          <Typography variant="caption" sx={{ fontSize: '12px', color: '#666' }}>
            Chapters
          </Typography>
        </Box>

        <IconButton sx={{ p: 1 }}>
          <AccessTimeOutlined sx={{ fontSize: 22, color: '#666' }} />
        </IconButton>

        <IconButton onClick={onNext} sx={{ p: 1 }}>
          <NavigateNextOutlined sx={{ fontSize: 28, color: '#666' }} />
        </IconButton>
      </Box>

      {/* Bottom Navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          mt: 2,
          pt: 2,
          borderTop: '1px solid #eee',
        }}
      >
        <IconButton sx={{ p: 0.5 }}>
          <HomeOutlined sx={{ fontSize: 20, color: '#666' }} />
        </IconButton>
        <IconButton sx={{ p: 0.5 }}>
          <NavigateBeforeOutlined sx={{ fontSize: 20, color: '#666' }} />
        </IconButton>
        <IconButton sx={{ p: 0.5 }}>
          <MoreVertOutlined sx={{ fontSize: 20, color: '#666' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default BottomControls;