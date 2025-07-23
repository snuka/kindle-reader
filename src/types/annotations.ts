export type HighlightColor = 'yellow' | 'blue' | 'pink' | 'orange';

export interface Highlight {
  id: string;
  bookId: string;
  cfi: string; // EPUB CFI (Canonical Fragment Identifier) for location
  text: string;
  color: HighlightColor;
  createdAt: Date;
  updatedAt: Date;
}

export interface Annotation {
  id: string;
  highlightId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  replies?: AnnotationReply[];
}

export interface AnnotationReply {
  id: string;
  annotationId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface AnnotationWithHighlight extends Annotation {
  highlight: Highlight;
}

export interface SelectionInfo {
  text: string;
  cfi: string;
  bounds: DOMRect;
}