declare module 'react-reader' {
  import { ReactElement } from 'react';

  export interface ReactReaderProps {
    url: string;
    location?: string | number | null;
    locationChanged?: (location: string) => void;
    getRendition?: (rendition: any) => void;
    epubOptions?: any;
    epubInitOptions?: any;
    swipeable?: boolean;
    styles?: any;
  }

  export const ReactReader: (props: ReactReaderProps) => ReactElement;
}