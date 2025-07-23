import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemButton } from '@mui/material';
import { DescriptionOutlined, CommentOutlined } from '@mui/icons-material';

interface SearchResult {
  page: number;
  text: string;
  cfi: string;
}

interface SearchResultsProps {
  searchQuery: string;
  results: SearchResult[];
  onResultClick: (cfi: string) => void;
  isVisible: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  results,
  onResultClick,
  isVisible,
}) => {
  if (!isVisible || !searchQuery) return null;

  const highlightText = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Box
              key={index}
              component="span"
              sx={{ bgcolor: '#ffeb3b', fontWeight: 'bold' }}
            >
              {part}
            </Box>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '180px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        maxWidth: '90%',
        maxHeight: '60vh',
        bgcolor: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        zIndex: 1001,
        animation: 'slideDown 0.3s ease-out',
        '@keyframes slideDown': {
          from: { transform: 'translateX(-50%) translateY(-20px)', opacity: 0 },
          to: { transform: 'translateX(-50%) translateY(0)', opacity: 1 },
        },
      }}
    >
      <Box sx={{ overflowY: 'auto', maxHeight: '60vh' }}>
        {/* Pages Section */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <DescriptionOutlined sx={{ fontSize: 20, color: '#666' }} />
            <Typography variant="subtitle2" sx={{ color: '#666', textTransform: 'uppercase' }}>
              Pages
            </Typography>
            {results.length > 0 && (
              <Typography variant="caption" sx={{ color: '#999' }}>
                ({results.length} results)
              </Typography>
            )}
          </Box>

          {results.length > 0 ? (
            <List sx={{ py: 0 }}>
              {results.map((result, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => onResultClick(result.cfi)}
                    sx={{
                      borderRadius: '8px',
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Page {result.page}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#333',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {highlightText(result.text, searchQuery)}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ color: '#999', py: 2 }}>
              No pages found containing "{searchQuery}"
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Comments Section */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CommentOutlined sx={{ fontSize: 20, color: '#666' }} />
            <Typography variant="subtitle2" sx={{ color: '#666', textTransform: 'uppercase' }}>
              Comments
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: '#999', py: 2 }}>
            No comments found containing "{searchQuery}"
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchResults;