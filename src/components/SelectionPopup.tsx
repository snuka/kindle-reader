import React, { useState } from 'react';
import { Paper, Button, Box, IconButton } from '@mui/material';
import { 
  FormatColorFill as HighlightIcon,
  Comment as AnnotateIcon 
} from '@mui/icons-material';
import { HighlightColor } from '../types/annotations';

interface SelectionPopupProps {
  position: { x: number; y: number };
  onAnnotate: () => void;
  onHighlight: (color: HighlightColor) => void;
  onClose: () => void;
  visible: boolean;
}

const colors: { color: HighlightColor; hex: string }[] = [
  { color: 'yellow', hex: '#FFD700' },
  { color: 'blue', hex: '#87CEEB' },
  { color: 'pink', hex: '#FFB6C1' },
  { color: 'orange', hex: '#FFA500' },
];

const SelectionPopup: React.FC<SelectionPopupProps> = ({
  position,
  onAnnotate,
  onHighlight,
  onClose,
  visible,
}) => {
  const [showColors, setShowColors] = useState(false);

  if (!visible) return null;

  const handleAnnotateClick = () => {
    onAnnotate();
    onClose();
  };

  const handleHighlightClick = () => {
    setShowColors(true);
  };

  const handleColorSelect = (color: HighlightColor) => {
    onHighlight(color);
    onClose();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: 9999,
        p: 0.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        minWidth: showColors ? 'auto' : 120,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {!showColors ? (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button
            startIcon={<AnnotateIcon />}
            onClick={handleAnnotateClick}
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              color: '#333',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            Annotate
          </Button>
          <Button
            startIcon={<HighlightIcon />}
            onClick={handleHighlightClick}
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              color: '#333',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            Highlight
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 0.5, p: 0.5 }}>
          {colors.map(({ color, hex }) => (
            <IconButton
              key={color}
              onClick={() => handleColorSelect(color)}
              sx={{
                width: 28,
                height: 28,
                backgroundColor: hex,
                opacity: 0.8,
                '&:hover': {
                  backgroundColor: hex,
                  opacity: 1,
                  transform: 'scale(1.1)',
                },
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default SelectionPopup;