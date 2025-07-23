import React, { useRef, useEffect } from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import { SearchOutlined, CloseOutlined } from '@mui/icons-material';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  isVisible: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onClose,
  isVisible,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: '100px',
        animation: 'fadeIn 0.2s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          width: '600px',
          maxWidth: '90%',
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          px: 3,
          py: 2,
          gap: 2,
          transform: 'translateY(-20px)',
          opacity: 0,
          animation: 'slideDown 0.3s ease-out forwards',
          animationFillMode: 'both',
          '@keyframes slideDown': {
            from: { transform: 'translateY(-20px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 },
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <SearchOutlined sx={{ color: '#999', fontSize: 24 }} />
        <InputBase
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          sx={{
            flex: 1,
            fontSize: '18px',
            '& input': {
              padding: 0,
            },
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: '#999',
              fontSize: '14px',
            }}
          >
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                px: 0.7,
                py: 0.2,
                fontSize: '12px',
              }}
            >
              ⌘
            </Box>
            <Box sx={{ fontSize: '16px' }}>+</Box>
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                px: 0.7,
                py: 0.2,
                fontSize: '12px',
              }}
            >
              K
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ p: 0.5 }}>
            <CloseOutlined sx={{ fontSize: 20, color: '#999' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchBar;