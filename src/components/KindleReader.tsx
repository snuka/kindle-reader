import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { ReactReader } from 'react-reader';
import TopBar from './TopBar';
import BottomControls from './BottomControls';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import SelectionPopup from './SelectionPopup';
import AnnotationsPanel from './AnnotationsPanel';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { useHighlights } from '../hooks/useHighlights';
import { SelectionInfo, HighlightColor } from '../types/annotations';

interface KindleReaderProps {
  url?: string;
}

const KindleReader: React.FC<KindleReaderProps> = ({ url }) => {
  const [location, setLocation] = useState<string | number | null>(null);
  const [rendition, setRendition] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [bookTitle, setBookTitle] = useState<string>('The Unfair Advantage');
  const [chapterTitle, setChapterTitle] = useState<string>('Education and Expertise');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSelection, setCurrentSelection] = useState<SelectionInfo | null>(null);
  const [highlightPopupPosition, setHighlightPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showHighlightPopup, setShowHighlightPopup] = useState(false);
  const [isAnnotationsPanelOpen, setIsAnnotationsPanelOpen] = useState(false);
  
  // Study timer hook
  const {
    currentSessionTime,
    todayTotal,
    weekTotal,
    currentSessionPages,
    incrementPages,
  } = useStudyTimer(bookTitle);

  // Highlights hook
  const {
    highlights,
    annotations,
    addHighlight,
    updateHighlightColor,
    deleteHighlight,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    addReply,
    getAnnotationsWithHighlights,
  } = useHighlights(bookTitle);

  const locationChanged = useCallback((epubcifi: string) => {
    setLocation(epubcifi);
    if (rendition) {
      const currentLocation = rendition.currentLocation();
      if (currentLocation?.start) {
        setCurrentPage(currentLocation.start.displayed.page);
      }
    }
  }, [rendition]);

  const getRendition = useCallback((rendition: any) => {
    setRendition(rendition);
    rendition.themes.register('kindle', {
      body: {
        fontFamily: 'Georgia, serif',
        fontSize: '1.2em',
        lineHeight: '1.6',
        textAlign: 'justify',
        margin: '0 40px',
        color: '#000',
        background: '#fff',
      },
      p: {
        marginBottom: '1em',
        textIndent: '1.5em',
      },
      'h1, h2, h3': {
        fontWeight: 'bold',
        marginTop: '1.5em',
        marginBottom: '0.5em',
        textAlign: 'center',
      },
      '.epubjs-hl': {
        'fill': 'transparent !important',
        'fill-opacity': '0 !important',
        'mix-blend-mode': 'multiply !important',
      },
      '.epubjs-hl.highlight-yellow': {
        'fill': 'rgba(255, 215, 0, 0.4) !important',
        'fill-opacity': '1 !important',
      },
      '.epubjs-hl.highlight-blue': {
        'fill': 'rgba(135, 206, 235, 0.4) !important',
        'fill-opacity': '1 !important',
      },
      '.epubjs-hl.highlight-pink': {
        'fill': 'rgba(255, 182, 193, 0.4) !important',
        'fill-opacity': '1 !important',
      },
      '.epubjs-hl.highlight-orange': {
        'fill': 'rgba(255, 165, 0, 0.4) !important',
        'fill-opacity': '1 !important',
      },
    });
    rendition.themes.select('kindle');
    
    // Hide the react-reader's built-in hamburger menu
    setTimeout(() => {
      const hamburgerButton = document.querySelector('button[style*="position: absolute"][style*="top: 10px"][style*="left: 10px"]');
      if (hamburgerButton) {
        (hamburgerButton as HTMLElement).style.display = 'none';
      }
    }, 100);

    // Add text selection handler
    rendition.on('selected', (cfiRange: string, contents: any) => {
      const selection = contents.window.getSelection();
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const bounds = range.getBoundingClientRect();
        const containerBounds = contents.documentElement.getBoundingClientRect();
        
        setCurrentSelection({
          text: selection.toString(),
          cfi: cfiRange,
          bounds: bounds,
        });

        // Calculate popup position relative to the page
        const viewportHeight = window.innerHeight;
        const popupHeight = 50; // Approximate height of popup
        const popupWidth = 250; // Approximate width of popup
        
        // Calculate X position (center above selection)
        let x = bounds.left + (bounds.width / 2) - (popupWidth / 2);
        // Keep popup within viewport bounds
        x = Math.max(10, Math.min(x, window.innerWidth - popupWidth - 10));
        
        // Calculate Y position (above selection if space, otherwise below)
        let y = bounds.top - popupHeight - 10;
        if (y < 10) {
          y = bounds.bottom + 10;
        }
        
        setHighlightPopupPosition({ x, y });
        setShowHighlightPopup(true);
      }
    });

    // Load existing highlights
    setTimeout(() => {
      highlights.forEach(highlight => {
        rendition.annotations.add(
          'highlight',
          highlight.cfi,
          {},
          () => {
            // Handle click on highlight to open annotations panel
            setIsAnnotationsPanelOpen(true);
          },
          `highlight-${highlight.color}`,
          { 
            id: highlight.id,
            'data-color': highlight.color 
          }
        );
      });
    }, 100);
  }, [highlights]);

  const handlePrevious = () => {
    if (rendition) {
      rendition.prev();
      incrementPages();
    }
  };

  const handleNext = () => {
    if (rendition) {
      rendition.next();
      incrementPages();
    }
  };

  const handleLocationChange = (value: number) => {
    if (rendition && rendition.book) {
      const percentage = value / 100;
      const location = rendition.book.locations.cfiFromPercentage(percentage);
      rendition.display(location);
    }
  };

  const handleMouseEnter = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      setHideTimer(null);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setIsHovered(false);
    }, 2000); // Hide after 2 seconds
    setHideTimer(timer);
  };

  const handleMouseMove = () => {
    if (!isHovered) {
      setIsHovered(true);
    }
    if (hideTimer) {
      clearTimeout(hideTimer);
      const timer = setTimeout(() => {
        setIsHovered(false);
      }, 2000);
      setHideTimer(timer);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Search shortcut (Cmd+K or Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Annotations shortcut (Cmd+H or Ctrl+H)
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        setIsAnnotationsPanelOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (query) {
      // For now, use mock search results to avoid the runtime error
      // Real epub.js search will be implemented after ensuring book is loaded
      const mockResults = [
        {
          page: 344,
          text: `Education doesn't stop when you get out of school. In fact, it doesn't start when you get into school. Life is learning, from the moment you arrive. ${query} appears here...`,
          cfi: 'epubcfi(/6/2[id1]!/4/2/2)'
        },
        {
          page: 345,
          text: `Even though he is a voracious reader now, it never suited Ash to go to university. He learned best from reading and doing in a self-directed way. The word ${query} is mentioned here...`,
          cfi: 'epubcfi(/6/2[id2]!/4/2/4)'
        }
      ].filter(result => 
        result.text.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  }, []);

  const handleSearchResultClick = (cfi: string) => {
    if (rendition) {
      rendition.display(cfi);
      handleSearchClose();
    }
  };

  const handleAnnotate = useCallback(() => {
    if (currentSelection && rendition) {
      // First create a yellow highlight by default
      const highlight = addHighlight(currentSelection.text, currentSelection.cfi, 'yellow');
      
      // Add highlight annotation to the rendition
      rendition.annotations.add(
        'highlight',
        currentSelection.cfi,
        {},
        () => {
          // Handle click on highlight to open annotations panel
          setIsAnnotationsPanelOpen(true);
        },
        'highlight-yellow',
        { 
          id: highlight.id,
          'data-color': 'yellow' 
        }
      );
      
      // Clear selection
      setCurrentSelection(null);
      setShowHighlightPopup(false);
      
      // Open annotations panel immediately for annotation
      setIsAnnotationsPanelOpen(true);
    }
  }, [currentSelection, rendition, addHighlight]);

  const handleHighlightColor = useCallback((color: HighlightColor) => {
    if (currentSelection && rendition) {
      const highlight = addHighlight(currentSelection.text, currentSelection.cfi, color);
      
      // Add highlight annotation to the rendition
      rendition.annotations.add(
        'highlight',
        currentSelection.cfi,
        {},
        () => {
          // Handle click on highlight to open annotations panel
          setIsAnnotationsPanelOpen(true);
        },
        `highlight-${color}`,
        { 
          id: highlight.id,
          'data-color': color 
        }
      );
      
      // Clear selection
      setCurrentSelection(null);
      setShowHighlightPopup(false);
      
      // Don't open annotations panel for just highlighting
    }
  }, [currentSelection, rendition, addHighlight]);

  const handleHighlightPopupClose = () => {
    setShowHighlightPopup(false);
    setCurrentSelection(null);
  };

  // Close highlight popup when clicking outside
  useEffect(() => {
    const handleClick = () => {
      if (showHighlightPopup) {
        setShowHighlightPopup(false);
        setCurrentSelection(null);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showHighlightPopup]);

  const handleAddAnnotation = useCallback((highlightId: string, content: string) => {
    // For now, use a hardcoded user - in a real app this would come from auth
    addAnnotation(highlightId, content, 'user1', 'Current User');
  }, [addAnnotation]);

  const handleAddReply = useCallback((annotationId: string, content: string) => {
    // For now, use a hardcoded user - in a real app this would come from auth
    addReply(annotationId, content, 'user1', 'Current User');
  }, [addReply]);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#fff',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <TopBar 
        bookTitle={bookTitle} 
        isVisible={isHovered} 
        onSearchClick={handleSearchClick}
        onAnnotationsClick={() => setIsAnnotationsPanelOpen(true)}
        annotationsCount={annotations.length}
        studyTime={currentSessionTime}
        todayTotal={todayTotal}
        weekTotal={weekTotal}
        currentSessionPages={currentSessionPages}
      />
      
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        <ReactReader
          url={url || 'https://react-reader.metabits.no/files/alice.epub'}
          location={location}
          locationChanged={locationChanged}
          getRendition={getRendition}
          epubOptions={{
            flow: 'paginated',
            manager: 'default',
          }}
        />
      </Box>

      <BottomControls
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClose={handleSearchClose}
        isVisible={isSearchOpen}
      />

      <SearchResults
        searchQuery={searchQuery}
        results={searchResults}
        onResultClick={handleSearchResultClick}
        isVisible={isSearchOpen}
      />

      <SelectionPopup
        position={highlightPopupPosition}
        onAnnotate={handleAnnotate}
        onHighlight={handleHighlightColor}
        onClose={handleHighlightPopupClose}
        visible={showHighlightPopup}
      />

      {/* Blur backdrop when annotations panel is open */}
      {isAnnotationsPanelOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(3px)',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            zIndex: 1200,
            pointerEvents: 'none',
          }}
        />
      )}

      <AnnotationsPanel
        isOpen={isAnnotationsPanelOpen}
        onClose={() => setIsAnnotationsPanelOpen(false)}
        annotations={getAnnotationsWithHighlights()}
        onAddAnnotation={handleAddAnnotation}
        onUpdateAnnotation={updateAnnotation}
        onDeleteAnnotation={deleteAnnotation}
        onAddReply={handleAddReply}
        currentUserId="user1"
        currentUserName="Current User"
      />
    </Box>
  );
};

export default KindleReader;