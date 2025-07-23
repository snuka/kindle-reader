import { useState, useEffect, useCallback } from 'react';
import { Highlight, Annotation, HighlightColor, AnnotationWithHighlight } from '../types/annotations';

const HIGHLIGHTS_STORAGE_PREFIX = 'kindle_highlights_';
const ANNOTATIONS_STORAGE_PREFIX = 'kindle_annotations_';

export const useHighlights = (bookId: string) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);

  // Load highlights and annotations from localStorage
  useEffect(() => {
    if (!bookId) return;

    const storedHighlights = localStorage.getItem(`${HIGHLIGHTS_STORAGE_PREFIX}${bookId}`);
    const storedAnnotations = localStorage.getItem(`${ANNOTATIONS_STORAGE_PREFIX}${bookId}`);

    if (storedHighlights) {
      setHighlights(JSON.parse(storedHighlights));
    }

    if (storedAnnotations) {
      setAnnotations(JSON.parse(storedAnnotations));
    }
  }, [bookId]);

  // Save highlights to localStorage
  useEffect(() => {
    if (bookId && highlights.length > 0) {
      localStorage.setItem(`${HIGHLIGHTS_STORAGE_PREFIX}${bookId}`, JSON.stringify(highlights));
    }
  }, [bookId, highlights]);

  // Save annotations to localStorage
  useEffect(() => {
    if (bookId && annotations.length > 0) {
      localStorage.setItem(`${ANNOTATIONS_STORAGE_PREFIX}${bookId}`, JSON.stringify(annotations));
    }
  }, [bookId, annotations]);

  const addHighlight = useCallback((text: string, cfi: string, color: HighlightColor = 'yellow'): Highlight => {
    const newHighlight: Highlight = {
      id: `highlight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      bookId,
      cfi,
      text,
      color,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setHighlights(prev => [...prev, newHighlight]);
    return newHighlight;
  }, [bookId]);

  const updateHighlightColor = useCallback((highlightId: string, color: HighlightColor) => {
    setHighlights(prev => prev.map(h => 
      h.id === highlightId 
        ? { ...h, color, updatedAt: new Date() }
        : h
    ));
  }, []);

  const deleteHighlight = useCallback((highlightId: string) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
    // Also delete associated annotations
    setAnnotations(prev => prev.filter(a => a.highlightId !== highlightId));
  }, []);

  const addAnnotation = useCallback((highlightId: string, content: string, userId: string, userName: string): Annotation => {
    const newAnnotation: Annotation = {
      id: `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      highlightId,
      userId,
      userName,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: [],
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    return newAnnotation;
  }, []);

  const updateAnnotation = useCallback((annotationId: string, content: string) => {
    setAnnotations(prev => prev.map(a => 
      a.id === annotationId 
        ? { ...a, content, updatedAt: new Date() }
        : a
    ));
  }, []);

  const deleteAnnotation = useCallback((annotationId: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== annotationId));
  }, []);

  const addReply = useCallback((annotationId: string, content: string, userId: string, userName: string) => {
    const newReply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      annotationId,
      userId,
      userName,
      content,
      createdAt: new Date(),
    };

    setAnnotations(prev => prev.map(a => 
      a.id === annotationId 
        ? { ...a, replies: [...(a.replies || []), newReply] }
        : a
    ));
  }, []);

  const getAnnotationsWithHighlights = useCallback((): AnnotationWithHighlight[] => {
    // Get all highlights with their annotations
    const annotatedHighlights = highlights.map(highlight => {
      const highlightAnnotations = annotations.filter(a => a.highlightId === highlight.id);
      
      if (highlightAnnotations.length > 0) {
        // Return annotations for this highlight
        return highlightAnnotations.map(annotation => ({
          ...annotation,
          highlight,
        }));
      } else {
        // Return a placeholder for highlights without annotations
        return [{
          id: `placeholder_${highlight.id}`,
          highlightId: highlight.id,
          userId: '',
          userName: '',
          content: '',
          createdAt: highlight.createdAt,
          updatedAt: highlight.updatedAt,
          replies: [],
          highlight,
        }];
      }
    }).flat();
    
    return annotatedHighlights;
  }, [annotations, highlights]);

  const getHighlightById = useCallback((highlightId: string): Highlight | undefined => {
    return highlights.find(h => h.id === highlightId);
  }, [highlights]);

  const getAnnotationsByHighlight = useCallback((highlightId: string): Annotation[] => {
    return annotations.filter(a => a.highlightId === highlightId);
  }, [annotations]);

  return {
    highlights,
    annotations,
    selectedHighlight,
    setSelectedHighlight,
    addHighlight,
    updateHighlightColor,
    deleteHighlight,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    addReply,
    getAnnotationsWithHighlights,
    getHighlightById,
    getAnnotationsByHighlight,
  };
};