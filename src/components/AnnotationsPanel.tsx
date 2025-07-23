import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tab,
  Tabs,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Reply as ReplyIcon,
} from '@mui/icons-material';
import { AnnotationWithHighlight, Highlight } from '../types/annotations';
import { formatDistanceToNow } from '../utils/dateUtils';

interface AnnotationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  annotations: AnnotationWithHighlight[];
  onAddAnnotation: (highlightId: string, content: string) => void;
  onUpdateAnnotation: (annotationId: string, content: string) => void;
  onDeleteAnnotation: (annotationId: string) => void;
  onAddReply: (annotationId: string, content: string) => void;
  currentUserId: string;
  currentUserName: string;
}

const AnnotationsPanel: React.FC<AnnotationsPanelProps> = ({
  isOpen,
  onClose,
  annotations,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  onAddReply,
  currentUserId,
  currentUserName,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [newAnnotationContent, setNewAnnotationContent] = useState<{ [key: string]: string }>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditStart = (annotation: AnnotationWithHighlight) => {
    setEditingId(annotation.id);
    setEditContent(annotation.content);
  };

  const handleEditSave = () => {
    if (editingId && editContent.trim()) {
      onUpdateAnnotation(editingId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleReplyStart = (annotationId: string) => {
    setReplyingToId(annotationId);
    setReplyContent('');
  };

  const handleReplySave = () => {
    if (replyingToId && replyContent.trim()) {
      onAddReply(replyingToId, replyContent.trim());
      setReplyingToId(null);
      setReplyContent('');
    }
  };

  const handleReplyCancel = () => {
    setReplyingToId(null);
    setReplyContent('');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, annotationId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedAnnotationId(annotationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAnnotationId(null);
  };

  const handleDelete = () => {
    if (selectedAnnotationId) {
      onDeleteAnnotation(selectedAnnotationId);
    }
    handleMenuClose();
  };

  const handleNewAnnotationSave = (highlightId: string) => {
    const content = newAnnotationContent[highlightId];
    if (content && content.trim()) {
      onAddAnnotation(highlightId, content.trim());
      setNewAnnotationContent(prev => {
        const next = { ...prev };
        delete next[highlightId];
        return next;
      });
    }
  };

  const getHighlightColorHex = (color: string) => {
    const colorMap: Record<string, string> = {
      yellow: '#FFD700',
      blue: '#87CEEB',
      pink: '#FFB6C1',
      orange: '#FFA500',
    };
    return colorMap[color] || '#FFD700';
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 420,
          boxSizing: 'border-box',
          backgroundColor: '#f7f7f7',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
        },
        zIndex: 1300,
      }}
    >
      <Box sx={{ 
        p: 2.5, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          fontSize: '18px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          color: '#1a1a1a',
        }}>
          Annotations
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#666' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ 
          px: 2,
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            color: '#666',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
            '&.Mui-selected': {
              color: '#1a1a1a',
              fontWeight: 600,
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#1a1a1a',
            height: 3,
          },
        }}
      >
        <Tab label={`Annotations ${annotations.length}`} />
        <Tab label="Page Notes" />
      </Tabs>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2, backgroundColor: '#f7f7f7' }}>
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {annotations.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                Select text and highlight it to start annotating
              </Typography>
            ) : (
              annotations.map((annotation) => (
              <Card key={annotation.id} elevation={0} sx={{ 
                p: 2.5,
                backgroundColor: '#fff',
                borderRadius: 2,
                border: '1px solid #e8e8e8',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Avatar sx={{ 
                    width: 36, 
                    height: 36, 
                    fontSize: 14,
                    backgroundColor: '#e0e0e0',
                    color: '#666',
                    fontWeight: 600,
                  }}>
                    {annotation.userName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ 
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {annotation.userName}
                      </Typography>
                      <Typography sx={{ 
                        fontSize: '13px',
                        color: '#999',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {formatDistanceToNow(annotation.createdAt)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 1,
                        backgroundColor: getHighlightColorHex(annotation.highlight.color) + '20',
                        borderLeft: `3px solid ${getHighlightColorHex(annotation.highlight.color)}`,
                        position: 'relative',
                      }}
                    >
                      <Typography sx={{ 
                        fontSize: '14px',
                        fontStyle: 'italic',
                        color: '#333',
                        lineHeight: 1.6,
                        fontFamily: 'Georgia, serif',
                      }}>
                        {annotation.highlight.text}
                      </Typography>
                    </Box>

                    {editingId === annotation.id ? (
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          variant="outlined"
                          size="small"
                          autoFocus
                        />
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Button size="small" onClick={handleEditSave}>
                            Save
                          </Button>
                          <Button size="small" onClick={handleEditCancel} color="inherit">
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : annotation.content ? (
                      <>
                        <Typography sx={{ 
                          mb: 1.5,
                          fontSize: '14px',
                          color: '#333',
                          lineHeight: 1.6,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                        }}>
                          {annotation.content}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', mt: 1 }}>
                          {annotation.userId === currentUserId && (
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditStart(annotation)}
                              sx={{ 
                                color: '#666',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                              }}
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, annotation.id)}
                            sx={{ 
                              color: '#666',
                              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleReplyStart(annotation.id)}
                            sx={{ 
                              color: '#666',
                              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                            }}
                          >
                            <ReplyIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton 
                            size="small"
                            sx={{ 
                              color: '#666',
                              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                            }}
                          >
                            <ShareIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      </>
                    ) : (
                      // Show input for new annotation
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={newAnnotationContent[annotation.highlightId] || ''}
                          onChange={(e) => setNewAnnotationContent(prev => ({ 
                            ...prev, 
                            [annotation.highlightId]: e.target.value 
                          }))}
                          placeholder="Add a note..."
                          variant="outlined"
                          size="small"
                          autoFocus
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '14px',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
                            },
                          }}
                        />
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Button 
                            size="small" 
                            onClick={() => handleNewAnnotationSave(annotation.highlightId)}
                            disabled={!newAnnotationContent[annotation.highlightId]?.trim()}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {annotation.replies && annotation.replies.length > 0 && (
                      <Box sx={{ mt: 2, ml: 2 }}>
                        {annotation.replies.map((reply) => (
                          <Box key={reply.id} sx={{ mb: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {reply.userName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDistanceToNow(reply.createdAt)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                              {reply.content}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {replyingToId === annotation.id && (
                      <Box sx={{ mt: 2, ml: 2 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          variant="outlined"
                          size="small"
                          placeholder="Write a reply..."
                          autoFocus
                        />
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Button size="small" onClick={handleReplySave}>
                            Reply
                          </Button>
                          <Button size="small" onClick={handleReplyCancel} color="inherit">
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Card>
            ))
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            No page notes yet
          </Typography>
        )}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Drawer>
  );
};

export default AnnotationsPanel;