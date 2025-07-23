import React, { useState, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import { ReactReader } from 'react-reader';
import TopBar from './TopBar';
import BottomControls from './BottomControls';

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
    });
    rendition.themes.select('kindle');
  }, []);

  const handlePrevious = () => {
    if (rendition) {
      rendition.prev();
    }
  };

  const handleNext = () => {
    if (rendition) {
      rendition.next();
    }
  };

  const handleLocationChange = (value: number) => {
    if (rendition && rendition.book) {
      const percentage = value / 100;
      const location = rendition.book.locations.cfiFromPercentage(percentage);
      rendition.display(location);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#e8e8e8',
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: '768px',
          height: '1024px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TopBar bookTitle={bookTitle} />
        
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#fff',
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
          bookTitle={bookTitle}
          chapterTitle={chapterTitle}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onLocationChange={handleLocationChange}
        />
      </Paper>
    </Box>
  );
};

export default KindleReader;